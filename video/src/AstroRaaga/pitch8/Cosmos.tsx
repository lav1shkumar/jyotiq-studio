import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Cam, LIGHT, MOON, MoonId, moonOrbitPt, moonPosOpen, MOONS, moonPos, MOTHER_R, nodePos, openCam, openCam7, PlanetId, PLANETS, planetPos, setMoonEpoch, systemCam } from "./cam";
import { clamp01, isV5, prog, rnd } from "./theme";

/** v5: the moons are lit by the AstroRaaga Sun at the centre (slightly toward the camera so they never go fully dark). */
const toSun = (p: [number, number, number], cam?: number[]): [number, number, number] => {
  const n = Math.hypot(p[0], p[1], p[2]) || 1;
  if (!cam) return [-p[0] / n, -p[1] / n + 0.15, -p[2] / n + 0.55];
  // v5.1: half toward the Sun, half toward the camera, so a moon in close-up is never shown dark side on
  const c = [cam[0] - p[0], cam[1] - p[1], cam[2] - p[2]];
  const m = Math.hypot(c[0], c[1], c[2]) || 1;
  return [-p[0] / n + (c[0] / m) * 1.1, -p[1] / n + (c[1] / m) * 1.1 + 0.15, -p[2] / n + (c[2] / m) * 1.1];
};
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
uniform int uKind; uniform vec3 uL; uniform float uSeed; uniform float uTime; uniform vec3 uAtm; uniform float uFade; uniform float uBright;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
${NOISE}
vec3 hex(float r,float g,float b){return vec3(r,g,b)/255.0;}
void main(){
  vec3 p = normalize(vObj);
  vec3 N = normalize(vN); vec3 L = normalize(uL); vec3 V = normalize(cameraPosition - vW);
  float ndl = dot(N,L);
  float day = smoothstep(-0.18, 0.55, ndl);
  vec3 col; float ocean = 0.0; vec3 emit = vec3(0.0);
  if (uKind == 4) {            // v5 AstroRaaga as the Sun: granulation, sunspot-free plasma, limb darkening
    float big = fbm(p*2.6 + uSeed + vec3(0.0, uTime*0.02, 0.0));
    float gran = fbm(p*7.0 + vec3(uTime*0.025, 0.0, uSeed));
    float fil = ridge(p*3.2 + vec3(big*0.6) + uSeed*1.3);
    vec3 deep = hex(196.,58.,8.), mid = hex(246.,128.,22.), hot = hex(255.,198.,84.), white = hex(255.,242.,200.);
    vec3 sc = mix(deep, mid, smoothstep(-0.45, 0.2, big));
    sc = mix(sc, hot, smoothstep(-0.2, 0.6, gran) * 0.4 + 0.25);
    sc = mix(sc, white, smoothstep(0.7, 0.95, fil) * 0.12);
    float mu = max(dot(N, V), 0.0);
    sc *= 0.5 + 0.5 * pow(mu, 0.45);
    sc = mix(sc, white, pow(mu, 3.0) * 0.28);
    gl_FragColor = vec4(min(sc * 1.18, vec3(1.0)), uFade);
    return;
  }
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
    float h = fbm(p*1.8 + uSeed) + 0.06*fbm(p*5.0 + uSeed);
    float land = smoothstep(0.0, 0.12, h);
    vec3 deep = hex(22.,88.,112.), shal = hex(60.,150.,160.);
    vec3 sea = mix(deep, shal, smoothstep(-0.35, 0.05, h));
    vec3 g1 = hex(52.,130.,84.), g2 = hex(110.,168.,104.), earth = hex(150.,110.,76.);
    vec3 ground = mix(g1, g2, smoothstep(0.1,0.45,h));
    ground = mix(ground, earth, smoothstep(0.45,0.7,h)*0.35);
    col = mix(sea, ground, land); ocean = 1.0-land;
    float ice = smoothstep(0.78, 0.92, abs(p.y));
    col = mix(col, vec3(0.93,0.96,0.97), ice);
  } else if (uKind == 2) {     // JyotiQ: violet mind-world with gold light-veins on the night side
    float m = fbm(p*2.4 + uSeed);
    vec3 a = hex(30.,14.,74.), b = hex(110.,56.,214.), c = hex(196.,160.,255.);
    col = mix(a, b, smoothstep(-0.4,0.5,m));
    col = mix(col, c, smoothstep(0.45,0.85, fbm(p*3.0+uSeed))*0.2);
    float r = ridge(p*3.2 + uSeed*1.7);
    float veins = smoothstep(0.76, 0.9, r);
    emit = hex(255.,196.,96.) * veins * (1.0 - day) * 0.45 + hex(255.,200.,120.) * veins * 0.03;
  } else if (uKind == 5) {     // v7 Mercury: light-green money world
    float h = fbm(p*3.0 + uSeed);
    vec3 a = hex(44.,150.,88.), b = hex(112.,214.,150.), c = hex(206.,248.,218.); // v8: a lighter green (Amit sir)
    col = mix(a, b, smoothstep(-0.45, 0.3, h));
    col = mix(col, c, smoothstep(0.3, 0.8, fbm(p*6.5 + uSeed*2.0)) * 0.45);
    emit = hex(120.,240.,160.) * 0.05;
  } else if (uKind == 7) {     // v7 Saturn: deep indigo bands
    float w1 = fbm(vec3(p.x*1.4, p.y*6.0, p.z*1.4) + uSeed);
    float y = p.y + 0.05*w1;
    float band = 0.5 + 0.5*(0.55*sin(y*19.0) + 0.3*sin(y*7.5 + 1.1) + 0.15*sin(y*41.0));
    vec3 a = hex(24.,20.,80.), b = hex(52.,46.,160.), c = hex(104.,108.,214.), d = hex(196.,200.,246.);
    col = mix(a, b, smoothstep(0.05, 0.45, band));
    col = mix(col, c, smoothstep(0.45, 0.72, band));
    col = mix(col, d, smoothstep(0.78, 0.98, band) * 0.6);
  } else if (uKind == 8) {     // v7 Rahu: smoky violet with faint circuit lines (AI)
    float m = fbm(p*2.2 + vec3(uTime*0.03, 0.0, uSeed));
    col = mix(hex(34.,16.,62.), hex(118.,72.,196.), smoothstep(-0.45, 0.5, m));
    col = mix(col, hex(70.,60.,90.), smoothstep(0.2, 0.8, fbm(p*4.0 + uSeed*3.0)) * 0.35);
    vec3 g = p * 7.0;
    float lx = 1.0 - smoothstep(0.0, 0.045, abs(fract(g.y) - 0.5));
    float lz = 1.0 - smoothstep(0.0, 0.045, abs(fract(atan(p.z, p.x) * 3.2) - 0.5));
    float cell = snoise(floor(g) * 1.37 + uSeed);
    float circ = max(lx * step(0.15, cell), lz * step(cell, -0.15)) * smoothstep(-0.2, 0.4, snoise(p*3.0 + uSeed));
    emit = hex(196.,168.,255.) * circ * 0.55;
  } else if (uKind == 9) {     // v7 Ketu: ethereal white-gold
    float m = fbm(p*2.5 + uSeed + vec3(0.0, uTime*0.02, 0.0));
    col = mix(hex(214.,178.,110.), hex(255.,247.,224.), smoothstep(-0.35, 0.55, m));
    emit = hex(255.,232.,180.) * (0.22 + 0.12 * smoothstep(0.2, 0.8, m));
  } else if (uKind == 10) {    // v8 Venus: pale cream-gold veiled world
    float m = fbm(vec3(p.x*1.4, p.y*3.2, p.z*1.4) + uSeed + vec3(uTime*0.01, 0.0, 0.0));
    col = mix(hex(214.,176.,116.), hex(252.,238.,206.), smoothstep(-0.4, 0.5, m));
  } else if (uKind == 11) {    // v8 Earth: blue oceans, green-brown land, white clouds and caps
    float h = fbm(p*1.7 + uSeed) + 0.08*fbm(p*5.5 + uSeed);
    float land = smoothstep(0.02, 0.1, h);
    vec3 sea = mix(hex(18.,58.,128.), hex(40.,110.,190.), smoothstep(-0.4, 0.0, h));
    vec3 ground = mix(hex(60.,128.,62.), hex(150.,128.,80.), smoothstep(0.15, 0.5, h));
    col = mix(sea, ground, land); ocean = 1.0 - land;
    col = mix(col, vec3(0.95), smoothstep(0.8, 0.9, abs(p.y)));
    float cl = smoothstep(0.15, 0.6, fbm(p*3.0 + vec3(uSeed*2.0, uTime*0.02, 0.0)));
    col = mix(col, vec3(0.97), cl * 0.55);
  } else if (uKind == 12) {    // v8 Mars: rust-red dusty world
    float m = fbm(p*2.6 + uSeed);
    col = mix(hex(120.,40.,20.), hex(214.,98.,52.), smoothstep(-0.45, 0.4, m));
    col = mix(col, hex(238.,170.,120.), smoothstep(0.4, 0.8, fbm(p*6.0 + uSeed)) * 0.3);
    col = mix(col, vec3(0.95), smoothstep(0.88, 0.95, abs(p.y)));
  } else if (uKind == 13) {    // v8 Moon: soft grey with maria
    float m = fbm(p*3.2 + uSeed);
    col = mix(hex(120.,118.,116.), hex(226.,222.,214.), smoothstep(-0.4, 0.4, m));
  } else if (uKind == 14) {    // v8 Rahu / Ketu: shadow points, dark smoke with a faint ember rim
    float m = fbm(p*2.0 + uSeed + vec3(0.0, uTime*0.05, 0.0));
    col = mix(hex(16.,12.,24.), hex(58.,46.,70.), smoothstep(-0.4, 0.6, m));
    emit = hex(200.,120.,60.) * pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.6;
  } else {                     // GrovIT: teal ocean-ice world
    vec3 q = p*1.8 + vec3(fbm(p*2.0+uSeed), fbm(p*2.0+uSeed+3.1), 0.0)*0.8;
    float m = fbm(q);
    vec3 a = hex(6.,82.,112.), b = hex(34.,180.,205.), c = hex(214.,246.,250.);
    col = mix(a, b, smoothstep(-0.4,0.3,m));
    col = mix(col, c, smoothstep(0.25,0.7,m));
    ocean = 1.0 - smoothstep(0.1,0.4,m);
  }
  col *= mix(0.62, 1.0, pow(max(dot(N,V),0.0), 0.45));
  // uBright: 0 = dark space (opening), 1 = light theme (planets on the cream map)
  vec3 night = col * mix(0.03, 0.40, uBright);
  vec3 lit = col * (mix(0.07, 0.48, uBright) + mix(1.3, 0.85, uBright)*max(ndl,0.0));
  vec3 outc = mix(night, lit, day);
  vec3 R = reflect(-L, N);
  outc += ocean * pow(max(dot(R,V),0.0), 24.0) * 0.18 * day;
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
uniform vec3 uAtm; uniform vec3 uL; uniform float uFade; uniform float uPow; uniform float uBright;
varying vec3 vN; varying vec3 vW;
void main(){
  vec3 V = normalize(cameraPosition - vW); vec3 N = normalize(vN);
  float d = clamp(-dot(N, V) / 0.46, 0.0, 1.0);
  float rim = pow(d, uPow);
  float lit = smoothstep(-0.5, 0.6, dot(N, normalize(uL)));
  vec3 c = uAtm * rim * (0.25 + 1.2*lit);
  gl_FragColor = uBright > 0.5 ? vec4(uAtm, rim * uFade * 0.55) : vec4(c, rim * uFade);
}`;

const RING_F = /* glsl */ `
uniform vec3 uL; uniform float uFade; uniform float uIn; uniform float uOut; uniform float uDeep; uniform vec3 uC1; uniform vec3 uC2;
varying vec2 vUv; varying vec3 vP;
${NOISE}
void main(){
  float r = length(vP.xy);
  float x = (r - uIn) / (uOut - uIn);
  float bands = 0.6 + 0.25*snoise(vec3(x*70.0, 0.3, 1.7)) + 0.15*snoise(vec3(x*15.0, 2.0, 0.4));
  float a = smoothstep(0.0,0.06,x) * smoothstep(1.0,0.82,x) * bands;
  a *= 0.38 * (1.0 - smoothstep(0.42,0.48,x)*smoothstep(0.56,0.5,x)*0.85);
  vec3 col = mix(uC1, uC2, x);
  gl_FragColor = vec4(col * mix(1.05, 0.82, uDeep), a * uFade * mix(1.0, 1.35, uDeep));
}`;
const RING_V = /* glsl */ `
varying vec2 vUv; varying vec3 vP;
void main(){ vUv=uv; vP=position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

type Kind = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
const ATMS: Record<Kind, THREE.Color> = {
  0: new THREE.Color("#FFB36B"),
  1: new THREE.Color("#7FD8E8"),
  2: new THREE.Color("#B48CFF"),
  3: new THREE.Color("#9BF0FF"),
  4: new THREE.Color("#FFB347"),
  5: new THREE.Color("#9BF5B8"),
  6: new THREE.Color("#FFD27A"),
  7: new THREE.Color("#9AA4FF"),
  8: new THREE.Color("#C9A8FF"),
  9: new THREE.Color("#FFF0C8"),
  10: new THREE.Color("#FFE6B0"),
  11: new THREE.Color("#8CC8FF"),
  12: new THREE.Color("#FFAA80"),
  13: new THREE.Color("#E8E4DC"),
  14: new THREE.Color("#B08060"),
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
  bright?: number;
  light?: [number, number, number];
  time?: number;
}> = ({ kind, r, pos, rot, seed, fade = 1, clouds = 0, scale = 1, bright = 0, light, time = 0 }) => {
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
          uBright: { value: 0 },
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
        blending: bright > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending,
        uniforms: { uAtm: { value: ATMS[kind] }, uL: { value: new THREE.Vector3(...LIGHT) }, uFade: { value: 1 }, uPow: { value: bright > 0.5 ? 2.4 : 1.7 }, uBright: { value: bright } },
      }),
    [kind, bright],
  );
  surf.uniforms.uBright.value = bright;
  surf.uniforms.uTime.value = time;
  if (light) {
    surf.uniforms.uL.value.set(...light);
    cloud.uniforms.uL.value.set(...light);
    atm.uniforms.uL.value.set(...light);
  }
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
      <mesh material={atm} visible={kind !== 4}>
        <sphereGeometry args={[r * (kind === 0 ? 1.11 : kind === 4 ? 1.16 : 1.09), 96, 72]} />
      </mesh>
    </group>
  );
};

const Ring: React.FC<{ r: number; fade: number; deep?: number; c1?: string; c2?: string; tilt?: number }> = ({ r, fade, deep = 0, c1 = "#FAC77A", c2 = "#EB8C40", tilt = 0.2 }) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RING_V,
        fragmentShader: RING_F,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uL: { value: new THREE.Vector3(...LIGHT) }, uFade: { value: 1 }, uIn: { value: r * 1.5 }, uOut: { value: r * 2.1 }, uDeep: { value: 0 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) } },
      }),
    [r, c1, c2],
  );
  mat.uniforms.uFade.value = fade;
  mat.uniforms.uDeep.value = deep;
  return (
    <mesh material={mat} rotation={[-Math.PI / 2 + tilt, 0.12, 0]}>
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

const OrbitLine: React.FC<{ id: MoonId; p: number; t: number; epoch: number }> = ({ id, p, t, epoch }) => {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) {
      const tt = epoch + ((i / 256) * Math.PI * 2) / MOONS[id].w;
      pts.push(new THREE.Vector3(...moonPos(id, tt)));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: new THREE.Color("#B8862B"), transparent: true, opacity: 0.0, depthWrite: false });
    return new THREE.Line(g, m);
  }, [id, epoch]);
  (line.material as THREE.LineBasicMaterial).opacity = 0.55 * p;
  line.geometry.setDrawRange(0, Math.floor(257 * p));
  void t;
  return <primitive object={line} />;
};

/** v7: a planet's orbit, drawn on as it arrives. */
const PlanetOrbit: React.FC<{ id: PlanetId; p: number }> = ({ id, p }) => {
  const line = useMemo(() => {
    const m = PLANETS[id];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) {
      // start the line at the planet's arrival point so it draws on from the planet
      const th = m.th0 + m.w * m.tIn + (i / 256) * Math.PI * 2;
      const z = m.orbit * Math.sin(th);
      pts.push(new THREE.Vector3(m.orbit * Math.cos(th), z * Math.sin(m.incl), z));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color("#E9B65C"), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    return new THREE.Line(g, mat);
  }, [id]);
  (line.material as THREE.LineBasicMaterial).opacity = 0.32 * p;
  line.geometry.setDrawRange(0, Math.floor(257 * p));
  return <primitive object={line} />;
};

/** v8: the Moon's orbit round the Earth (a small tilted ring that travels with the Earth). */
const MoonOrbit: React.FC<{ t: number; p: number }> = ({ t, p }) => {
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, () => new THREE.Vector3()));
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color("#CFC8BA"), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    return new THREE.Line(g, mat);
  }, []);
  const a = line.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i <= 128; i++) a.setXYZ(i, ...moonOrbitPt(t, (i / 128) * Math.PI * 2));
  a.needsUpdate = true;
  (line.material as THREE.LineBasicMaterial).opacity = 0.35 * p;
  return <primitive object={line} />;
};

/** v8 (Amit sir): the opening solar system: Sun at the centre, six orbits, the Moon with Rahu and Ketu. No names. */
const SolarSystem: React.FC<{ t: number }> = ({ t }) => {
  const sunLight = (pos: number[]): [number, number, number] => {
    const n = Math.hypot(pos[0], pos[1], pos[2]) || 1;
    return [-pos[0] / n, -pos[1] / n + 0.1, -pos[2] / n];
  };
  const eIn = prog(t, PLANETS.earth.tIn + 0.6, 1.4);
  const mp = moonPosOpen(t);
  return (
    <>
      {(Object.keys(PLANETS) as PlanetId[]).map((id, i) => {
        const m = PLANETS[id];
        const pin = prog(t, m.tIn, 1.4);
        const pos = planetPos(id, t);
        return (
          <React.Fragment key={id}>
            <PlanetOrbit id={id} p={prog(t, m.tIn - 0.4, 2.0)} />
            <Planet kind={m.kind as Kind} r={m.r} scale={pin} pos={pos} rot={t * 0.12 + i} seed={1.3 + i * 2.1} light={sunLight(pos)} time={t} />
            {id === "saturn" && (
              <group position={pos} scale={Math.max(pin, 0.0001)}>
                <Ring r={m.r} fade={pin} c1="#B9BEF5" c2="#5B55C9" tilt={0.35} />
              </group>
            )}
          </React.Fragment>
        );
      })}
      <MoonOrbit t={t} p={eIn} />
      <Planet kind={13} r={MOON.r} scale={eIn} pos={mp} rot={t * 0.1} seed={5.5} light={sunLight(mp)} time={t} />
      {(["rahu", "ketu"] as const).map((w, i) => {
        const np = nodePos(t, w);
        return <Planet key={w} kind={14} r={MOON.r * 0.85} scale={prog(t, PLANETS.earth.tIn + 1.0 + 0.3 * i, 1.2)} pos={np} rot={t * 0.2} seed={8.1 + i} light={sunLight(np)} time={t} />;
      })}
    </>
  );
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

/** A soft sun glow (sprite) that sits behind the planet and grows. */
const Sun: React.FC<{ c: Cam; t: number }> = ({ c, t }) => {
  const mat = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const g = cv.getContext("2d")!;
    const gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
    gr.addColorStop(0, "rgba(255,252,240,1)");
    gr.addColorStop(0.06, "rgba(255,240,200,1)");
    gr.addColorStop(0.14, "rgba(255,200,120,0.85)");
    gr.addColorStop(0.32, "rgba(245,150,60,0.32)");
    gr.addColorStop(0.6, "rgba(234,88,12,0.08)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 512);
    return new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  }, []);
  // behind the planet, just above-left of its limb as seen from the camera
  const cp = new THREE.Vector3(...c.pos);
  const away = new THREE.Vector3(0, 0, 0).sub(cp).normalize();
  const camRight = new THREE.Vector3().crossVectors(away, new THREE.Vector3(0, 1, 0)).normalize();
  const pos = away.clone().multiplyScalar(60).add(camRight.multiplyScalar(-14)).add(new THREE.Vector3(0, 9, 0));
  const grow = Math.min(1, t / 14);
  const size = 30 + 70 * grow * grow + 140 * Math.max(0, t - 13.6) ** 2;
  mat.opacity = Math.min(1, t / 1.5);
  return <sprite material={mat} position={[pos.x, pos.y, pos.z]} scale={[size, size, 1]} />;
};

/** v5: the corona round the AstroRaaga Sun (a soft additive / normal sprite centred on it). */
const Corona: React.FC<{ t: number; light: boolean; grow: number }> = ({ t, light, grow }) => {
  const mat = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const g = cv.getContext("2d")!;
    const gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
    // the Sun's limb sits at ~0.5 of the sprite radius: the glow starts there and falls off outward
    gr.addColorStop(0, "rgba(255,236,190,1)");
    gr.addColorStop(0.48, "rgba(255,214,130,1)");
    gr.addColorStop(0.53, "rgba(255,176,70,0.8)");
    gr.addColorStop(0.62, "rgba(250,130,30,0.38)");
    gr.addColorStop(0.76, "rgba(240,100,15,0.12)");
    gr.addColorStop(0.9, "rgba(230,80,10,0.03)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 512);
    return new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), blending: light ? THREE.NormalBlending : THREE.AdditiveBlending, depthWrite: false, transparent: true });
  }, [light]);
  const breathe = 1 + 0.035 * Math.sin(t * 1.7) + 0.02 * Math.sin(t * 3.3 + 1);
  const size = MOTHER_R * (light ? 4.4 : 3.9) * breathe * grow;
  mat.opacity = light ? 0.75 : 0.95;
  return <sprite material={mat} position={[0, 0, -0.01]} scale={[size, size, 1]} renderOrder={-1} />;
};

/** The 3D cosmos: "open" (dark space, sun behind the AstroRaaga planet) or "system" (light theme: the parent planet
 *  with the JyotiQ and KarmEQ moons). For "system", `k` gives the focus times and `epoch` the moons' start. */
export const Cosmos: React.FC<{ mode: "open" | "system"; k?: { a: number; jy: number; km: number; back: number; eng?: number }; epoch?: number }> = ({ mode, k, epoch = 100 }) => {
  const t = useWinT();
  const v5 = isV5();
  setMoonEpoch(epoch);
  const light = mode === "system";
  const c = light && k ? systemCam(t, k) : v5 ? openCam7(t) : openCam(t);
  const orbitP = light && k ? prog(t, k.a + 0.2, 2.0) : 0;
  const moonIn = (n: number) => (light && k ? prog(t, k.a + 0.5 + n * 0.4, 1.1) : 0);
  return (
    <ThreeCanvas
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: light, premultipliedAlpha: true }}
      camera={{ fov: 34, position: [0, 0, 10] }}
    >
      {!light && <color attach="background" args={["#05040A"]} />}
      <CamRig c={c} />
      {!light && <Stars t={t} fade={1} />}
      {!light && !v5 && <Sun c={c} t={t} />}
      {v5 && <Corona t={t} light={light} grow={light ? 0.78 : 0.8 * (1 + 0.45 * clamp01((t - 2) / 8))} />}
      {!light && v5 && <SolarSystem t={t} />}
      <Planet kind={v5 ? 4 : 0} r={MOTHER_R} scale={light ? 0.78 : 0.8} pos={[0, 0, 0]} rot={t * (v5 ? 0.03 : 0.045) + 0.6} seed={2.3} bright={light ? 1 : 0} time={t} />
      {!v5 && <Ring r={MOTHER_R} fade={light ? 1 : clamp01((t - 5.6) / 2.6)} deep={light ? 1 : 0} />}
      {light && (
        <>
          {(["jyotiq", "karmeq"] as MoonId[]).map((id) => (
            <OrbitLine key={id} id={id} p={orbitP} t={t} epoch={epoch} />
          ))}
          <Planet kind={5} r={MOONS.jyotiq.r} scale={moonIn(0)} pos={moonPos("jyotiq", t)} rot={t * 0.12} seed={7.1} bright={1} light={v5 ? toSun(moonPos("jyotiq", t), c.pos) : undefined} />
          {k?.eng !== undefined && (
            <>
              <OrbitLine id="engine" p={prog(t, k.eng - 0.3, 1.6)} t={t} epoch={epoch} />
              <Planet kind={11} r={MOONS.engine.r} scale={prog(t, k.eng, 1.2)} pos={moonPos("engine", t)} rot={t * 0.1 + 2} seed={4.4} bright={1} light={toSun(moonPos("engine", t), c.pos)} time={t} />
            </>
          )}
          <Planet kind={0} r={MOONS.karmeq.r} scale={moonIn(1)} pos={moonPos("karmeq", t)} rot={t * 0.09 + 1} seed={3.7} bright={1} light={v5 ? toSun(moonPos("karmeq", t), c.pos) : undefined} />
        </>
      )}
    </ThreeCanvas>
  );
};
