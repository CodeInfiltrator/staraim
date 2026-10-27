"use client";

import * as THREE from "three";
import { bvToRgb } from "@/lib/astro/color";
import { angularSeparation } from "@/lib/astro/coords";
import { SkyIndex, type CatalogueEntry } from "@/lib/astro/sky";
import { CONSTELLATIONS } from "@/lib/astro/data/constellations";
import { STAR_BV, STAR_DEC, STAR_MAG, STAR_RA } from "@/lib/astro/data/stars";
import {
  DOME_FRAG,
  DOME_VERT,
  LINE_FRAG,
  LINE_VERT,
  MARKER_FRAG,
  MARKER_VERT,
  RING_FRAG,
  RING_VERT,
  STAR_FRAG,
  STAR_VERT,
} from "./shaders";

const R = 1000; // radius of the celestial sphere
const FOV = 62;

export interface SkyLabel {
  id: string;
  text: string;
  sub?: string;
  x: number;
  y: number;
  visible: boolean;
  kind: CatalogueEntry["kind"];
  tone: "body" | "star" | "dso" | "satellite";
}

export interface SkySceneOptions {
  canvas: HTMLCanvasElement;
  labelLayer: HTMLElement;
  onPick: (entry: CatalogueEntry | null) => void;
  onFrame: (info: { heading: number; pitch: number }) => void;
}

export interface SkyState {
  date: Date;
  lat: number;
  lon: number;
}

/** sRGB hex to a linear-space THREE.Color. */
function linearColor(hex: number): THREE.Color {
  const c = new THREE.Color(hex);
  c.convertSRGBToLinear();
  return c;
}

export class SkyScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private skyGroup = new THREE.Group();
  private labelLayer: HTMLElement;

  private dome: THREE.Mesh;
  private domeMat: THREE.ShaderMaterial;
  private starPoints: THREE.Points;
  private starMat: THREE.ShaderMaterial;
  private lineSegments: THREE.LineSegments;
  private lineMat: THREE.ShaderMaterial;
  private markers: THREE.Points;
  private markerMat: THREE.ShaderMaterial;
  private ring: THREE.LineLoop;
  private ringMat: THREE.ShaderMaterial;

  private index: SkyIndex;
  private state: SkyState;
  private time = 0;
  private lastEphemeris = 0;
  /** Wall clock the anchor date was set at, so the scene can run forward. */
  private anchor = 0;

  private yaw = 0;
  private pitch = 0.28;
  private targetYaw = 0;
  private targetPitch = 0.28;
  private autoDrift = true;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private zoom = 1;
  private disposed = false;

  /** Live objects, keyed by id, with their 3D position. */
  private bodies = new Map<string, CatalogueEntry>();
  private labelNodes = new Map<string, HTMLElement>();
  private observer: CatalogueEntry | null = null;

  private onPick: (entry: CatalogueEntry | null) => void;
  private onFrame: (info: { heading: number; pitch: number }) => void;

  constructor(options: SkySceneOptions, state: SkyState) {
    this.labelLayer = options.labelLayer;
    this.onPick = options.onPick;
    this.onFrame = options.onFrame;
    this.state = state;

    this.renderer = new THREE.WebGLRenderer({
      canvas: options.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 1);

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 4000);
    this.scene.add(this.skyGroup);

    this.index = new SkyIndex(state.date, { lat: state.lat, lon: state.lon });
    this.anchor = performance.now();
    this.brightStars = this.index.namedStars.filter((s) => (s.mag ?? 99) <= 2.3);

    /* ------------------------------------------------------------ dome */
    this.domeMat = new THREE.ShaderMaterial({
      vertexShader: DOME_VERT,
      fragmentShader: DOME_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uZenith: { value: linearColor(0x05070f) },
        uHorizon: { value: linearColor(0x0d1220) },
        uGround: { value: linearColor(0x05060a) },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uSunColor: { value: linearColor(0xffd9a8) },
        uSunUp: { value: 0 },
        uTime: { value: 0 },
        uExposure: { value: 1 },
      },
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(R * 1.4, 48, 32), this.domeMat);
    this.dome.renderOrder = -10;
    this.scene.add(this.dome);

    /* ---------------------------------------------------------- stars */
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uBoost: { value: 1.55 },
      },
    });
    this.starPoints = new THREE.Points(this.buildStarGeometry(), this.starMat);
    this.starPoints.renderOrder = 1;
    this.skyGroup.add(this.starPoints);

    /* ------------------------------------------------- constellation lines */
    this.lineMat = new THREE.ShaderMaterial({
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: linearColor(0x6f7ea8) },
        uOpacity: { value: 0.55 },
      },
    });
    this.lineSegments = new THREE.LineSegments(this.buildLineGeometry(), this.lineMat);
    this.lineSegments.renderOrder = 0;
    this.skyGroup.add(this.lineSegments);

    /* --------------------------------------------------------- markers */
    this.markerMat = new THREE.ShaderMaterial({
      vertexShader: MARKER_VERT,
      fragmentShader: MARKER_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uScale: { value: 1 } },
    });
    this.markers = new THREE.Points(new THREE.BufferGeometry(), this.markerMat);
    this.markers.renderOrder = 3;
    this.skyGroup.add(this.markers);

    /* ----------------------------------------------------- horizon ring */
    this.ringMat = new THREE.ShaderMaterial({
      vertexShader: RING_VERT,
      fragmentShader: RING_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: linearColor(0x7c8aa8) },
        uOpacity: { value: 0.4 },
      },
    });
    this.ring = new THREE.LineLoop(this.buildRingGeometry(), this.ringMat);
    this.ring.renderOrder = 2;
    this.scene.add(this.ring);

    this.applySkyTransform();
    this.refreshBodies(true);

    this.bindEvents(options.canvas);
    this.resize();
  }

  /* ------------------------------------------------------------- geometry */

  private buildStarGeometry(): THREE.BufferGeometry {
    const n = STAR_RA.length;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const ra = (STAR_RA[i] * Math.PI) / 180;
      const dec = (STAR_DEC[i] * Math.PI) / 180;
      const cd = Math.cos(dec);
      positions[i * 3] = cd * Math.cos(ra) * R;
      positions[i * 3 + 1] = cd * Math.sin(ra) * R;
      positions[i * 3 + 2] = Math.sin(dec) * R;

      const [r, g, b] = bvToRgb(STAR_BV[i]);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      // Apparent area grows with brightness: size ~ 10^(-0.1 * mag).
      sizes[i] = Math.pow(10, -0.1 * STAR_MAG[i]) * 0.22;
      phases[i] = (STAR_RA[i] * 12.9898 + STAR_DEC[i] * 78.233) % 6.283;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }

  private buildLineGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const fades: number[] = [];

    for (const c of CONSTELLATIONS) {
      // Brighter, better known figures read stronger.
      const fade = c.rank === 1 ? 1 : c.rank === 2 ? 0.72 : 0.5;
      for (const seg of c.segs) {
        for (let i = 0; i + 1 < seg.length; i++) {
          const [ra1, dec1] = seg[i];
          const [ra2, dec2] = seg[i + 1];
          positions.push(
            ...this.equatorialToVec3(ra1, dec1),
            ...this.equatorialToVec3(ra2, dec2),
          );
          fades.push(fade, fade);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aFade", new THREE.Float32BufferAttribute(fades, 1));
    return geo;
  }

  private buildRingGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const ts: number[] = [];
    const steps = 256;
    const radius = R * 0.55;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      positions.push(Math.sin(a) * radius, 0, -Math.cos(a) * radius);
      ts.push(i / steps);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aFade", new THREE.Float32BufferAttribute(ts, 1));
    geo.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
    return geo;
  }

  private equatorialToVec3(raDeg: number, decDeg: number): [number, number, number] {
    const ra = (raDeg * Math.PI) / 180;
    const dec = (decDeg * Math.PI) / 180;
    const cd = Math.cos(dec);
    return [cd * Math.cos(ra) * R, cd * Math.sin(ra) * R, Math.sin(dec) * R];
  }

  /**
   * World-space position of a catalogue entry.
   *
   * The star field lives inside `skyGroup`, which carries the equatorial ->
   * alt-az rotation. Everything that lives in world space (labels, picking)
   * has to use the rotated vector instead.
   */
  private worldPosition(entry: CatalogueEntry): [number, number, number] {
    const v = this.index.altAzVector(entry);
    return [v[0] * R, v[1] * R, v[2] * R];
  }

  /* -------------------------------------------------------------- events */

  private bindEvents(canvas: HTMLCanvasElement) {
    const onPointerDown = (e: PointerEvent) => {
      this.dragging = true;
      this.autoDrift = false;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastPointer.x;
      const dy = e.clientY - this.lastPointer.y;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      this.targetYaw -= dx * 0.0035;
      this.targetPitch = Math.max(-1.45, Math.min(1.45, this.targetPitch + dy * 0.003));
    };
    const onPointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(
        e.clientX - this.lastPointer.x,
        e.clientY - this.lastPointer.y,
      );
      this.dragging = false;
      if (moved < 4) this.pick(e.clientX, e.clientY);
    };
    const onWheel = (e: WheelEvent) => {
      // Allow page scroll when not zooming with modifier keys
      if (!e.ctrlKey && !e.metaKey) {
        return;
      }
      e.preventDefault();
      this.zoom = Math.max(0.45, Math.min(2.6, this.zoom * (1 - e.deltaY * 0.0012)));
      this.autoDrift = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    this.cleanup = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }

  private cleanup: () => void = () => {};

  /* ------------------------------------------------------------- picking */

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private pick(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);

    let best: CatalogueEntry | null = null;
    let bestDist = Infinity;

    // Bodies (planets, satellites) win over stars because they are brighter.
    for (const entry of this.bodies.values()) {
      const dist = this.raycaster.ray.distanceToPoint(
        new THREE.Vector3(...this.worldPosition(entry)),
      );
      const angular = (dist / R) * (180 / Math.PI);
      if (angular < 2.4 && dist < bestDist) {
        bestDist = dist;
        best = entry;
      }
    }

    if (!best) {
      // Fall back to the closest named star.
      const hits = this.raycaster.intersectObject(this.starPoints, false);
      if (hits.length) {
        const index = hits[0].index ?? 0;
        const named = this.index.namedStars.find(
          (s) =>
            Math.abs(s.ra - STAR_RA[index]) < 0.02 &&
            Math.abs(s.dec - STAR_DEC[index]) < 0.02,
        );
        if (named) best = named;
      }
    }

    this.observer = best;
    this.onPick(best);
  }

  private bodyPosition(entry: CatalogueEntry): [number, number, number] {
    return this.equatorialToVec3(entry.ra, entry.dec);
  }

  /* -------------------------------------------------------------- bodies */

  private refreshBodies(force = false) {
    const now = performance.now();
    if (!force && now - this.lastEphemeris < 100) return;
    this.lastEphemeris = now;

    // The anchor date is where the sky was set to; from there the scene
    // keeps running forward on its own clock.
    const live = new Date(
      this.state.date.getTime() + (now - this.anchor),
    );

    this.index.update(live, { lat: this.state.lat, lon: this.state.lon });
    this.applySkyTransform();

    const bodies = [
      ...this.index.solarSystem,
      ...this.index.satellites,
    ];
    this.bodies.clear();
    for (const b of bodies) this.bodies.set(b.id, b);

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const kinds: number[] = [];

    for (const b of bodies) {
      positions.push(...this.bodyPosition(b));
      const [r, g, bl] = this.bodyColor(b);
      colors.push(r, g, bl);
      const kind = b.kind === "planet" ? 0 : b.kind === "satellite" ? 2 : 1;
      sizes.push(kind === 1 ? 0.3 : kind === 0 ? 0.22 : 0.16);
      kinds.push(kind);
    }

    const geo = this.markers.geometry;
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute("aKind", new THREE.Float32BufferAttribute(kinds, 1));
    geo.computeBoundingSphere();

    this.updateDomeLighting();
  }

  private bodyColor(entry: CatalogueEntry): [number, number, number] {
    switch (entry.name) {
      case "Sun":
        return [1.0, 0.92, 0.72];
      case "Moon":
        return [0.88, 0.89, 0.92];
      case "Venus":
        return [1.0, 0.94, 0.82];
      case "Mars":
        return [1.0, 0.62, 0.42];
      case "Jupiter":
        return [1.0, 0.85, 0.66];
      case "Saturn":
        return [1.0, 0.9, 0.72];
      case "Uranus":
        return [0.66, 0.9, 0.94];
      case "Neptune":
        return [0.5, 0.62, 1.0];
      default:
        return [0.78, 0.86, 0.98];
    }
  }

  private updateDomeLighting() {
    const sun = this.index.solarSystem.find((s) => s.name === "Sun");
    if (!sun) return;
    const alt = sun.alt ?? 0;
    const az = sun.az ?? 0;
    const altAz = this.altAzVector(sun);
    this.domeMat.uniforms.uSunDir.value.set(altAz[0], altAz[1], altAz[2]).normalize();
    this.domeMat.uniforms.uSunUp.value = Math.max(0, Math.min(1, (alt + 6) / 30));

    // Daylight washes the sky out; night restores the deep gradient.
    const day = Math.max(0, Math.min(1, (alt + 4) / 16));
    const twilight = Math.max(0, Math.min(1, (alt + 12) / 14));
    this.domeMat.uniforms.uZenith.value.copy(
      linearColor(0x05070f).lerp(linearColor(0x2f6fb0), day * 0.9),
    );
    this.domeMat.uniforms.uHorizon.value.copy(
      linearColor(0x0d1220).lerp(linearColor(0x9fc4e8), day * 0.85),
    );
    this.domeMat.uniforms.uGround.value.copy(
      linearColor(0x05060a).lerp(linearColor(0x6b7f9c), day * 0.6),
    );
    this.domeMat.uniforms.uSunColor.value.copy(
      linearColor(0xffc98a).lerp(linearColor(0xfff0d0), twilight),
    );
    this.domeMat.uniforms.uExposure.value = 1 - day * 0.35;
    void az;
  }

  private altAzVector(entry: CatalogueEntry): [number, number, number] {
    return this.index.altAzVector(entry);
  }

  /* ------------------------------------------------------------ transform */

  private applySkyTransform() {
    const lst = this.index.lst;
    const phi = (this.state.lat * Math.PI) / 180;
    const l = (lst * Math.PI) / 180;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const cl = Math.cos(l);
    const sl = Math.sin(l);

    const m = new THREE.Matrix4();
    m.set(
      -sl, cl, 0, 0,
      c * cl, c * sl, s, 0,
      s * cl, s * sl, -c, 0,
      0, 0, 0, 1,
    );
    this.skyGroup.matrixAutoUpdate = false;
    this.skyGroup.matrix.copy(m);
    this.skyGroup.matrixWorldNeedsUpdate = true;
  }

  /* ---------------------------------------------------------------- loop */

  resize = () => {
    const el = this.renderer.domElement;
    const width = el.clientWidth || 1;
    const height = el.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = FOV / this.zoom;
    this.camera.updateProjectionMatrix();

    const scale = height / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    this.starMat.uniforms.uScale.value = scale;
    this.markerMat.uniforms.uScale.value = scale;
  };

  setState(next: Partial<SkyState>) {
    const changed =
      (next.date && next.date.getTime() !== this.state.date.getTime()) ||
      (next.lat !== undefined && next.lat !== this.state.lat) ||
      (next.lon !== undefined && next.lon !== this.state.lon);

    this.state = { ...this.state, ...next };
    this.anchor = performance.now();
    if (changed) {
      // refreshBodies re-applies the sky transform with the fresh sidereal time.
      this.refreshBodies(true);
    }
  }

  /** Point the camera at a given altitude/azimuth, in degrees. */
  lookAt(alt: number, az: number) {
    this.autoDrift = false;
    this.targetPitch = Math.max(-1.45, Math.min(1.45, alt * (Math.PI / 180)));
    this.targetYaw = -az * (Math.PI / 180);
  }

  /** Turn the idle drift on or off. */
  setAutoDrift(enabled: boolean) {
    this.autoDrift = enabled;
  }

  /** True while the scene is drifting on its own. */
  get drifting() {
    return this.autoDrift;
  }

  render(dt: number) {
    if (this.disposed) return;
    this.time += dt;

    if (this.autoDrift) {
      this.targetYaw += dt * 0.012;
    }

    // Ease the camera toward its target.
    const ease = 1 - Math.pow(0.0025, dt);
    this.yaw += (this.targetYaw - this.yaw) * ease;
    this.pitch += (this.targetPitch - this.pitch) * ease;

    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotateY(this.yaw);
    // Positive pitch looks up towards the zenith.
    this.camera.rotateX(this.pitch);

    this.starMat.uniforms.uTime.value = this.time;
    this.markerMat.uniforms.uTime.value = this.time;
    this.domeMat.uniforms.uTime.value = this.time;

    this.refreshBodies();
    this.renderer.render(this.scene, this.camera);
    this.updateLabels();

    const heading = (((-this.yaw * 180) / Math.PI) % 360 + 360) % 360;
    this.onFrame({ heading, pitch: (this.pitch * 180) / Math.PI });
  }

  /* -------------------------------------------------------------- labels */

  private projected = new THREE.Vector3();

  /** Named stars bright enough to deserve a label. */
  private brightStars: CatalogueEntry[] = [];

  /** Approximate label boxes placed this frame, for collision avoidance. */
  private placedBoxes: { x0: number; y0: number; x1: number; y1: number }[] = [];

  private updateLabels() {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    const seen = new Set<string>();
    this.placedBoxes.length = 0;

    // Bodies first — they are the things people point at.
    const queue: { entry: CatalogueEntry; meta: string; priority: number }[] = [];
    for (const entry of this.bodies.values()) {
      queue.push({ entry, meta: entry.constellation ?? "", priority: 0 });
    }
    for (const entry of this.brightStars) {
      queue.push({ entry, meta: entry.constellation ?? "", priority: 1 });
    }

    // Faintest stars yield to the brightest.
    queue.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return (a.entry.mag ?? 99) - (b.entry.mag ?? 99);
    });

    const LABEL_H = 42;

    for (const item of queue) {
      const entry = item.entry;
      const [x, y, z] = this.worldPosition(entry);
      this.projected.set(x, y, z).project(this.camera);
      const sx = (this.projected.x * 0.5 + 0.5) * width;
      const sy = (-this.projected.y * 0.5 + 0.5) * height;

      const name = entry.name || entry.category;
      const w = Math.max(name.length * 7.4, item.meta.length * 6.2) + 12;

      // The label is drawn above the anchor, so it needs room above it and
      // must stay inside the canvas or it gets clipped to a sliver.
      const box = {
        x0: sx - w / 2,
        y0: sy - LABEL_H,
        x1: sx + w / 2,
        y1: sy + 2,
      };

      const inside =
        this.projected.z < 1 &&
        box.x0 > 4 &&
        box.x1 < width - 4 &&
        box.y0 > 4 &&
        box.y1 < height - 4;

      const collides = this.placedBoxes.some(
        (b) =>
          box.x0 < b.x1 + 4 &&
          box.x1 + 4 > b.x0 &&
          box.y0 < b.y1 + 2 &&
          box.y1 + 2 > b.y0,
      );

      seen.add(entry.id);
      let node = this.labelNodes.get(entry.id);
      if (!node) {
        node = document.createElement("div");
        node.className = "sky-label";
        node.innerHTML = `<span class="sky-label__name"></span><span class="sky-label__meta"></span>`;
        node.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
          this.observer = entry;
          this.onPick(entry);
        });
        this.labelLayer.appendChild(node);
        this.labelNodes.set(entry.id, node);
      }

      const nameEl = node.firstElementChild as HTMLElement;
      const metaEl = node.lastElementChild as HTMLElement;
      nameEl.textContent = name;
      metaEl.textContent = item.meta;
      node.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;

      const show =
        inside && (collides ? this.observer?.id === entry.id : true);
      node.style.opacity = show ? "1" : "0";
      node.style.pointerEvents = show ? "auto" : "none";
      if (show) this.placedBoxes.push(box);

      node.classList.toggle("is-selected", this.observer?.id === entry.id);
      node.dataset.kind = entry.kind;
    }

    // Hide labels for bodies that no longer exist.
    for (const [id, node] of this.labelNodes) {
      if (!seen.has(id)) {
        node.remove();
        this.labelNodes.delete(id);
      }
    }
  }

  dispose() {
    this.disposed = true;
    this.cleanup();
    this.starPoints.geometry.dispose();
    this.starMat.dispose();
    this.lineSegments.geometry.dispose();
    this.lineMat.dispose();
    this.markers.geometry.dispose();
    this.markerMat.dispose();
    this.ring.geometry.dispose();
    this.ringMat.dispose();
    this.dome.geometry.dispose();
    this.domeMat.dispose();
    this.renderer.dispose();
    this.labelNodes.forEach((n) => n.remove());
    this.labelNodes.clear();
  }
}

/** Angular distance helper re-exported for the HUD. */
export { angularSeparation };
