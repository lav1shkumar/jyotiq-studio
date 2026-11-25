// person_matte.swift -- Apple Vision person segmentation, no third-party installs.
//
// Usage:
//   person_matte image <in.png> <out_mask.png> [accurate|balanced]
//       -> writes an 8-bit grey matte PNG at the input's size (white = person)
//   person_matte video <in.mp4> [accurate|balanced]
//       -> streams raw gray8 frames (source WxH, one per decoded frame) to stdout,
//          ready for: ffmpeg -f rawvideo -pix_fmt gray -s WxH -r FPS -i - ...
//
// Video mode reuses ONE stateful VNGeneratePersonSegmentationRequest through a
// VNSequenceRequestHandler, so Vision smooths the matte across frames (less edge flicker).
// A frame Vision cannot segment is written as an all-black matte so the frame count
// always matches the source.

import AVFoundation
import CoreImage
import Foundation
import ImageIO
import Vision

func log(_ s: String) {
    FileHandle.standardError.write((s + "\n").data(using: .utf8)!)
}

func makeRequest(_ quality: String) -> VNGeneratePersonSegmentationRequest {
    let r = VNGeneratePersonSegmentationRequest()
    r.qualityLevel = (quality == "balanced") ? .balanced : .accurate
    r.outputPixelFormat = kCVPixelFormatType_OneComponent8
    return r
}

let ciContext = CIContext(options: [.workingColorSpace: NSNull(), .outputColorSpace: NSNull()])

// Lanczos-resample Vision's low-res mask up to the frame size.
func scaledMask(_ buf: CVPixelBuffer, width: Int, height: Int) -> CIImage {
    let m = CIImage(cvPixelBuffer: buf)
    let sx = CGFloat(width) / m.extent.width
    let sy = CGFloat(height) / m.extent.height
    let f = CIFilter(name: "CILanczosScaleTransform")!
    f.setValue(m, forKey: kCIInputImageKey)
    f.setValue(sy, forKey: kCIInputScaleKey)
    f.setValue(sx / sy, forKey: kCIInputAspectRatioKey)
    return f.outputImage!.cropped(to: CGRect(x: 0, y: 0, width: width, height: height))
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    log("usage: person_matte image <in> <out.png> [q] | person_matte video <in.mp4> [q]")
    exit(2)
}

if args[1] == "image" {
    guard args.count >= 4,
          let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[2]) as CFURL, nil),
          let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        log("cannot read image"); exit(1)
    }
    let req = makeRequest(args.count > 4 ? args[4] : "accurate")
    try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    guard let obs = req.results?.first else { log("no person found"); exit(1) }
    let out = scaledMask(obs.pixelBuffer, width: cg.width, height: cg.height)
    try ciContext.writePNGRepresentation(
        of: out, to: URL(fileURLWithPath: args[3]),
        format: .L8, colorSpace: CGColorSpaceCreateDeviceGray())
    log("mask \(CVPixelBufferGetWidth(obs.pixelBuffer))x\(CVPixelBufferGetHeight(obs.pixelBuffer)) -> \(cg.width)x\(cg.height)")
} else if args[1] == "video" {
    let asset = AVURLAsset(url: URL(fileURLWithPath: args[2]))
    guard let track = asset.tracks(withMediaType: .video).first else { log("no video track"); exit(1) }
    let reader = try AVAssetReader(asset: asset)
    let output = AVAssetReaderTrackOutput(
        track: track,
        outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    output.alwaysCopiesSampleData = false
    reader.add(output)
    reader.startReading()

    let req = makeRequest(args.count > 3 ? args[3] : "accurate")
    let seq = VNSequenceRequestHandler()
    let stdout = FileHandle.standardOutput
    var maskBuf: CVPixelBuffer?
    var n = 0
    var misses = 0

    while let sb = output.copyNextSampleBuffer() {
        guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
        let w = CVPixelBufferGetWidth(pb), h = CVPixelBufferGetHeight(pb)
        var frame = Data(count: w * h)  // black by default
        try seq.perform([req], on: pb)
        if let obs = req.results?.first {
            if maskBuf == nil {
                CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_OneComponent8, nil, &maskBuf)
            }
            ciContext.render(scaledMask(obs.pixelBuffer, width: w, height: h), to: maskBuf!)
            CVPixelBufferLockBaseAddress(maskBuf!, .readOnly)
            let base = CVPixelBufferGetBaseAddress(maskBuf!)!
            let bpr = CVPixelBufferGetBytesPerRow(maskBuf!)
            frame.withUnsafeMutableBytes { dst in
                for y in 0..<h {
                    memcpy(dst.baseAddress!.advanced(by: y * w), base.advanced(by: y * bpr), w)
                }
            }
            CVPixelBufferUnlockBaseAddress(maskBuf!, .readOnly)
        } else {
            misses += 1
        }
        stdout.write(frame)
        n += 1
        if n % 300 == 0 { log("frames \(n)") }
    }
    log("done \(n) frames (\(misses) without a person)")
} else {
    log("unknown mode \(args[1])"); exit(2)
}
