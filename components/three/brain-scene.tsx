"use client";

/**
 * SYNAPSE — Beynin icine yolculuk.
 * Nokta-bulutu beyin modeli (8.000 nokta) tam sayfa bir sahneye donusur:
 *
 *  p=0.00  parcaciklar toplanir, beyin disaridan gorunur (hero)
 *  p~0.25  kamera beynin ICINE dalar
 *  p~0.40  "kaygi dongusu": kapali, pembe bir yol tekrar tekrar ateslenir
 *  p~0.60  "yeni yol": mor bir baglanti acilir, her darbeyle guclenir,
 *          eski dongu yavasca soner (noroplastisite)
 *  p~0.90  kamera geri cekilir — beyin butun halinde, artik daha parlak
 */

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type ProgressRef = RefObject<number>;

const POINTS_URL = "/models/brain-points.json";
const PINK = new THREE.Color("#ee7ab5");
const VIOLET = new THREE.Color("#7b6cf0");
const CYAN = new THREE.Color("#57b9e9");
const OLD = new THREE.Color("#e0568f");

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* Yumusak yuvarlak nokta dokusu */
function useDotTexture() {
  return useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* Hedef noktalardan iki anlamli yol sec */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildStoryPaths(_targets: Float32Array) {
  const anchor = new THREE.Vector3(0.35, 0.1, 0.15);
  const loopPts: THREE.Vector3[] = [];
  let seed = 21;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = 0.26 + rand() * 0.05;
    loopPts.push(
      new THREE.Vector3(
        anchor.x + Math.cos(a) * r,
        anchor.y + Math.sin(a) * r * 0.75 + (rand() - 0.5) * 0.05,
        anchor.z + Math.sin(a * 2) * 0.08 + (rand() - 0.5) * 0.04,
      ),
    );
  }

  const from = new THREE.Vector3(0.05, 0.0, 0.1);
  const to = new THREE.Vector3(-0.72, 0.5, 0.32);
  const bend = new THREE.Vector3(-0.25, 0.05, 0.45);
  const pathPts: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const p = new THREE.Vector3()
      .copy(from)
      .multiplyScalar((1 - t) * (1 - t))
      .addScaledVector(bend, 2 * (1 - t) * t)
      .addScaledVector(to, t * t);
    p.x += (rand() - 0.5) * 0.04;
    p.y += (rand() - 0.5) * 0.04;
    pathPts.push(p);
  }

  return {
    loop: new THREE.CatmullRomCurve3(loopPts, true),
    path: new THREE.CatmullRomCurve3(pathPts, false),
  };
}

/* Egriden tup geometrisi + uzerinde akan darbeler */
function StoryPath({
  curve,
  color,
  progressRef,
  kind,
}: {
  curve: THREE.CatmullRomCurve3;
  color: THREE.Color;
  progressRef: ProgressRef;
  kind: "loop" | "new";
}) {
  const dotTex = useDotTexture();
  const tubeRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const pulsesRef = useRef<THREE.Group>(null);

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.016, 6, kind === "loop"), [curve, kind]);
  const PULSES = kind === "loop" ? 3 : 4;

  useFrame((state) => {
    const p = clamp01(progressRef.current ?? 0);
    const t = state.clock.elapsedTime;
    const vis =
      kind === "loop"
        ? seg(p, 0.3, 0.42) * (1 - 0.9 * seg(p, 0.62, 0.82))
        : seg(p, 0.5, 0.62) * (1 - seg(p, 0.88, 0.98));
    if (matRef.current) matRef.current.opacity = vis * (kind === "new" ? 0.9 : 0.65);
    if (tubeRef.current) {
      tubeRef.current.visible = vis > 0.01;
      tubeRef.current.scale.setScalar(1);
    }
    const g = pulsesRef.current;
    if (g) {
      g.visible = vis > 0.05;
      g.children.forEach((child, i) => {
        const speed = kind === "loop" ? 0.14 : 0.2 + seg(p, 0.55, 0.85) * 0.15;
        const tt = (t * speed + i / PULSES) % 1;
        const pos = curve.getPointAt(tt);
        child.position.copy(pos);
        const s = (kind === "new" ? 0.045 : 0.035) * (0.8 + Math.sin(t * 6 + i) * 0.2);
        child.scale.setScalar(s);
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = vis;
      });
    }
  });

  return (
    <>
      <mesh ref={tubeRef} geometry={geo}>
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={pulsesRef}>
        {Array.from({ length: PULSES }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} map={dotTex} />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* Beyin nokta bulutu */
function BrainPoints({
  targets,
  progressRef,
}: {
  targets: Float32Array;
  progressRef: ProgressRef;
}) {
  const dotTex = useDotTexture();
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const startTime = useRef<number | null>(null);

  const count = targets.length / 3;

  const { starts, delays, colors, seeds } = useMemo(() => {
    let seed = 9;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const starts = new Float32Array(count * 3);
    const delays = new Float32Array(count);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      const r = 5 + rand() * 5;
      starts[i * 3] = Math.sin(ph) * Math.cos(a) * r;
      starts[i * 3 + 1] = Math.cos(ph) * r * 0.8;
      starts[i * 3 + 2] = Math.sin(ph) * Math.sin(a) * r;
      delays[i] = rand() * 1.4;
      seeds[i] = rand() * Math.PI * 2;
      const t = (targets[i * 3] + 2) / 4;
      if (t < 0.5) c.lerpColors(PINK, VIOLET, t * 2);
      else c.lerpColors(VIOLET, CYAN, (t - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { starts, delays, colors, seeds };
  }, [targets, count]);

  const positions = useMemo(() => starts.slice(), [starts]);

  useFrame((state) => {
    const geo = geoRef.current;
    const g = groupRef.current;
    if (!geo || !g) return;
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startTime.current;
    const p = clamp01(progressRef.current ?? 0);

    const pos = geo.attributes.position.array as Float32Array;
    const DUR = 2.2;
    for (let i = 0; i < count; i++) {
      const cp = Math.min(1, Math.max(0, (t - delays[i]) / DUR));
      const e = 1 - Math.pow(1 - cp, 3);
      const wob = cp >= 1 ? Math.sin(t * 1.1 + seeds[i]) * 0.012 : 0;
      pos[i * 3] = starts[i * 3] + (targets[i * 3] - starts[i * 3]) * e + wob;
      pos[i * 3 + 1] =
        starts[i * 3 + 1] + (targets[i * 3 + 1] - starts[i * 3 + 1]) * e + wob * 0.7;
      pos[i * 3 + 2] = starts[i * 3 + 2] + (targets[i * 3 + 2] - starts[i * 3 + 2]) * e;
    }
    geo.attributes.position.needsUpdate = true;

    const outside = 1 - seg(p, 0.12, 0.3) + seg(p, 0.86, 1);
    g.rotation.y = t * 0.1 * Math.min(1, outside) + pointer.x * 0.25 * outside;
    g.rotation.x = -0.1 - pointer.y * 0.15 * outside + Math.sin(t * 0.3) * 0.01;

    if (matRef.current) {
      const inside = seg(p, 0.2, 0.35) * (1 - seg(p, 0.85, 0.97));
      const finale = seg(p, 0.9, 1);
      matRef.current.opacity = 0.85 - inside * 0.35 + finale * 0.1;
      matRef.current.size = 0.05 + finale * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.05}
          map={dotTex}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* Kamera: beynin icine dalis ve geri cekilis */
const CAM_KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [0, 0.2, 5.6], look: [0, 0, 0] },
  { p: 0.22, pos: [0, 0.15, 2.6], look: [0, 0, 0] },
  { p: 0.38, pos: [0.9, 0.2, 1.1], look: [0.35, 0.1, 0.15] },
  { p: 0.58, pos: [0.2, 0.25, 1.0], look: [-0.5, 0.35, 0.15] },
  { p: 0.8, pos: [-0.4, 0.3, 1.4], look: [-0.55, 0.4, 0.2] },
  { p: 1.0, pos: [0, 0.35, 6.2], look: [0, 0, 0] },
];

function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const { camera } = useThree();
  const smooth = useRef(0);
  const vPos = useMemo(() => new THREE.Vector3(), []);
  const vLook = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    smooth.current = THREE.MathUtils.lerp(
      smooth.current,
      clamp01(progressRef.current ?? 0),
      0.07,
    );
    const p = smooth.current;
    let i = 0;
    while (i < CAM_KEYS.length - 2 && p > CAM_KEYS[i + 1].p) i++;
    const k0 = CAM_KEYS[i];
    const k1 = CAM_KEYS[i + 1];
    const t = clamp01((p - k0.p) / (k1.p - k0.p));
    const e = t * t * (3 - 2 * t);
    a.set(...k0.pos);
    b.set(...k1.pos);
    vPos.lerpVectors(a, b, e);
    a.set(...k0.look);
    b.set(...k1.look);
    vLook.lerpVectors(a, b, e);
    camera.position.copy(vPos);
    camera.lookAt(vLook);
  });

  return null;
}

/* Ana sahne */
interface BrainSceneProps {
  progressRef?: ProgressRef;
}

export function BrainScene({ progressRef }: BrainSceneProps) {
  const fallbackRef = useRef(0);
  const pRef = progressRef ?? fallbackRef;
  const [targets, setTargets] = useState<Float32Array | null>(null);

  const paths = useMemo(
    () => (targets ? buildStoryPaths(targets) : null),
    [targets],
  );

  useEffect(() => {
    let alive = true;
    fetch(POINTS_URL)
      .then((r) => r.json())
      .then((arr: number[]) => {
        if (alive) setTargets(new Float32Array(arr));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 5.6], fov: 46 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {targets && paths && (
        <>
          <BrainPoints targets={targets} progressRef={pRef} />
          <StoryPath curve={paths.loop} color={OLD} progressRef={pRef} kind="loop" />
          <StoryPath curve={paths.path} color={VIOLET} progressRef={pRef} kind="new" />
          <CameraRig progressRef={pRef} />
        </>
      )}
    </Canvas>
  );
}
