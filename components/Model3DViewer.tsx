'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sun, Sparkles, RefreshCw, Eye, Move } from 'lucide-react';

interface Model3DViewerProps {
  modelType?: 'watch' | 'vehicle' | 'gemstone' | 'antique' | 'gadget';
  title?: string;
  autoRotateDefault?: boolean;
}

export default function Model3DViewer({
  modelType = 'watch',
  title = 'Interactive 3D Inspection',
  autoRotateDefault = true,
}: Model3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'vault' | 'studio' | 'dramatic'>('vault');
  const [isLoading, setIsLoading] = useState(true);

  // References to keep animation loop and interaction updated without re-mounting
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.25, y: 0.4 });
  const targetZoomRef = useRef(4.5);
  const autoRotateStateRef = useRef(autoRotate);
  autoRotateStateRef.current = autoRotate;

  // Touch state
  const touchDistanceRef = useRef<number | null>(null);

  // Helper to build procedural 3D luxury meshes
  const createProceduralModel = useCallback((type: string): THREE.Group => {
    const group = new THREE.Group();

    if (type === 'watch') {
      // 1. WATCH CASE (Polished Gold / Stainless Steel)
      const caseGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.35, 48);
      const caseMat = new THREE.MeshStandardMaterial({
        color: 0xdfb76c, // Rich Gold
        metalness: 0.92,
        roughness: 0.18,
      });
      const watchCase = new THREE.Mesh(caseGeo, caseMat);
      watchCase.rotation.x = Math.PI / 2;
      group.add(watchCase);

      // Bezel ring with notches
      const bezelGeo = new THREE.TorusGeometry(1.42, 0.08, 16, 64);
      const bezelMat = new THREE.MeshStandardMaterial({
        color: 0x111827, // Dark ceramic bezel
        metalness: 0.8,
        roughness: 0.2,
      });
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      group.add(bezel);

      // Watch Dial (Matte Black)
      const dialGeo = new THREE.CylinderGeometry(1.28, 1.28, 0.05, 48);
      const dialMat = new THREE.MeshStandardMaterial({
        color: 0x0a0d14,
        roughness: 0.5,
        metalness: 0.2,
      });
      const dial = new THREE.Mesh(dialGeo, dialMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.z = 0.16;
      group.add(dial);

      // Dial Hour Markers (12 dots around circle)
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const radius = 1.05;
        const markerGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const markerMat = new THREE.MeshStandardMaterial({
          color: i % 3 === 0 ? 0xffd700 : 0xf0f0f0,
          emissive: 0x222211,
          metalness: 0.7,
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.19);
        group.add(marker);
      }

      // Hands (Hour, Minute, Red Second)
      const hourHandGeo = new THREE.BoxGeometry(0.08, 0.65, 0.02);
      const handMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
      const hourHand = new THREE.Mesh(hourHandGeo, handMat);
      hourHand.position.set(0.18, 0.25, 0.2);
      hourHand.rotation.z = -Math.PI / 4;
      group.add(hourHand);

      const minHandGeo = new THREE.BoxGeometry(0.06, 0.95, 0.02);
      const minHand = new THREE.Mesh(minHandGeo, handMat);
      minHand.position.set(-0.25, 0.35, 0.22);
      minHand.rotation.z = Math.PI / 3;
      group.add(minHand);

      const secHandGeo = new THREE.BoxGeometry(0.02, 1.05, 0.02);
      const secHandMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const secHand = new THREE.Mesh(secHandGeo, secHandMat);
      secHand.position.set(0, 0, 0.24);
      secHand.rotation.z = Math.PI / 6;
      group.add(secHand);

      // Sapphire Crystal (Glass sheen)
      const glassGeo = new THREE.CylinderGeometry(1.36, 1.36, 0.04, 48);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 0.4,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.z = 0.26;
      group.add(glass);

      // Oyster Bracelet Links (Top and Bottom curves)
      [-1, 1].forEach((dir) => {
        for (let j = 1; j <= 5; j++) {
          const linkGeo = new THREE.BoxGeometry(1.1 - j * 0.08, 0.35, 0.18);
          const linkMat = new THREE.MeshStandardMaterial({
            color: j % 2 === 0 ? 0xdfb76c : 0xc0c0c0,
            metalness: 0.95,
            roughness: 0.25,
          });
          const link = new THREE.Mesh(linkGeo, linkMat);
          const yPos = dir * (1.4 + j * 0.34);
          const zPos = -Math.pow(j * 0.24, 1.8);
          link.position.set(0, yPos, zPos);
          link.rotation.x = -dir * 0.22 * j;
          group.add(link);
        }
      });

      // Crown knob on right
      const crownGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16);
      const crown = new THREE.Mesh(crownGeo, caseMat);
      crown.rotation.z = Math.PI / 2;
      crown.position.set(1.5, 0, 0);
      group.add(crown);

    } else if (type === 'vehicle') {
      // 2. VINTAGE 4X4 OFF-ROAD VEHICLE (FJ40 Style)
      // Chassis & Body
      const bodyGeo = new THREE.BoxGeometry(2.4, 1.1, 1.5);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xc8a265, // Dune Sand Beige
        roughness: 0.35,
        metalness: 0.4,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0.2, 0);
      group.add(body);

      // Cabin / Roof (Iconic White Top)
      const roofGeo = new THREE.BoxGeometry(1.3, 0.9, 1.44);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f7,
        roughness: 0.2,
        metalness: 0.2,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(-0.35, 1.15, 0);
      group.add(roof);

      // Tinted Windows
      const winGeo = new THREE.BoxGeometry(1.2, 0.6, 1.48);
      const winMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        roughness: 0.1,
        transmission: 0.7,
        opacity: 0.8,
        transparent: true,
      });
      const windows = new THREE.Mesh(winGeo, winMat);
      windows.position.set(-0.35, 1.15, 0);
      group.add(windows);

      // Wheels (4 Rugged All-Terrain Tires)
      const tireGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.38, 24);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.9, metalness: 0.1 });
      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.4, 16);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

      const wheelPositions = [
        [0.85, -0.35, 0.85],
        [0.85, -0.35, -0.85],
        [-0.85, -0.35, 0.85],
        [-0.85, -0.35, -0.85],
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const tire = new THREE.Mesh(tireGeo, tireMat);
        tire.rotation.x = Math.PI / 2;
        tire.position.set(x, y, z);
        group.add(tire);

        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, y, z);
        group.add(rim);
      });

      // Front Chrome Grille & Round Headlights
      const grillGeo = new THREE.BoxGeometry(0.08, 0.5, 0.9);
      const grillMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.9, roughness: 0.1 });
      const grill = new THREE.Mesh(grillGeo, grillMat);
      grill.position.set(1.24, 0.2, 0);
      group.add(grill);

      [-0.32, 0.32].forEach((zOffset) => {
        const headlightGeo = new THREE.SphereGeometry(0.14, 16, 16);
        const headlightMat = new THREE.MeshStandardMaterial({
          color: 0xfffae0,
          emissive: 0xffd700,
          emissiveIntensity: 0.6,
        });
        const headlight = new THREE.Mesh(headlightGeo, headlightMat);
        headlight.position.set(1.25, 0.2, zOffset);
        group.add(headlight);
      });

      // Front Bull-Bar Winch
      const bumperGeo = new THREE.BoxGeometry(0.15, 0.18, 1.8);
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.4 });
      const bumper = new THREE.Mesh(bumperGeo, bumperMat);
      bumper.position.set(1.35, -0.15, 0);
      group.add(bumper);

    } else if (type === 'gemstone') {
      // 3. KASHMIR ROYAL BLUE SAPPHIRE & DIAMOND RING
      // Center Kashmir Sapphire (Brilliant Octahedral cushion facet)
      const gemGeo = new THREE.OctahedronGeometry(1.0, 2);
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f3b9c, // Deep Royal Blue
        roughness: 0.04,
        metalness: 0.1,
        transmission: 0.72,
        ior: 1.77,
        thickness: 1.5,
        specularIntensity: 1.0,
        clearcoat: 1.0,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(0, 0.9, 0);
      gem.scale.set(1.1, 0.8, 1.1);
      group.add(gem);

      // Platinum 950 Ring Band
      const bandGeo = new THREE.TorusGeometry(1.1, 0.14, 24, 64);
      const bandMat = new THREE.MeshStandardMaterial({
        color: 0xe5e7eb, // Platinum
        metalness: 0.95,
        roughness: 0.1,
      });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.rotation.x = Math.PI / 2;
      group.add(band);

      // 4 Claws / Prongs holding the center stone
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const prongGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.75, 12);
        const prong = new THREE.Mesh(prongGeo, bandMat);
        prong.position.set(Math.cos(angle) * 0.72, 0.75, Math.sin(angle) * 0.72);
        prong.rotation.z = -Math.cos(angle) * 0.25;
        prong.rotation.x = Math.sin(angle) * 0.25;
        group.add(prong);
      }

      // Side Trapezoid Diamonds
      [-0.85, 0.85].forEach((xPos) => {
        const sideGemGeo = new THREE.ConeGeometry(0.35, 0.5, 6);
        const diamondMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.02,
          transmission: 0.88,
          ior: 2.42,
          thickness: 0.8,
          clearcoat: 1.0,
        });
        const sideGem = new THREE.Mesh(sideGemGeo, diamondMat);
        sideGem.position.set(xPos, 0.7, 0);
        sideGem.rotation.z = xPos > 0 ? -0.4 : 0.4;
        group.add(sideGem);
      });

    } else if (type === 'antique') {
      // 4. MUGHAL CELESTIAL ASTROLABE (Antiques & Art)
      // Main Brass Mater (Body plate)
      const materGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.12, 64);
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xb8860b, // Dark Goldenrod Antique Brass
        metalness: 0.85,
        roughness: 0.32,
      });
      const mater = new THREE.Mesh(materGeo, brassMat);
      mater.rotation.x = Math.PI / 2;
      group.add(mater);

      // Rim with 360-degree graduation ring
      const rimGeo = new THREE.TorusGeometry(1.52, 0.08, 16, 64);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x8a6508,
        metalness: 0.9,
        roughness: 0.25,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      group.add(rim);

      // Openwork pierced "Rete" Star Map with ornate pointers
      const reteRingGeo = new THREE.TorusGeometry(0.9, 0.04, 12, 48);
      const rete = new THREE.Mesh(reteRingGeo, brassMat);
      rete.position.z = 0.08;
      group.add(rete);

      const reteRing2Geo = new THREE.TorusGeometry(0.5, 0.03, 12, 48);
      const rete2 = new THREE.Mesh(reteRing2Geo, brassMat);
      rete2.position.z = 0.08;
      group.add(rete2);

      // Star Pointers radiating outward
      for (let k = 0; k < 12; k++) {
        const rad = (k * Math.PI) / 6;
        const pointerGeo = new THREE.ConeGeometry(0.04, 0.45, 4);
        const pointer = new THREE.Mesh(pointerGeo, brassMat);
        pointer.position.set(Math.cos(rad) * 0.95, Math.sin(rad) * 0.95, 0.09);
        pointer.rotation.z = rad - Math.PI / 2;
        group.add(pointer);
      }

      // Center Pin (Alidade horse axis)
      const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
      const pin = new THREE.Mesh(pinGeo, rimMat);
      pin.rotation.x = Math.PI / 2;
      group.add(pin);

      // Top Throne (Kursi) & Suspension Shackle Ring (Halaqa)
      const kursiGeo = new THREE.ConeGeometry(0.4, 0.45, 4);
      const kursi = new THREE.Mesh(kursiGeo, brassMat);
      kursi.position.set(0, 1.65, 0);
      group.add(kursi);

      const shackleGeo = new THREE.TorusGeometry(0.28, 0.05, 16, 32);
      const shackle = new THREE.Mesh(shackleGeo, brassMat);
      shackle.position.set(0, 2.05, 0);
      group.add(shackle);

    } else {
      // 5. GADGET (Space Black Pro Laptop / Console)
      // Bottom chassis
      const baseGeo = new THREE.BoxGeometry(2.3, 0.1, 1.6);
      const spaceBlackMat = new THREE.MeshStandardMaterial({
        color: 0x18181b, // Space Black
        roughness: 0.35,
        metalness: 0.85,
      });
      const base = new THREE.Mesh(baseGeo, spaceBlackMat);
      base.position.set(0, 0, 0);
      group.add(base);

      // Recessed Keyboard & Trackpad
      const kbGeo = new THREE.BoxGeometry(2.0, 0.02, 0.75);
      const kbMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 });
      const kb = new THREE.Mesh(kbGeo, kbMat);
      kb.position.set(0, 0.06, -0.22);
      group.add(kb);

      const trackpadGeo = new THREE.BoxGeometry(0.8, 0.02, 0.45);
      const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 });
      const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
      trackpad.position.set(0, 0.06, 0.42);
      group.add(trackpad);

      // Angled Display Screen
      const screenGeo = new THREE.BoxGeometry(2.3, 1.45, 0.06);
      const screenHousing = new THREE.Mesh(screenGeo, spaceBlackMat);

      // Position screen hinged at top of base, tilted back ~115 degrees
      screenHousing.position.set(0, 0.75, -0.78);
      screenHousing.rotation.x = 0.28;
      group.add(screenHousing);

      // Retina Glass Screen with neon wallpaper glow
      const glassDisplayGeo = new THREE.BoxGeometry(2.18, 1.35, 0.01);
      const glassDisplayMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x312e81,
        emissiveIntensity: 0.5,
        roughness: 0.1,
      });
      const glassDisplay = new THREE.Mesh(glassDisplayGeo, glassDisplayMat);
      glassDisplay.position.set(0, 0.75, -0.74);
      glassDisplay.rotation.x = 0.28;
      group.add(glassDisplay);
    }

    return group;
  }, []);

  // Update lighting preset
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    const lg = lightsGroupRef.current;
    // Clear existing lights
    while (lg.children.length > 0) {
      lg.remove(lg.children[0]);
    }

    if (lightingPreset === 'vault') {
      // Warm Vault Gold Ambience
      const ambient = new THREE.AmbientLight(0xfff7ed, 0.9);
      lg.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xfef08a, 2.4);
      keyLight.position.set(5, 8, 6);
      lg.add(keyLight);

      const fillLight = new THREE.PointLight(0xd4af37, 2.0, 20);
      fillLight.position.set(-5, 3, -4);
      lg.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
      rimLight.position.set(0, -5, -6);
      lg.add(rimLight);
    } else if (lightingPreset === 'studio') {
      // 5500K Crisp Daylight Studio
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      lg.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
      keyLight.position.set(6, 6, 6);
      lg.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.8);
      fillLight.position.set(-6, 2, 4);
      lg.add(fillLight);
    } else {
      // Dramatic Cyber Neon (Emerald & Amber)
      const ambient = new THREE.AmbientLight(0x0f172a, 0.6);
      lg.add(ambient);

      const neonEmerald = new THREE.PointLight(0x10b981, 3.5, 15);
      neonEmerald.position.set(4, 3, 3);
      lg.add(neonEmerald);

      const neonGold = new THREE.PointLight(0xf59e0b, 3.5, 15);
      neonGold.position.set(-4, -2, -3);
      lg.add(neonGold);
    }
  }, [lightingPreset]);

  // Wireframe toggle
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // Three.js Mount Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, targetZoomRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle reflective grid floor
    const gridHelper = new THREE.GridHelper(10, 20, 0xd4af37, 0x334155);
    const gridMat = gridHelper.material as THREE.LineBasicMaterial;
    gridMat.opacity = 0.22;
    gridMat.transparent = true;
    scene.add(gridHelper);

    // Lights Group
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    // Add Initial Lights (Vault Preset)
    const ambient = new THREE.AmbientLight(0xfff7ed, 1.0);
    lightsGroup.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xfef08a, 2.5);
    keyLight.position.set(5, 8, 6);
    lightsGroup.add(keyLight);
    const fillLight = new THREE.PointLight(0xd4af37, 2.0, 20);
    fillLight.position.set(-5, 3, -4);
    lightsGroup.add(fillLight);

    // Add Procedural Model
    const modelGroup = createProceduralModel(modelType);
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    setIsLoading(false);

    // Render Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (modelGroupRef.current) {
        // Auto turntable rotation if enabled and not currently dragging
        if (autoRotateStateRef.current && !isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.45;
        }

        // Apply inertial damping / smooth slerp
        modelGroupRef.current.rotation.y += (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * 0.12;
        modelGroupRef.current.rotation.x += (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * 0.12;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z += (targetZoomRef.current - cameraRef.current.position.z) * 0.15;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [createProceduralModel, modelType]);

  // Mouse & Touch interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-1.1, Math.min(1.1, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.0025;
    targetZoomRef.current = Math.max(2.2, Math.min(7.5, targetZoomRef.current + zoomDelta));
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-1.1, Math.min(1.1, targetRotationRef.current.x + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const diff = touchDistanceRef.current - currentDist;

      targetZoomRef.current = Math.max(2.2, Math.min(7.5, targetZoomRef.current + diff * 0.01));
      touchDistanceRef.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  };

  const handleReset = () => {
    targetRotationRef.current = { x: 0.25, y: 0.4 };
    targetZoomRef.current = 4.5;
  };

  const zoomIn = () => {
    targetZoomRef.current = Math.max(2.2, targetZoomRef.current - 0.7);
  };

  const zoomOut = () => {
    targetZoomRef.current = Math.min(7.5, targetZoomRef.current + 0.7);
  };

  return (
    <div className="relative w-full h-[460px] md:h-[540px] bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl select-none group">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">Rendering 3D Model...</span>
          </div>
        </div>
      )}

      {/* Top Banner with Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-lg pointer-events-auto">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            360° Studio 3D Inspection
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            WebGL 60FPS
          </span>
        </div>

        {/* Gestures Hint */}
        <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-neutral-400 pointer-events-auto">
          <Move className="w-3 h-3 text-neutral-300" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* Left Control Column: Lighting Presets */}
      <div className="absolute top-16 left-3 flex flex-col gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl z-10">
        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold px-1.5 pt-0.5 text-center">Lighting</span>
        <button
          onClick={() => setLightingPreset('vault')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'vault' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-300 hover:bg-neutral-800'
          }`}
          title="Vault Warm Gold"
        >
          Vault
        </button>
        <button
          onClick={() => setLightingPreset('studio')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'studio' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-300 hover:bg-neutral-800'
          }`}
          title="Studio Crisp 5500K"
        >
          Studio
        </button>
        <button
          onClick={() => setLightingPreset('dramatic')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'dramatic' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-300 hover:bg-neutral-800'
          }`}
          title="Dramatic Neon"
        >
          Neon
        </button>
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/30 shadow-2xl z-20">
        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            autoRotate
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Turntable</span>
        </button>

        <div className="w-[1px] h-5 bg-neutral-800" />

        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-neutral-800" />

        {/* Wireframe Mesh Inspection */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            wireframe
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title="Toggle Wireframe Topography"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mesh</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={handleReset}
          className="p-1.5 rounded-xl text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
          title="Reset Position"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
