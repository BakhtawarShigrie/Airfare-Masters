"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Airport {
  name: string;
  code: string;
  lat: number;
  lon: number;
}

interface FlightRoute {
  from: Airport;
  to: Airport;
  speed: number;
  offset: number;
  altitude: number;
}

const AIRPORTS: Record<string, Airport> = {
  // South Asia & Indian Ocean
  LHE: { name: "Lahore", code: "LHE", lat: 31.5204, lon: 74.3587 },
  ISB: { name: "Islamabad", code: "ISB", lat: 33.549, lon: 72.8258 },
  KHI: { name: "Karachi", code: "KHI", lat: 24.9065, lon: 67.1608 },
  DEL: { name: "New Delhi", code: "DEL", lat: 28.5562, lon: 77.1 },
  BOM: { name: "Mumbai", code: "BOM", lat: 19.0896, lon: 72.8656 },
  CMB: { name: "Colombo", code: "CMB", lat: 7.1808, lon: 79.8841 },
  MLE: { name: "Male", code: "MLE", lat: 4.1918, lon: 73.5291 },
  MRU: { name: "Mauritius", code: "MRU", lat: -20.4302, lon: 57.6836 },

  // Middle East
  DXB: { name: "Dubai", code: "DXB", lat: 25.2532, lon: 55.3657 },
  DOH: { name: "Doha", code: "DOH", lat: 25.2731, lon: 51.6081 },
  JED: { name: "Jeddah", code: "JED", lat: 21.6796, lon: 39.1565 },
  RUH: { name: "Riyadh", code: "RUH", lat: 24.9576, lon: 46.6988 },
  MCT: { name: "Muscat", code: "MCT", lat: 23.5933, lon: 58.2844 },

  // Europe & North Atlantic
  IST: { name: "Istanbul", code: "IST", lat: 41.2753, lon: 28.7519 },
  LHR: { name: "London", code: "LHR", lat: 51.47, lon: -0.4543 },
  CDG: { name: "Paris", code: "CDG", lat: 49.0097, lon: 2.5479 },
  FRA: { name: "Frankfurt", code: "FRA", lat: 50.0379, lon: 8.5622 },
  AMS: { name: "Amsterdam", code: "AMS", lat: 52.3105, lon: 4.7683 },
  MAD: { name: "Madrid", code: "MAD", lat: 40.4983, lon: -3.5676 },
  FCO: { name: "Rome", code: "FCO", lat: 41.8003, lon: 12.2389 },
  SVO: { name: "Moscow", code: "SVO", lat: 55.9726, lon: 37.4146 },
  KEF: { name: "Reykjavik", code: "KEF", lat: 63.985, lon: -22.6056 },

  // Africa
  CAI: { name: "Cairo", code: "CAI", lat: 30.1219, lon: 31.4056 },
  ADD: { name: "Addis Ababa", code: "ADD", lat: 8.9779, lon: 38.7993 },
  NBO: { name: "Nairobi", code: "NBO", lat: -1.3192, lon: 36.9278 },
  LOS: { name: "Lagos", code: "LOS", lat: 6.5774, lon: 3.3212 },
  JNB: { name: "Johannesburg", code: "JNB", lat: -26.1367, lon: 28.2411 },
  CPT: { name: "Cape Town", code: "CPT", lat: -33.9715, lon: 18.6021 },

  // North America & Central Pacific
  JFK: { name: "New York", code: "JFK", lat: 40.6413, lon: -73.7781 },
  YYZ: { name: "Toronto", code: "YYZ", lat: 43.6777, lon: -79.6248 },
  ORD: { name: "Chicago", code: "ORD", lat: 41.9742, lon: -87.9073 },
  YVR: { name: "Vancouver", code: "YVR", lat: 49.1967, lon: -123.1815 },
  SFO: { name: "San Francisco", code: "SFO", lat: 37.6213, lon: -122.379 },
  LAX: { name: "Los Angeles", code: "LAX", lat: 33.9416, lon: -118.4085 },
  MIA: { name: "Miami", code: "MIA", lat: 25.7959, lon: -80.287 },
  MEX: { name: "Mexico City", code: "MEX", lat: 19.4361, lon: -99.0719 },
  ANC: { name: "Anchorage", code: "ANC", lat: 61.1743, lon: -149.9982 },
  HNL: { name: "Honolulu", code: "HNL", lat: 21.3187, lon: -157.9225 },

  // South America
  BOG: { name: "Bogota", code: "BOG", lat: 4.7016, lon: -74.1469 },
  LIM: { name: "Lima", code: "LIM", lat: -12.0219, lon: -77.1143 },
  GRU: { name: "Sao Paulo", code: "GRU", lat: -23.4356, lon: -46.4731 },
  EZE: { name: "Buenos Aires", code: "EZE", lat: -34.8222, lon: -58.5358 },
  SCL: { name: "Santiago", code: "SCL", lat: -33.393, lon: -70.7858 },

  // East & Southeast Asia
  PEK: { name: "Beijing", code: "PEK", lat: 40.0799, lon: 116.6031 },
  PVG: { name: "Shanghai", code: "PVG", lat: 31.1443, lon: 121.8083 },
  ICN: { name: "Seoul", code: "ICN", lat: 37.4602, lon: 126.4407 },
  HND: { name: "Tokyo", code: "HND", lat: 35.5494, lon: 139.7798 },
  HKG: { name: "Hong Kong", code: "HKG", lat: 22.308, lon: 113.9185 },
  TPE: { name: "Taipei", code: "TPE", lat: 25.0797, lon: 121.2342 },
  MNL: { name: "Manila", code: "MNL", lat: 14.5086, lon: 121.0194 },
  BKK: { name: "Bangkok", code: "BKK", lat: 13.69, lon: 100.7501 },
  KUL: { name: "Kuala Lumpur", code: "KUL", lat: 2.7456, lon: 101.7099 },
  SIN: { name: "Singapore", code: "SIN", lat: 1.3644, lon: 103.9915 },
  CGK: { name: "Jakarta", code: "CGK", lat: -6.1256, lon: 106.6559 },

  // Oceania & South Pacific
  PER: { name: "Perth", code: "PER", lat: -31.9385, lon: 115.9672 },
  SYD: { name: "Sydney", code: "SYD", lat: -33.9399, lon: 151.1753 },
  MEL: { name: "Melbourne", code: "MEL", lat: -37.669, lon: 144.841 },
  AKL: { name: "Auckland", code: "AKL", lat: -37.0082, lon: 174.785 },
  NAN: { name: "Fiji", code: "NAN", lat: -17.7554, lon: 177.4434 },
};

// 58 global + trans-oceanic routes x 4 staggered aircraft = 232 live planes
const FLIGHT_ROUTES: FlightRoute[] = [
  // Pakistan & Middle East Hub
  { from: AIRPORTS.LHE, to: AIRPORTS.DXB, speed: 0.015, offset: 0.05, altitude: 0.02 },
  { from: AIRPORTS.LHE, to: AIRPORTS.JED, speed: 0.013, offset: 0.31, altitude: 0.026 },
  { from: AIRPORTS.LHE, to: AIRPORTS.LHR, speed: 0.011, offset: 0.58, altitude: 0.038 },
  { from: AIRPORTS.LHE, to: AIRPORTS.KUL, speed: 0.012, offset: 0.19, altitude: 0.03 },
  { from: AIRPORTS.LHE, to: AIRPORTS.PEK, speed: 0.013, offset: 0.74, altitude: 0.028 },
  { from: AIRPORTS.ISB, to: AIRPORTS.DOH, speed: 0.016, offset: 0.44, altitude: 0.02 },
  { from: AIRPORTS.ISB, to: AIRPORTS.IST, speed: 0.013, offset: 0.82, altitude: 0.03 },
  { from: AIRPORTS.KHI, to: AIRPORTS.DXB, speed: 0.017, offset: 0.12, altitude: 0.016 },
  { from: AIRPORTS.KHI, to: AIRPORTS.RUH, speed: 0.014, offset: 0.63, altitude: 0.022 },
  { from: AIRPORTS.MCT, to: AIRPORTS.BKK, speed: 0.013, offset: 0.27, altitude: 0.028 },

  // Indian Ocean Crossing Routes
  { from: AIRPORTS.DXB, to: AIRPORTS.MRU, speed: 0.011, offset: 0.16, altitude: 0.036 },
  { from: AIRPORTS.DXB, to: AIRPORTS.PER, speed: 0.01, offset: 0.52, altitude: 0.044 },
  { from: AIRPORTS.DOH, to: AIRPORTS.MLE, speed: 0.014, offset: 0.39, altitude: 0.026 },
  { from: AIRPORTS.MLE, to: AIRPORTS.SIN, speed: 0.014, offset: 0.71, altitude: 0.026 },
  { from: AIRPORTS.BOM, to: AIRPORTS.MRU, speed: 0.012, offset: 0.85, altitude: 0.032 },
  { from: AIRPORTS.CMB, to: AIRPORTS.MEL, speed: 0.01, offset: 0.22, altitude: 0.042 },
  { from: AIRPORTS.JNB, to: AIRPORTS.PER, speed: 0.01, offset: 0.66, altitude: 0.044 },
  { from: AIRPORTS.MRU, to: AIRPORTS.KUL, speed: 0.011, offset: 0.48, altitude: 0.036 },

  // Europe, Africa & South Atlantic Crossing Routes
  { from: AIRPORTS.LHR, to: AIRPORTS.JFK, speed: 0.012, offset: 0.14, altitude: 0.034 },
  { from: AIRPORTS.LHR, to: AIRPORTS.KEF, speed: 0.016, offset: 0.57, altitude: 0.02 },
  { from: AIRPORTS.KEF, to: AIRPORTS.YYZ, speed: 0.013, offset: 0.33, altitude: 0.028 },
  { from: AIRPORTS.CDG, to: AIRPORTS.YYZ, speed: 0.012, offset: 0.76, altitude: 0.034 },
  { from: AIRPORTS.FRA, to: AIRPORTS.ORD, speed: 0.011, offset: 0.41, altitude: 0.038 },
  { from: AIRPORTS.AMS, to: AIRPORTS.MIA, speed: 0.011, offset: 0.88, altitude: 0.038 },
  { from: AIRPORTS.MAD, to: AIRPORTS.BOG, speed: 0.011, offset: 0.24, altitude: 0.038 },
  { from: AIRPORTS.MAD, to: AIRPORTS.GRU, speed: 0.01, offset: 0.61, altitude: 0.04 },
  { from: AIRPORTS.FCO, to: AIRPORTS.EZE, speed: 0.0095, offset: 0.09, altitude: 0.046 },
  { from: AIRPORTS.LOS, to: AIRPORTS.GRU, speed: 0.012, offset: 0.49, altitude: 0.034 },
  { from: AIRPORTS.CPT, to: AIRPORTS.GRU, speed: 0.011, offset: 0.79, altitude: 0.036 },
  { from: AIRPORTS.LHR, to: AIRPORTS.CPT, speed: 0.01, offset: 0.36, altitude: 0.044 },
  { from: AIRPORTS.CAI, to: AIRPORTS.JNB, speed: 0.011, offset: 0.68, altitude: 0.038 },
  { from: AIRPORTS.ADD, to: AIRPORTS.LOS, speed: 0.014, offset: 0.17, altitude: 0.026 },
  { from: AIRPORTS.IST, to: AIRPORTS.NBO, speed: 0.013, offset: 0.53, altitude: 0.03 },

  // Europe / Middle East to Asia
  { from: AIRPORTS.DXB, to: AIRPORTS.LHR, speed: 0.012, offset: 0.28, altitude: 0.034 },
  { from: AIRPORTS.DXB, to: AIRPORTS.SIN, speed: 0.012, offset: 0.64, altitude: 0.034 },
  { from: AIRPORTS.DXB, to: AIRPORTS.JFK, speed: 0.01, offset: 0.42, altitude: 0.046 },
  { from: AIRPORTS.DOH, to: AIRPORTS.HND, speed: 0.01, offset: 0.81, altitude: 0.042 },
  { from: AIRPORTS.SVO, to: AIRPORTS.PVG, speed: 0.011, offset: 0.15, altitude: 0.036 },
  { from: AIRPORTS.FRA, to: AIRPORTS.ICN, speed: 0.011, offset: 0.55, altitude: 0.038 },
  { from: AIRPORTS.DEL, to: AIRPORTS.HKG, speed: 0.014, offset: 0.73, altitude: 0.026 },
  { from: AIRPORTS.SIN, to: AIRPORTS.HND, speed: 0.013, offset: 0.37, altitude: 0.032 },
  { from: AIRPORTS.CGK, to: AIRPORTS.TPE, speed: 0.014, offset: 0.91, altitude: 0.026 },

  // North & South America Inland / Coastal
  { from: AIRPORTS.JFK, to: AIRPORTS.LAX, speed: 0.014, offset: 0.21, altitude: 0.024 },
  { from: AIRPORTS.YYZ, to: AIRPORTS.YVR, speed: 0.014, offset: 0.59, altitude: 0.024 },
  { from: AIRPORTS.ORD, to: AIRPORTS.MEX, speed: 0.015, offset: 0.84, altitude: 0.022 },
  { from: AIRPORTS.MIA, to: AIRPORTS.LIM, speed: 0.013, offset: 0.47, altitude: 0.028 },
  { from: AIRPORTS.BOG, to: AIRPORTS.EZE, speed: 0.013, offset: 0.11, altitude: 0.03 },

  // Pacific Ocean Crossing Routes (North, Central & South Pacific)
  { from: AIRPORTS.HND, to: AIRPORTS.LAX, speed: 0.01, offset: 0.18, altitude: 0.044 },
  { from: AIRPORTS.HND, to: AIRPORTS.HNL, speed: 0.012, offset: 0.54, altitude: 0.036 },
  { from: AIRPORTS.HNL, to: AIRPORTS.SFO, speed: 0.014, offset: 0.77, altitude: 0.026 },
  { from: AIRPORTS.HNL, to: AIRPORTS.SYD, speed: 0.01, offset: 0.34, altitude: 0.042 },
  { from: AIRPORTS.ICN, to: AIRPORTS.YVR, speed: 0.011, offset: 0.69, altitude: 0.038 },
  { from: AIRPORTS.PVG, to: AIRPORTS.SFO, speed: 0.01, offset: 0.43, altitude: 0.044 },
  { from: AIRPORTS.TPE, to: AIRPORTS.ANC, speed: 0.011, offset: 0.87, altitude: 0.036 },
  { from: AIRPORTS.ANC, to: AIRPORTS.ORD, speed: 0.013, offset: 0.25, altitude: 0.028 },
  { from: AIRPORTS.MNL, to: AIRPORTS.HNL, speed: 0.01, offset: 0.62, altitude: 0.042 },
  { from: AIRPORTS.SYD, to: AIRPORTS.NAN, speed: 0.015, offset: 0.13, altitude: 0.022 },
  { from: AIRPORTS.NAN, to: AIRPORTS.LAX, speed: 0.01, offset: 0.49, altitude: 0.044 },
  { from: AIRPORTS.AKL, to: AIRPORTS.SCL, speed: 0.0095, offset: 0.75, altitude: 0.046 },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function createFallbackOceanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const ocean = ctx.createLinearGradient(0, 0, 0, 256);
    ocean.addColorStop(0, "#102846");
    ocean.addColorStop(0.5, "#163861");
    ocean.addColorStop(1, "#0e223b");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, 512, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Clean, small airplane silhouette geometry (no smoke trails)
 */
function createAirplaneGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.024); // Nose
  shape.lineTo(0.0036, 0.0135);
  shape.lineTo(0.004, 0.0042);
  shape.lineTo(0.024, -0.0052); // Right main wing
  shape.lineTo(0.024, -0.01);
  shape.lineTo(0.004, -0.0036);
  shape.lineTo(0.003, -0.0155);
  shape.lineTo(0.01, -0.021); // Right tail
  shape.lineTo(0.01, -0.0245);
  shape.lineTo(0, -0.02);
  shape.lineTo(-0.01, -0.0245); // Left tail
  shape.lineTo(-0.01, -0.021);
  shape.lineTo(-0.003, -0.0155);
  shape.lineTo(-0.004, -0.0036);
  shape.lineTo(-0.024, -0.01); // Left main wing
  shape.lineTo(-0.024, -0.0052);
  shape.lineTo(-0.004, 0.0042);
  shape.lineTo(-0.0036, 0.0135);
  shape.closePath();

  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

export default function Globe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.22, 6.05);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Master globe container: Earth, clouds, routes, and all 232 airplanes move together
    const globeGroup = new THREE.Group();
    const updateGlobeOffset = () => {
      if (window.innerWidth >= 1024) {
        globeGroup.position.set(1.42, -0.04, 0);
      } else {
        globeGroup.position.set(0, -0.28, -0.35);
      }
    };
    updateGlobeOffset();

    // Start angled facing Pakistan, Middle East, Europe & Asia
    globeGroup.rotation.y = -2.72;
    globeGroup.rotation.x = 0.24;
    scene.add(globeGroup);

    // Natural orbital sunlight without artificial saturation boost
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
    sunLight.position.set(4.5, 2.8, 6);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    rimLight.position.set(-5, 1.5, -3);
    scene.add(rimLight);

    const GLOBE_RADIUS = 2.12;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    const fallbackTexture = createFallbackOceanTexture();
    let loadedEarthMap: THREE.Texture | null = null;
    let loadedBumpMap: THREE.Texture | null = null;
    let loadedWaterMap: THREE.Texture | null = null;
    let loadedCloudsMap: THREE.Texture | null = null;

    // 1. Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 72);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: fallbackTexture,
      bumpScale: 0.04,
      specular: new THREE.Color("#234166"),
      shininess: 14,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Load satellite texture with muted natural saturation
    const applyDesaturatedSatelliteTexture = (
      primaryUrl: string,
      backupUrl: string
    ) => {
      const processImage = (img: HTMLImageElement) => {
        const offscreen = document.createElement("canvas");
        offscreen.width = img.naturalWidth || 2048;
        offscreen.height = img.naturalHeight || 1024;
        const ctx = offscreen.getContext("2d");

        if (ctx) {
          ctx.filter = "saturate(65%) contrast(103%) brightness(95%)";
          ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
        }

        const tex = new THREE.CanvasTexture(offscreen);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        loadedEarthMap = tex;
        earthMaterial.map = tex;
        earthMaterial.needsUpdate = true;
      };

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => processImage(img);
      img.onerror = () => {
        const backupImg = new Image();
        backupImg.crossOrigin = "anonymous";
        backupImg.onload = () => processImage(backupImg);
        backupImg.src = backupUrl;
      };
      img.src = primaryUrl;
    };

    applyDesaturatedSatelliteTexture(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
    );

    // Terrain Topology Bump Map
    textureLoader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png",
      (tex) => {
        loadedBumpMap = tex;
        earthMaterial.bumpMap = tex;
        earthMaterial.needsUpdate = true;
      }
    );

    // Ocean Water Specular Map
    textureLoader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png",
      (tex) => {
        loadedWaterMap = tex;
        earthMaterial.specularMap = tex;
        earthMaterial.needsUpdate = true;
      }
    );

    // 2. Subtle Cloud Layer
    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.012, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(cloudMesh);

    textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png",
      (tex) => {
        loadedCloudsMap = tex;
        cloudMaterial.map = tex;
        cloudMaterial.needsUpdate = true;
      }
    );

    // 3. Soft Atmospheric Rim Glow
    const atmosphereGeometry = new THREE.SphereGeometry(
      GLOBE_RADIUS + 0.13,
      64,
      64
    );
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.64 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.35, 0.68, 0.95, 0.45) * intensity;
        }
      `,
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    globeGroup.add(atmosphereMesh);

    // 4. Tiny Airport Dots attached directly to Globe Surface
    const upAxis = new THREE.Vector3(0, 1, 0);
    const dotGeo = new THREE.CircleGeometry(0.0085, 14);
    dotGeo.rotateX(-Math.PI / 2);
    const dotMat = new THREE.MeshBasicMaterial({
      color: "#fbbf24",
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });

    Object.values(AIRPORTS).forEach((airport) => {
      const pos = latLonToVector3(
        airport.lat,
        airport.lon,
        GLOBE_RADIUS + 0.008
      );
      const normal = pos.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(upAxis, normal);

      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.quaternion.copy(quat);
      globeGroup.add(dotMesh);
    });

    // 5. Surface-Hugging Flight Arcs & 232 Small Moving Airplanes (No Smoke)
    interface AnimatedFlight {
      curve: THREE.CatmullRomCurve3;
      speed: number;
      offset: number;
      reverse: boolean;
    }

    const animatedFlights: AnimatedFlight[] = [];
    const arcGeometries: THREE.BufferGeometry[] = [];
    const arcMaterial = new THREE.LineBasicMaterial({
      color: "#93c5fd",
      transparent: true,
      opacity: 0.13,
    });

    FLIGHT_ROUTES.forEach((route) => {
      const start = latLonToVector3(
        route.from.lat,
        route.from.lon,
        GLOBE_RADIUS + 0.009
      );
      const end = latLonToVector3(
        route.to.lat,
        route.to.lon,
        GLOBE_RADIUS + 0.009
      );

      const arcPoints: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const interpolated = new THREE.Vector3()
          .lerpVectors(start, end, t)
          .normalize();
        const elevation =
          GLOBE_RADIUS + 0.009 + Math.sin(Math.PI * t) * route.altitude;
        arcPoints.push(interpolated.multiplyScalar(elevation));
      }

      const curve = new THREE.CatmullRomCurve3(arcPoints);

      // Subtle flight trajectory line hugging the globe
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(72)
      );
      arcGeometries.push(arcGeometry);
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);

      // 4 staggered bidirectional flights per route (58 * 4 = 232 active airplanes)
      animatedFlights.push(
        {
          curve,
          speed: route.speed,
          offset: route.offset,
          reverse: false,
        },
        {
          curve,
          speed: route.speed * 0.96,
          offset: (route.offset + 0.5) % 1,
          reverse: false,
        },
        {
          curve,
          speed: route.speed * 0.93,
          offset: (route.offset + 0.25) % 1,
          reverse: true,
        },
        {
          curve,
          speed: route.speed * 0.98,
          offset: (route.offset + 0.75) % 1,
          reverse: true,
        }
      );
    });

    // High-performance GPU InstancedMesh for all 232 airplanes
    const airplaneGeometry = createAirplaneGeometry();
    const airplaneMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      side: THREE.DoubleSide,
    });
    const instancedPlanes = new THREE.InstancedMesh(
      airplaneGeometry,
      airplaneMaterial,
      animatedFlights.length
    );
    instancedPlanes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedPlanes.frustumCulled = false;
    globeGroup.add(instancedPlanes);

    const basisMatrix = new THREE.Matrix4();
    const instanceMatrix = new THREE.Matrix4();
    const instanceQuat = new THREE.Quaternion();
    const instanceScale = new THREE.Vector3();
    const rightVec = new THREE.Vector3();
    const trueUpVec = new THREE.Vector3();

    // 6. Scoped Mouse / Touch Drag Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const canvasEl = renderer.domElement;
    canvasEl.style.cursor = "grab";
    canvasEl.style.touchAction = "pan-y";

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      canvasEl.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      velocityY = dx * 0.0045;
      velocityX = dy * 0.003;

      globeGroup.rotation.y += velocityY;
      globeGroup.rotation.x = THREE.MathUtils.clamp(
        globeGroup.rotation.x + velocityX,
        -0.85,
        0.85
      );
    };

    const onPointerUp = () => {
      isDragging = false;
      canvasEl.style.cursor = "grab";
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateGlobeOffset();
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle cloud drift
      cloudMesh.rotation.y = elapsed * 0.006;

      // Smooth auto-rotation when user is not dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.001 + velocityY;
        globeGroup.rotation.x = THREE.MathUtils.clamp(
          globeGroup.rotation.x + velocityX,
          -0.85,
          0.85
        );
        velocityX *= 0.92;
        velocityY *= 0.92;
      }

      // Update all 232 airplanes slowly along their globe surface curves
      for (let i = 0; i < animatedFlights.length; i++) {
        const flight = animatedFlights[i];
        const rawT = (elapsed * flight.speed + flight.offset) % 1;
        const t = flight.reverse ? 1 - rawT : rawT;

        const pos = flight.curve.getPointAt(t);
        const tangent = flight.curve.getTangentAt(t).normalize();
        if (flight.reverse) {
          tangent.negate();
        }

        const surfaceUp = pos.clone().normalize();
        rightVec.crossVectors(surfaceUp, tangent).normalize();
        trueUpVec.crossVectors(tangent, rightVec).normalize();

        basisMatrix.makeBasis(rightVec, trueUpVec, tangent);
        instanceQuat.setFromRotationMatrix(basisMatrix);

        const arcFactor = Math.sin(Math.PI * rawT);
        const s = 0.82 + 0.18 * Math.pow(arcFactor, 0.3);
        instanceScale.set(s, s, s);

        instanceMatrix.compose(pos, instanceQuat, instanceScale);
        instancedPlanes.setMatrixAt(i, instanceMatrix);
      }
      instancedPlanes.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);

      earthGeometry.dispose();
      earthMaterial.dispose();
      fallbackTexture.dispose();
      loadedEarthMap?.dispose();
      loadedBumpMap?.dispose();
      loadedWaterMap?.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      loadedCloudsMap?.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      airplaneGeometry.dispose();
      airplaneMaterial.dispose();
      instancedPlanes.dispose();
      arcMaterial.dispose();
      arcGeometries.forEach((g) => g.dispose());

      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Interactive 3D Satellite Earth Globe with live flight routes"
      className="w-full h-full select-none"
    />
  );
}