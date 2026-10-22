/**
 * GLSL used by the Staraim sky renderer.
 */

/* ------------------------------------------------------------------ dome */

/**
 * Sky dome: a night gradient that brightens towards the horizon, a warm
 * glow around the sun's direction and a faint milky-way band computed
 * directly from the galactic latitude of each fragment.
 */
export const DOME_VERT = /* glsl */ `
  varying vec3 vDir;

  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const DOME_FRAG = /* glsl */ `
  precision highp float;

  varying vec3 vDir;

  uniform vec3  uZenith;
  uniform vec3  uHorizon;
  uniform vec3  uGround;
  uniform vec3  uSunDir;      // alt-az space
  uniform vec3  uSunColor;
  uniform float uSunUp;       // 0 = below the horizon, 1 = high
  uniform float uTime;
  uniform float uExposure;

  // North galactic pole in J2000 equatorial coordinates.
  const vec3 NGP = vec3(-0.8676661, -0.1980764, 0.4559838);

  // Cheap value noise.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    vec3 dir = normalize(vDir);
    float alt = dir.y;

    // Base gradient: deep space overhead fading to a lighter horizon.
    float t = clamp(alt * 0.5 + 0.5, 0.0, 1.0);
    vec3 sky = mix(uHorizon, uZenith, pow(clamp(alt, 0.0, 1.0), 0.55));

    // Ground half.
    if (alt < 0.0) {
      sky = mix(uHorizon, uGround, clamp(-alt * 4.0, 0.0, 1.0));
    }

    // Twilight / daylight glow around the sun.
    float sunDot = max(dot(dir, uSunDir), 0.0);
    float horizonBand = exp(-abs(alt) * 3.2);
    float glow = pow(sunDot, 5.0) * 0.85 + pow(sunDot, 42.0) * 1.4;
    sky += uSunColor * glow * (0.25 + 0.75 * uSunUp);
    sky += uSunColor * horizonBand * pow(sunDot, 2.0) * 0.18 * (1.0 - uSunUp);

    // Milky way: a noisy band around the galactic plane.
    float galLat = dot(dir, NGP);
    float band = exp(-pow(galLat * 5.4, 2.0));
    float clumps = fbm(dir * 9.0) * 0.65 + fbm(dir * 26.0) * 0.35;
    float dust = smoothstep(0.25, 0.85, fbm(dir * 14.0 + 3.7));
    float mw = band * clumps * mix(0.55, 1.0, dust) * smoothstep(-0.12, 0.25, alt);
    sky += vec3(0.30, 0.31, 0.40) * mw * 0.16;

    // Very slight vertical banding for texture, like real airglow.
    sky += vec3(0.02, 0.025, 0.04) * fbm(dir * 3.0 + uTime * 0.01);

    gl_FragColor = vec4(sky * uExposure, 1.0);
  }
`;

/* ----------------------------------------------------------------- stars */

export const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aPhase;

  varying vec3  vColor;
  varying float vTwinkle;

  uniform float uTime;
  uniform float uScale;
  uniform float uBoost;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Scintillation: strongest for bright stars near the horizon.
    float horizonFactor = 1.0 - clamp(normalize(position).y * 0.6, 0.0, 1.0);
    float tw = 0.78 + 0.22 * sin(uTime * 2.1 + aPhase) * horizonFactor;
    vTwinkle = tw;
    vColor = aColor;

    gl_PointSize = clamp(aSize * uScale * uBoost * tw, 0.8, 26.0);
  }
`;

export const STAR_FRAG = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Airy-ish falloff with a hot core.
    float core = exp(-d * d * 26.0);
    float halo = exp(-d * d * 5.5) * 0.42;
    float alpha = clamp(core + halo, 0.0, 1.0);

    // Slight diffraction spikes on the brightest stars.
    float spike = max(0.0, 1.0 - abs(uv.x) * 22.0) + max(0.0, 1.0 - abs(uv.y) * 22.0);
    alpha += spike * exp(-d * d * 14.0) * 0.18 * vTwinkle;

    gl_FragColor = vec4(vColor * (0.75 + 0.55 * vTwinkle), alpha);
  }
`;

/* ----------------------------------------------------- constellation lines */

export const LINE_VERT = /* glsl */ `
  attribute float aFade;
  varying float vFade;
  void main() {
    vFade = aFade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const LINE_FRAG = /* glsl */ `
  precision highp float;
  varying float vFade;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor, vFade * uOpacity);
  }
`;

/* ------------------------------------------------------- object markers */

export const MARKER_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aKind;   // 0 = planet, 1 = moon/sun, 2 = satellite

  varying vec3  vColor;
  varying float vKind;

  uniform float uScale;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    vKind = aKind;
    gl_PointSize = aSize * uScale;
  }
`;

export const MARKER_FRAG = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vKind;

  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    if (vKind < 0.5) {
      // Planet: solid disc with a soft glow.
      if (d > 0.5) discard;
      float disc = smoothstep(0.34, 0.24, d);
      float glow = exp(-d * d * 13.0) * 0.5;
      gl_FragColor = vec4(vColor, clamp(disc + glow, 0.0, 1.0));
    } else if (vKind < 1.5) {
      // Moon / Sun: brighter core with rays.
      if (d > 0.5) discard;
      float disc = smoothstep(0.40, 0.33, d);
      float glow = exp(-d * d * 9.0) * 0.55;
      gl_FragColor = vec4(vColor, clamp(disc + glow, 0.0, 1.0));
    } else {
      // Satellite: a crisp dot with a pulsing halo.
      if (d > 0.5) discard;
      float pulse = 0.5 + 0.5 * sin(uTime * 2.4);
      float disc = smoothstep(0.22, 0.12, d);
      float glow = exp(-d * d * 16.0) * (0.18 + 0.16 * pulse);
      gl_FragColor = vec4(vColor, clamp(disc + glow, 0.0, 1.0));
    }
  }
`;

/* ------------------------------------------------------------ horizon ring */

export const RING_VERT = /* glsl */ `
  varying float vT;
  attribute float aT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const RING_FRAG = /* glsl */ `
  precision highp float;
  varying float vT;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float fade = 1.0 - abs(vT - 0.5) * 2.0;
    gl_FragColor = vec4(uColor, fade * uOpacity);
  }
`;
