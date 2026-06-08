/**
 * ParticleField — Three.js tabanlı interaktif parçacık sahası
 * OLD IRON tema renkleri: koyu zemin + turuncu aksan
 * Mouse hareketi parçacıkları iter, yavaşça spiral döner
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const getParticleCount = () => {
  if (typeof window === "undefined") return 900;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return window.innerWidth < 768 ? 420 : 1100;
};
const SPREAD          = 18;
const BASE_COLOR      = new THREE.Color(0x3a2010); // koyu kahve
const ACCENT_COLOR    = new THREE.Color(0xe8843a); // turuncu aksan
const MOUSE_REPEL_R   = 2.5;
const MOUSE_REPEL_STR = 0.06;

export function ParticleField({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const particleCount = getParticleCount();
    if (particleCount === 0) return;

    // ── Renderer ────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 12;

    // ── Particles ───────────────────────────────────────────
    const positions = new Float32Array(particleCount * 3);
    const colors    = new Float32Array(particleCount * 3);
    const sizes     = new Float32Array(particleCount);
    const origPos   = new Float32Array(particleCount * 3);
    const velocity  = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // sphere distribution
      const r     = Math.cbrt(Math.random()) * SPREAD;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i3]     = origPos[i3]     = x;
      positions[i3 + 1] = origPos[i3 + 1] = y;
      positions[i3 + 2] = origPos[i3 + 2] = z;

      velocity[i3] = velocity[i3 + 1] = velocity[i3 + 2] = 0;

      // blend between base and accent based on distance from center
      const t = Math.random();
      const c = BASE_COLOR.clone().lerp(ACCENT_COLOR, t * t * 0.7);
      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes,     1));

    // custom shader material for crisp round particles
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (280.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = dot(uv, uv);
          if (d > 0.25) discard;
          float alpha = 1.0 - smoothstep(0.15, 0.25, d);
          gl_FragColor = vec4(vColor, alpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Mouse tracking ───────────────────────────────────────
    const mouse3D = new THREE.Vector3(9999, 9999, 0);
    const raycaster = new THREE.Raycaster();
    const mouseNDC  = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseNDC.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      // intersect z=0 plane
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.ray.intersectPlane(plane, mouse3D);
    };
    mount.addEventListener("mousemove", onMouseMove);

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ───────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const tmpVec = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      // slow spiral rotation
      points.rotation.y = t * 0.04;
      points.rotation.x = Math.sin(t * 0.02) * 0.08;

      // particle physics
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const px = pos.getX(i);
        const py = pos.getY(i);
        const pz = pos.getZ(i);

        // mouse repulsion
        tmpVec.set(px - mouse3D.x, py - mouse3D.y, pz - mouse3D.z);
        const dist = tmpVec.length();
        if (dist < MOUSE_REPEL_R && dist > 0.01) {
          const force = (MOUSE_REPEL_R - dist) / MOUSE_REPEL_R;
          velocity[i3]     += tmpVec.x / dist * force * MOUSE_REPEL_STR;
          velocity[i3 + 1] += tmpVec.y / dist * force * MOUSE_REPEL_STR;
          velocity[i3 + 2] += tmpVec.z / dist * force * MOUSE_REPEL_STR;
        }

        // spring back to origin
        const ox = origPos[i3]; const oy = origPos[i3 + 1]; const oz = origPos[i3 + 2];
        velocity[i3]     += (ox - px) * 0.012;
        velocity[i3 + 1] += (oy - py) * 0.012;
        velocity[i3 + 2] += (oz - pz) * 0.012;

        // damping
        velocity[i3]     *= 0.88;
        velocity[i3 + 1] *= 0.88;
        velocity[i3 + 2] *= 0.88;

        pos.setXYZ(i, px + velocity[i3], py + velocity[i3 + 1], pz + velocity[i3 + 2]);
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onVisibilityChange = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else animate();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
