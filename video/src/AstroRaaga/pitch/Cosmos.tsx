import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import * as THREE from "three";
import { LIGHT, MoonId, MOONS, moonPos, MOTHER_R, openCam, systemCam } from "./cam";
import { clamp01, prog, rnd } from "./theme";
import { useWinT } from "./ui";

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<6;i++){s+=a*snoise(p);p*=2.03;a*=0.5;}return s;}
float ridge(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){float n=1.0-abs(snoise(p));s+=a*n*n;p*=2.1;a*=0.5;}return s;}
`;

const VERT = /* glsl */ `
uniform float uRot;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
void main(){
  float c=cos(uRot), s=sin(uRot);
  vObj = vec3(c*position.x + s*position.z, position.y, -s*position.x + c*position.z);
  vN = normalize(mat3(modelMatrix)*normal);
  vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w;
}`;

const SURF = /* glsl */ `
uniform int uKind; uniform vec3 uL; uniform float uSeed; uniform float uTime; uniform vec3 uAtm; uniform float uFade;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
${NOISE}
vec3 hex(float r,float g,float b){return vec3(r,g,b)/255.0;}
void main(){
  vec3 p = normalize(vObj);
  vec3 N = normalize(vN); vec3 L = normalize(uL); vec3 V = normalize(cameraPosition - vW);
  float ndl = dot(N,L);
  float day = smoothstep(-0.18, 0.55, ndl);
  vec3 col; float ocean = 0.0; vec3 emit = vec3(0.0);
  if (uKind == 0) {            // AstroRaaga: warm banded giant (Jupiter-like turbulence)
    float w1 = fbm(vec3(p.x*1.6, p.y*7.0, p.z*1.6) + uSeed);
    float w2 = fbm(p*4.2 + vec3(w1*1.7, 0.0, w1));
    float y = p.y + 0.055*w1 + 0.022*w2;
    float band = 0.5 + 0.5*(0.5*sin(y*23.0) + 0.32*sin(y*9.5 + 1.7) + 0.18*sin(y*47.0 + 0.5));
    vec3 rust = hex(112.,44.,20.), saff = hex(214.,96.,40.), amber = hex(238.,160.,78.), cream = hex(248.,228.,196.);
    col = mix(rust, saff, smoothstep(0.05,0.42,band));
    col = mix(col, amber, smoothstep(0.42,0.68,band));
    col = mix(col, cream, smoothstep(0.7,0.95,band));
    col *= 0.9 + 0.16*fbm(vec3(p.x*3.0, p.y*20.0, p.z*3.0) + uSeed*3.0);
    vec3 sp = normalize(vec3(0.62,-0.28,0.73));
    float d = length((p - sp) * vec3(1.0, 1.9, 1.0));
    float storm = smoothstep(0.13, 0.03, d);
    col = mix(col, hex(196.,84.,44.), storm*0.85);
  } else if (uKind == 1) {     // KarmEQ: green living world
    float h = fbm(p*2.2 + uSeed) + 0.25*fbm(p*8.0 + uSeed);
    float land = smoothstep(0.02, 0.08, h);
    vec3 deep = hex(8.,52.,78.), shal = hex(18.,120.,140.);
    vec3 sea = mix(deep, shal, smoothstep(-0.35, 0.05, h));
    vec3 g1 = hex(34.,112.,52.), g2 = hex(96.,150.,70.), earth = hex(120.,52.,34.);
    vec3 ground = mix(g1, g2, smoothstep(0.1,0.45,h));
    ground = mix(ground, earth, smoothstep(0.42,0.62,h)*0.6);
    col = mix(sea, ground, land); ocean = 1.0-land;
    float ice = smoothstep(0.78, 0.92, abs(p.y));
    col = mix(col, vec3(0.93,0.96,0.97), ice);
  } else if (uKind == 2) {     // JyotiQ: violet mind-world with gold light-veins on the night side
    float m = fbm(p*2.4 + uSeed);
    vec3 a = hex(30.,14.,74.), b = hex(110.,56.,214.), c = hex(196.,160.,255.);
    col = mix(a, b, smoothstep(-0.4,0.5,m));
    col = mix(col, c, smoothstep(0.45,0.85, fbm(p*5.0+uSeed))*0.35);
    float r = ridge(p*3.2 + uSeed*1.7);
    float veins = smoothstep(0.7, 0.84, r);
    emit = hex(255.,190.,80.) * veins * (1.0 - day) * 1.15 + hex(255.,200.,120.) * veins * 0.1;
  } else {                     // GrovIT: teal ocean-ice world
    vec3 q = p*1.8 + vec3(fbm(p*2.0+uSeed), fbm(p*2.0+uSeed+3.1), 0.0)*0.8;
    float m = fbm(q);
    vec3 a = hex(6.,82.,112.), b = hex(34.,180.,205.), c = hex(214.,246.,250.);
    col = mix(a, b, smoothstep(-0.4,0.3,m));
    col = mix(col, c, smoothstep(0.25,0.7,m));
    ocean = 1.0 - smoothstep(0.1,0.4,m);
  }
  col *= mix(0.62, 1.0, pow(max(dot(N,V),0.0), 0.45));
  vec3 night = col * 0.03;
  vec3 lit = col * (0.07 + 1.3*max(ndl,0.0)) ;
  vec3 outc = mix(night, lit, day);
  vec3 R = reflect(-L, N);
  outc += ocean * pow(max(dot(R,V),0.0), 38.0) * 0.55 * day;
  float fr = pow(1.0 - max(dot(N,V),0.0), 2.6);
  outc += uAtm * fr * (0.15 + 0.95*smoothstep(-0.3,0.7,ndl));
  outc += emit;
  outc = outc / (1.0 + outc*0.18);
  gl_FragColor = vec4(pow(outc, vec3(0.92)), uFade);
}`;

const CLOUD = /* glsl */ `
uniform vec3 uL; uniform float uSeed; uniform float uAmt; uniform float uFade;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  vec3 q = p*2.6 + vec3(fbm(p*1.5+uSeed), fbm(p*1.5+uSeed+7.0), 0.0)*0.9;
  float c = smoothstep(0.08, 0.55, fbm(q)) * uAmt;
  vec3 N = normalize(vN); float ndl = dot(N, normalize(uL));
  float day = smoothstep(-0.15, 0.5, ndl);
  vec3 col = vec3(1.0) * (0.05 + 1.0*max(ndl,0.0));
  gl_FragColor = vec4(col, c * mix(0.1, 0.92, day) * uFade);
}`;

const ATM_V = /* glsl */ `
varying vec3 vN; varying vec3 vW;
void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`;
const ATM_F = /* glsl */ `
uniform vec3 uAtm; uniform vec3 uL; uniform float uFade; uniform float uPow;
varying vec3 vN; varying vec3 vW;
void main(){
  vec3 V = normalize(cameraPosition - vW); vec3 N = normalize(vN);
  float d = clamp(-dot(N, V) / 0.46, 0.0, 1.0);
  float rim = pow(d, uPow);
  float lit = smoothstep(-0.5, 0.6, dot(N, normalize(uL)));
  gl_FragColor = vec4(uAtm * rim * (0.25 + 1.2*lit), rim * uFade);
}`;

const RING_F = /* glsl */ `
uniform vec3 uL; uniform float uFade; uniform float uIn; uniform float uOut;
varying vec2 vUv; varying vec3 vP;
${NOISE}
void main(){
  float r = length(vP.xy);
  float x = (r - uIn) / (uOut - uIn);
  float bands = 0.6 + 0.25*snoise(vec3(x*70.0, 0.3, 1.7)) + 0.15*snoise(vec3(x*15.0, 2.0, 0.4));
  float a = smoothstep(0.0,0.06,x) * smoothstep(1.0,0.82,x) * bands;
  a *= 0.38 * (1.0 - smoothstep(0.42,0.48,x)*smoothstep(0.56,0.5,x)*0.85);
  vec3 col = mix(vec3(0.98,0.78,0.48), vec3(0.92,0.55,0.25), x);
  gl_FragColor = vec4(col * 1.05, a * uFade);
}`;
const RING_V = /* glsl */ `
varying vec2 vUv; varying vec3 vP;
void main(){ vUv=uv; vP=position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

type Kind = 0 | 1 | 2 | 3;
const ATMS: Record<Kind, THREE.Color> = {
  0: new THREE.Color("#FFB36B"),
  1: new THREE.Color("#7FD8E8"),
  2: new THREE.Color("#B48CFF"),
  3: new THREE.Color("#9BF0FF"),
};

const Planet: React.FC<{
  kind: Kind;
  r: number;
  pos: [number, number, number];
  rot: number;
  seed: number;
  fade?: number;
  clouds?: number;
  scale?: number;
}> = ({ kind, r, pos, rot, seed, fade = 1, clouds = 0, scale = 1 }) => {
  const surf = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: SURF,
        transparent: true,
        uniforms: {
          uKind: { value: kind },
          uL: { value: new THREE.Vector3(...LIGHT) },
          uSeed: { value: seed },
          uTime: { value: 0 },
          uAtm: { value: ATMS[kind] },
          uRot: { value: 0 },
          uFade: { value: 1 },
        },
      }),
    [kind, seed],
  );
  const cloud = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: CLOUD,
        transparent: true,
        depthWrite: false,
        uniforms: { uL: { value: new THREE.Vector3(...LIGHT) }, uSeed: { value: seed + 5 }, uAmt: { value: clouds }, uRot: { value: 0 }, uFade: { value: 1 } },
      }),
    [seed, clouds],
  );
  const atm = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATM_V,
        fragmentShader: ATM_F,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uAtm: { value: ATMS[kind] }, uL: { value: new THREE.Vector3(...LIGHT) }, uFade: { value: 1 }, uPow: { value: 1.7 } },
      }),
    [kind],
  );
  surf.uniforms.uRot.value = rot;
  surf.uniforms.uFade.value = fade;
  cloud.uniforms.uRot.value = rot * 1.35 + 0.4;
  cloud.uniforms.uFade.value = fade;
  atm.uniforms.uFade.value = fade;
  return (
    <group position={pos} scale={Math.max(scale, 0.0001)} visible={scale > 0.001}>
      <mesh material={surf}>
        <sphereGeometry args={[r, 160, 120]} />
      </mesh>
      {clouds > 0 && (
        <mesh material={cloud}>
          <sphereGeometry args={[r * 1.012, 128, 96]} />
        </mesh>
      )}
      <mesh material={atm}>
        <sphereGeometry args={[r * (kind === 0 ? 1.11 : 1.09), 96, 72]} />
      </mesh>
    </group>
  );
};

const Ring: React.FC<{ r: number; fade: number }> = ({ r, fade }) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RING_V,
        fragmentShader: RING_F,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uL: { value: new THREE.Vector3(...LIGHT) }, uFade: { value: 1 }, uIn: { value: r * 1.5 }, uOut: { value: r * 2.1 } },
      }),
    [r],
  );
  mat.uniforms.uFade.value = fade;
  return (
    <mesh material={mat} rotation={[-Math.PI / 2 + 0.2, 0.12, 0]}>
      <ringGeometry args={[r * 1.5, r * 2.1, 256, 4]} />
    </mesh>
  );
};

const STAR_V = /* glsl */ `
attribute float aSize; attribute float aPh; uniform float uT; varying float vA;
void main(){ vA = 0.55 + 0.45*sin(uT*1.3 + aPh); vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = aSize; gl_Position = projectionMatrix*mv; }`;
const STAR_F = /* glsl */ `
uniform float uFade; varying float vA;
void main(){ vec2 d = gl_PointCoord-0.5; float a = smoothstep(0.5,0.0,length(d)); gl_FragColor = vec4(vec3(1.0,0.95,0.88), a*vA*uFade); }`;

const Stars: React.FC<{ t: number; fade: number }> = ({ t, fade }) => {
  const [geo, mat] = useMemo(() => {
    const n = 2200;
    const pos = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = rnd(i * 3 + 1) * 2 - 1;
      const th = rnd(i * 3 + 2) * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const R = 2400;
      pos.set([R * s * Math.cos(th), R * u, R * s * Math.sin(th)], i * 3);
      size[i] = 1.2 + Math.pow(rnd(i * 7 + 5), 6) * 4.5;
      ph[i] = rnd(i * 11 + 3) * 6.28;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPh", new THREE.BufferAttribute(ph, 1));
    const m = new THREE.ShaderMaterial({ vertexShader: STAR_V, fragmentShader: STAR_F, transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uFade: { value: 1 } } });
    return [g, m];
  }, []);
  mat.uniforms.uT.value = t;
  mat.uniforms.uFade.value = fade;
  return <points geometry={geo} material={mat} />;
};

const OrbitLine: React.FC<{ id: MoonId; p: number; t: number }> = ({ id, p, t }) => {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) {
      const tt = 37.5 + ((i / 256) * Math.PI * 2) / MOONS[id].w;
      pts.push(new THREE.Vector3(...moonPos(id, tt)));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: new THREE.Color("#F2C27A"), transparent: true, opacity: 0.0, depthWrite: false });
    return new THREE.Line(g, m);
  }, [id]);
  (line.material as THREE.LineBasicMaterial).opacity = 0.32 * p;
  line.geometry.setDrawRange(0, Math.floor(257 * p));
  void t;
  return <primitive object={line} />;
};

const CamRig: React.FC<{ c: { pos: number[]; look: number[]; fov: number } }> = ({ c }) => {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(c.pos[0], c.pos[1], c.pos[2]);
  cam.fov = c.fov;
  cam.near = 0.05;
  cam.far = 6000;
  cam.lookAt(c.look[0], c.look[1], c.look[2]);
  cam.updateProjectionMatrix();
  return null;
};

/** The 3D cosmos: "open" (AstroRaaga planet appears) or "system" (parent planet + three product moons). */
export const Cosmos: React.FC<{ mode: "open" | "system" }> = ({ mode }) => {
  const t = useWinT();
  const c = mode === "open" ? openCam(t) : systemCam(t);
  const showMoons = mode === "system";
  const orbitP = showMoons ? prog(t, 35.9, 2.0) : 0;
  const moonIn = (k: number) => (showMoons ? prog(t, 36.2 + k * 0.35, 1.1) : 0);
  const motherFade = 1;
  return (
    <ThreeCanvas width={1920} height={1080} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, alpha: false }} camera={{ fov: 34, position: [0, 0, 10] }}>
      <color attach="background" args={["#05040A"]} />
      <CamRig c={c} />
      <Stars t={t} fade={1} />
      <Planet kind={0} r={MOTHER_R} pos={[0, 0, 0]} rot={t * 0.045 + 0.6} seed={2.3} fade={motherFade} />
      <Ring r={MOTHER_R} fade={mode === "open" ? clamp01((t - 6.2) / 2.6) : 1} />
      {showMoons && (
        <>
          {(["jyotiq", "karmeq", "grovit"] as MoonId[]).map((id) => (
            <OrbitLine key={id} id={id} p={orbitP} t={t} />
          ))}
          <Planet kind={2} r={MOONS.jyotiq.r} scale={moonIn(0)} pos={moonPos("jyotiq", t)} rot={t * 0.12} seed={7.1} />
          <Planet kind={1} r={MOONS.karmeq.r} scale={moonIn(1)} pos={moonPos("karmeq", t)} rot={t * 0.09 + 1} seed={3.7} clouds={0.75} />
          <Planet kind={3} r={MOONS.grovit.r} scale={moonIn(2)} pos={moonPos("grovit", t)} rot={t * 0.1 + 2} seed={9.4} clouds={0.5} />
        </>
      )}
    </ThreeCanvas>
  );
};
