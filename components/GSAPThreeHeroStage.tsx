'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';
import { 
  Sparkles, 
  RotateCw, 
  Sun, 
  Layers, 
  Wand2, 
  ArrowRight, 
  Gavel, 
  Eye, 
  ShieldCheck, 
  Flame, 
  Crown as CrownIcon, 
  Watch, 
  Gem, 
  Compass 
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

export type ArtifactType = 'lamp' | 'crown' | 'watch' | 'gemstone' | 'antique';

interface ArtifactConfig {
  id: ArtifactType;
  name: string;
  subtitle: string;
  tag: string;
  era: string;
  lotId: string;
  estValue: string;
  bidsActive: number;
  badge: string;
  description: string;
  inspiration: string;
}

const ARTIFACTS: Record<ArtifactType, ArtifactConfig> = {
  lamp: {
    id: 'lamp',
    name: 'The Imperial Golden Lamp',
    subtitle: 'Make 3 Wishes • Royal Persian Gilded Brass',
    tag: 'Awwwards 2026 Showcase',
    era: 'c. 1640 Safavid / Mughal Royal Treasury',
    lotId: 'auc-102',
    estValue: '₨ 8,500,000',
    bidsActive: 28,
    badge: 'Most Viral',
    description: 'Hand-chased in 24-karat gilded repousse brass with floral arabesques, spiraling stardust smoke trail, and luminous mystical ember core. Inspired by the viral 2026 GSAP 3D showcase.',
    inspiration: 'Make 3 Wishes Reel'
  },
  crown: {
    id: 'crown',
    name: 'Royal Mughal Imperial Crown',
    subtitle: 'Solid Gold • Burmese Rubies & Panjshir Emeralds',
    tag: 'Crown Jewel Collection',
    era: 'c. 1720 Imperial Lahore Court',
    lotId: 'auc-102',
    estValue: '₨ 18,200,000',
    bidsActive: 34,
    badge: 'Museum Grade',
    description: 'Ornate royal diadem set with untreated Burmese rubies, Colombian-cut emerald cabochons, and diamond fleur-de-lis pinnacles mounted over hand-hammered 22k gold filigree.',
    inspiration: 'Royal Dynastic Collection'
  },
  watch: {
    id: 'watch',
    name: '1968 Rolex Submariner Ref. 5513',
    subtitle: 'Meters First • Collector Provenance',
    tag: 'Certified Horology',
    era: '1968 Switzerland',
    lotId: 'auc-101',
    estValue: '₨ 2,850,000',
    bidsActive: 14,
    badge: 'Trending Lot',
    description: 'Iconic horological grail with pumpkin patina tritium plots, original 9315 folded-link oyster bracelet, bidirectional bezel, and functioning mechanical movement simulation.',
    inspiration: 'Horology Vault'
  },
  gemstone: {
    id: 'gemstone',
    name: 'Royal Kashmir Blue Sapphire Ring',
    subtitle: '14.82 ct Royal Velvet • Platinum 950',
    tag: 'Rare Minerals',
    era: 'Unheated Kashmir Mine',
    lotId: 'auc-104',
    estValue: '₨ 12,400,000',
    bidsActive: 19,
    badge: 'SSEF Certified',
    description: 'Internally flawless cornflower-to-velvet blue sapphire flanked by trapezoid white diamonds in a handcrafted platinum micro-prong mounting with high-dispersion optical refraction.',
    inspiration: 'High Jewelry Exhibition'
  },
  antique: {
    id: 'antique',
    name: 'Mughal Celestial Astrolabe',
    subtitle: 'Gilded Brass • Engraved Star Pointers',
    tag: 'Imperial Science',
    era: 'c. 1665 Royal Observatory Lahore',
    lotId: 'auc-102',
    estValue: '₨ 4,200,000',
    bidsActive: 22,
    badge: 'National Heritage',
    description: 'Magnificent openwork brass rete with 28 astrological star pointers, multi-latitude climatic tympans, and inscribed Persian astronomical tables for celestial navigation.',
    inspiration: 'Astronomical Vault'
  }
};

export default function GSAPThreeHeroStage({
  initialArtifact = 'lamp',
  compact = false
}: {
  initialArtifact?: ArtifactType;
  compact?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType>(initialArtifact);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState<'gold' | 'studio' | 'vault'>('gold');
  const [isBursting, setIsBursting] = useState(false);
  const [wishCount, setWishCount] = useState(3);
  const [wishMessage, setWishMessage] = useState<string | null>(null);

  const { playSoundGavel, soundEnabled } = useAuction();

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Interaction tracking with GSAP
  const targetRotationRef = useRef({ x: 0.15, y: 0.35 });
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const autoRotateStateRef = useRef(autoRotate);
  autoRotateStateRef.current = autoRotate;

  // 1. Procedural 3D Model Builders
  const buildArtifactModel = useCallback((type: ArtifactType): THREE.Group => {
    const group = new THREE.Group();

    if (type === 'lamp') {
      // 🌟 MAKE 3 WISHES IMPERIAL GOLDEN MAGIC LAMP
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xe6b438,
        metalness: 0.94,
        roughness: 0.22,
      });
      const darkGoldMat = new THREE.MeshStandardMaterial({
        color: 0x9e7317,
        metalness: 0.9,
        roughness: 0.35,
      });

      // Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(0.75, 0.9, 0.25, 36);
      const base = new THREE.Mesh(baseGeo, goldMat);
      base.position.y = -0.95;
      group.add(base);

      const baseRingGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 40);
      const baseRing = new THREE.Mesh(baseRingGeo, darkGoldMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -0.95;
      group.add(baseRing);

      // Bulbous Lamp Belly
      const bellyGeo = new THREE.SphereGeometry(1.05, 36, 36);
      const belly = new THREE.Mesh(bellyGeo, goldMat);
      belly.scale.set(1.15, 0.68, 0.95);
      belly.position.set(-0.15, -0.4, 0);
      group.add(belly);

      // Arabesque waist belt
      const waistGeo = new THREE.TorusGeometry(1.1, 0.06, 16, 48);
      const waist = new THREE.Mesh(waistGeo, darkGoldMat);
      waist.rotation.x = Math.PI / 2;
      waist.position.set(-0.15, -0.4, 0);
      group.add(waist);

      // Long Graceful Sweeping Spout
      const spoutCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, -0.35, 0),
        new THREE.Vector3(1.2, -0.1, 0),
        new THREE.Vector3(1.8, 0.35, 0),
        new THREE.Vector3(2.1, 0.75, 0),
      ]);
      const spoutGeo = new THREE.TubeGeometry(spoutCurve, 32, 0.22, 16, false);
      const spout = new THREE.Mesh(spoutGeo, goldMat);
      group.add(spout);

      // Spout Nozzle Ring & Flame Opening
      const nozzleGeo = new THREE.TorusGeometry(0.18, 0.06, 16, 24);
      const nozzle = new THREE.Mesh(nozzleGeo, darkGoldMat);
      nozzle.position.set(2.1, 0.75, 0);
      nozzle.rotation.y = Math.PI / 2;
      group.add(nozzle);

      // Spout mystical ember glow
      const emberGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const emberMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(2.12, 0.76, 0);
      group.add(ember);

      // Ornate Filigree C-Curve Handle
      const handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.95, -0.4, 0),
        new THREE.Vector3(-1.7, -0.15, 0),
        new THREE.Vector3(-1.8, 0.55, 0),
        new THREE.Vector3(-1.3, 0.75, 0),
        new THREE.Vector3(-0.6, 0.35, 0),
      ]);
      const handleGeo = new THREE.TubeGeometry(handleCurve, 40, 0.11, 16, false);
      const handle = new THREE.Mesh(handleGeo, goldMat);
      group.add(handle);

      // Lamp Neck & Domed Lid
      const neckGeo = new THREE.CylinderGeometry(0.48, 0.65, 0.35, 24);
      const neck = new THREE.Mesh(neckGeo, darkGoldMat);
      neck.position.set(-0.15, 0.1, 0);
      group.add(neck);

      const lidGeo = new THREE.ConeGeometry(0.55, 0.45, 24);
      const lid = new THREE.Mesh(lidGeo, goldMat);
      lid.position.set(-0.15, 0.45, 0);
      group.add(lid);

      // Teardrop Finial on Lid
      const finialGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const finialMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.1, metalness: 0.2 });
      const finial = new THREE.Mesh(finialGeo, finialMat);
      finial.position.set(-0.15, 0.75, 0);
      finial.scale.set(0.8, 1.4, 0.8);
      group.add(finial);

      // Mystical Wish Flame Sparkles
      for (let i = 0; i < 3; i++) {
        const wishSparkGeo = new THREE.SphereGeometry(0.04 + i * 0.02, 12, 12);
        const wishSparkMat = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          emissive: 0xff9900,
          emissiveIntensity: 0.8,
        });
        const spark = new THREE.Mesh(wishSparkGeo, wishSparkMat);
        spark.position.set(2.2 + i * 0.15, 0.85 + i * 0.2, (i - 1) * 0.1);
        group.add(spark);
      }

    } else if (type === 'crown') {
      // 👑 ROYAL MUGHAL IMPERIAL CROWN
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
      const rubyMat = new THREE.MeshPhysicalMaterial({ color: 0xb91c1c, roughness: 0.05, transmission: 0.6, thickness: 0.8 });
      const emeraldMat = new THREE.MeshPhysicalMaterial({ color: 0x047857, roughness: 0.05, transmission: 0.6, thickness: 0.8 });
      const pearlMat = new THREE.MeshStandardMaterial({ color: 0xfaf5ee, roughness: 0.4, metalness: 0.1 });

      const bandGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.4, 48, 1, true);
      const band = new THREE.Mesh(bandGeo, goldMat);
      band.position.y = -0.6;
      group.add(band);

      for (let i = 0; i < 32; i++) {
        const angle = (i * Math.PI * 2) / 32;
        [-0.42, -0.78].forEach((yPos) => {
          const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), pearlMat);
          pearl.position.set(Math.cos(angle) * 1.24, yPos, Math.sin(angle) * 1.24);
          group.add(pearl);
        });
      }

      for (let k = 0; k < 8; k++) {
        const angle = (k * Math.PI * 2) / 8;
        const peakGeo = new THREE.ConeGeometry(0.25, 0.85, 4);
        const peak = new THREE.Mesh(peakGeo, goldMat);
        peak.position.set(Math.cos(angle) * 1.2, 0.05, Math.sin(angle) * 1.2);
        peak.rotation.y = angle;
        group.add(peak);

        const gemMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 1), k % 2 === 0 ? rubyMat : emeraldMat);
        gemMesh.position.set(Math.cos(angle) * 1.25, -0.1, Math.sin(angle) * 1.25);
        group.add(gemMesh);
      }

      for (let a = 0; a < 2; a++) {
        const archGeo = new THREE.TorusGeometry(1.15, 0.06, 16, 48, Math.PI);
        const arch = new THREE.Mesh(archGeo, goldMat);
        arch.position.y = -0.3;
        arch.rotation.y = (a * Math.PI) / 2;
        group.add(arch);
      }

      const orbGeo = new THREE.SphereGeometry(0.22, 24, 24);
      const orb = new THREE.Mesh(orbGeo, goldMat);
      orb.position.y = 0.95;
      group.add(orb);

      const topRubyGeo = new THREE.OctahedronGeometry(0.2, 2);
      const topRuby = new THREE.Mesh(topRubyGeo, rubyMat);
      topRuby.position.y = 1.25;
      topRuby.scale.set(0.8, 1.4, 0.8);
      group.add(topRuby);

      const velvetGeo = new THREE.SphereGeometry(1.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const velvetMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.95 });
      const velvet = new THREE.Mesh(velvetGeo, velvetMat);
      velvet.position.y = -0.55;
      group.add(velvet);

    } else if (type === 'watch') {
      // ⌚ 1968 VINTAGE ROLEX SUBMARINER
      const caseMat = new THREE.MeshStandardMaterial({ color: 0xdfb76c, metalness: 0.92, roughness: 0.18 });
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 });
      const dialMat = new THREE.MeshStandardMaterial({ color: 0x0a0d14, roughness: 0.5, metalness: 0.2 });
      const goldHandMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });

      const watchCase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.35, 48), caseMat);
      watchCase.rotation.x = Math.PI / 2;
      group.add(watchCase);

      const bezel = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.08, 16, 64), bezelMat);
      group.add(bezel);

      const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.28, 0.05, 48), dialMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.z = 0.16;
      group.add(dial);

      for (let i = 0; i < 12; i++) {
        const rad = (i * Math.PI) / 6;
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xffd700 : 0xf0f0f0, emissive: 0x222211 })
        );
        marker.position.set(Math.cos(rad) * 1.05, Math.sin(rad) * 1.05, 0.19);
        group.add(marker);
      }

      const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.02), goldHandMat);
      hourHand.position.set(0.18, 0.25, 0.2);
      hourHand.rotation.z = -Math.PI / 4;
      group.add(hourHand);

      const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.02), goldHandMat);
      minHand.position.set(-0.25, 0.35, 0.22);
      minHand.rotation.z = Math.PI / 3;
      group.add(minHand);

      const secHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      secHand.position.set(0, 0, 0.24);
      group.add(secHand);

      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.36, 1.36, 0.04, 48),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, transmission: 0.85 })
      );
      glass.rotation.x = Math.PI / 2;
      glass.position.z = 0.26;
      group.add(glass);

      [-1, 1].forEach((dir) => {
        for (let j = 1; j <= 5; j++) {
          const link = new THREE.Mesh(
            new THREE.BoxGeometry(1.1 - j * 0.08, 0.35, 0.18),
            new THREE.MeshStandardMaterial({ color: j % 2 === 0 ? 0xdfb76c : 0xc0c0c0, metalness: 0.95 })
          );
          link.position.set(0, dir * (1.4 + j * 0.34), -Math.pow(j * 0.24, 1.8));
          link.rotation.x = -dir * 0.22 * j;
          group.add(link);
        }
      });

    } else if (type === 'gemstone') {
      // 💎 KASHMIR ROYAL BLUE SAPPHIRE RING
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.1, 2),
        new THREE.MeshPhysicalMaterial({
          color: 0x0f3b9c,
          roughness: 0.03,
          metalness: 0.1,
          transmission: 0.75,
          ior: 1.77,
          thickness: 1.6,
          clearcoat: 1.0,
        })
      );
      gem.position.set(0, 0.85, 0);
      gem.scale.set(1.1, 0.85, 1.1);
      group.add(gem);

      const bandMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.1 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.14, 24, 64), bandMat);
      band.rotation.x = Math.PI / 2;
      group.add(band);

      for (let i = 0; i < 4; i++) {
        const rad = (i * Math.PI) / 2 + Math.PI / 4;
        const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.8, 12), bandMat);
        prong.position.set(Math.cos(rad) * 0.75, 0.75, Math.sin(rad) * 0.75);
        prong.rotation.z = -Math.cos(rad) * 0.25;
        prong.rotation.x = Math.sin(rad) * 0.25;
        group.add(prong);
      }

      [-0.9, 0.9].forEach((xPos) => {
        const sideDia = new THREE.Mesh(
          new THREE.ConeGeometry(0.35, 0.5, 6),
          new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transmission: 0.9, ior: 2.42 })
        );
        sideDia.position.set(xPos, 0.7, 0);
        sideDia.rotation.z = xPos > 0 ? -0.4 : 0.4;
        group.add(sideDia);
      });

    } else {
      // 🧭 MUGHAL CELESTIAL ASTROLABE
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.88, roughness: 0.3 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x785608, metalness: 0.9, roughness: 0.25 });

      const mater = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.12, 64), brassMat);
      mater.rotation.x = Math.PI / 2;
      group.add(mater);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.08, 16, 64), darkMat);
      group.add(rim);

      const rete = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 12, 48), brassMat);
      rete.position.z = 0.08;
      group.add(rete);

      for (let k = 0; k < 12; k++) {
        const rad = (k * Math.PI) / 6;
        const ptr = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.45, 4), brassMat);
        ptr.position.set(Math.cos(rad) * 0.95, Math.sin(rad) * 0.95, 0.09);
        ptr.rotation.z = rad - Math.PI / 2;
        group.add(ptr);
      }

      const kursi = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.45, 4), brassMat);
      kursi.position.set(0, 1.65, 0);
      group.add(kursi);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 16, 32), brassMat);
      ring.position.set(0, 2.05, 0);
      group.add(ring);
    }

    return group;
  }, []);

  // 2. Three.js Scene Setup & GSAP Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.0);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const spotLight = new THREE.SpotLight(0xffd700, 3.5, 15, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 3, 4);
    scene.add(spotLight);
    spotlightRef.current = spotLight;

    const coreLight = new THREE.PointLight(0xffaa22, 2.0, 4);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    coreLightRef.current = coreLight;

    // 3. Stardust 3D Particle Cloud
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 4. Initial Artifact Model
    const artifactModel = buildArtifactModel(selectedArtifact);
    scene.add(artifactModel);
    modelGroupRef.current = artifactModel;

    // GSAP Floating Levitation
    gsap.to(artifactModel.position, {
      y: '+=0.18',
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // GSAP Initial Scale Pop
    gsap.from(artifactModel.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 1.0,
      ease: 'back.out(1.7)',
    });

    // 5. Render Loop with Inertia & Orbit
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (particles) {
        particles.rotation.y += delta * 0.08;
        particles.rotation.x += delta * 0.03;
      }

      if (modelGroupRef.current) {
        if (autoRotateStateRef.current && !isMouseDownRef.current) {
          targetRotationRef.current.y += delta * 0.65;
        }

        modelGroupRef.current.rotation.y += (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * 0.08;
        modelGroupRef.current.rotation.x += (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [buildArtifactModel]);

  // Handle Model Switch with Smooth GSAP Transition
  useEffect(() => {
    if (!sceneRef.current || !modelGroupRef.current) return;

    const oldModel = modelGroupRef.current;
    
    gsap.to(oldModel.scale, {
      x: 0.05,
      y: 0.05,
      z: 0.05,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        sceneRef.current?.remove(oldModel);

        const newModel = buildArtifactModel(selectedArtifact);
        newModel.scale.set(0.05, 0.05, 0.05);
        sceneRef.current?.add(newModel);
        modelGroupRef.current = newModel;

        if (wireframe) {
          newModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => {
                  (m as any).wireframe = true;
                });
              } else if (mesh.material) {
                (mesh.material as any).wireframe = true;
              }
            }
          });
        }

        gsap.to(newModel.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'back.out(1.8)',
        });

        gsap.to(newModel.position, {
          y: '+=0.18',
          duration: 3.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      },
    });
  }, [selectedArtifact, buildArtifactModel, wireframe]);

  // Handle Lighting Mode Change
  useEffect(() => {
    if (!spotlightRef.current || !keyLightRef.current) return;

    if (lightingMode === 'gold') {
      spotlightRef.current.color.setHex(0xffd700);
      keyLightRef.current.color.setHex(0xffedd5);
      keyLightRef.current.intensity = 2.4;
    } else if (lightingMode === 'studio') {
      spotlightRef.current.color.setHex(0xffffff);
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.0;
    } else {
      spotlightRef.current.color.setHex(0x10b981);
      keyLightRef.current.color.setHex(0x38bdf8);
      keyLightRef.current.intensity = 2.0;
    }
  }, [lightingMode]);

  const toggleWireframe = () => {
    const next = !wireframe;
    setWireframe(next);
    if (modelGroupRef.current) {
      modelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              (m as any).wireframe = next;
            });
          } else if (mesh.material) {
            (mesh.material as any).wireframe = next;
          }
        }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (!isMouseDownRef.current) {
      targetRotationRef.current.x = normY * 0.45;
      targetRotationRef.current.y += normX * 0.015;
    }

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current.position, {
        x: normX * 3.5,
        y: normY * 3.5 + 2,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    targetRotationRef.current.y += deltaX * 0.012;
    targetRotationRef.current.x += deltaY * 0.012;
  };

  const triggerWishBurst = () => {
    if (isBursting) return;
    setIsBursting(true);

    if (soundEnabled) {
      playSoundGavel();
    }

    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      gsap.fromTo(
        mat,
        { size: 0.065, opacity: 0.75 },
        {
          size: 0.22,
          opacity: 1,
          duration: 0.45,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        }
      );
      gsap.to(particlesRef.current.rotation, {
        y: '+=3.14',
        duration: 1.5,
        ease: 'power2.out',
      });
    }

    if (coreLightRef.current) {
      gsap.fromTo(
        coreLightRef.current,
        { intensity: 2 },
        { intensity: 9, duration: 0.35, yoyo: true, repeat: 1 }
      );
    }

    if (modelGroupRef.current) {
      gsap.fromTo(
        modelGroupRef.current.scale,
        { x: 1, y: 1, z: 1 },
        {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: 'back.out(2)',
        }
      );
    }

    const nextWish = wishCount > 1 ? wishCount - 1 : 3;
    setWishCount(nextWish);

    const wishes = [
      '✨ Wish Granted: Highest Bid Priority Unlocked!',
      '🌟 Wish Granted: 100% Escrow Guarantee Activated!',
      '✨ Wish Granted: VIP Collector Provenance Verified!',
    ];
    setWishMessage(wishes[3 - wishCount]);

    setTimeout(() => {
      setIsBursting(false);
      setTimeout(() => setWishMessage(null), 3000);
    }, 1200);
  };

  const artifact = ARTIFACTS[selectedArtifact];

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden group">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-amber-900 uppercase bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            GSAP + Three.js 2026 Engine
          </span>
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            Interactive 3D Luxury Stage
          </span>
        </div>

        {/* Model Picker Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(Object.keys(ARTIFACTS) as ArtifactType[]).map((typeKey) => {
            const isSelected = selectedArtifact === typeKey;
            return (
              <button
                key={typeKey}
                onClick={() => setSelectedArtifact(typeKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {typeKey === 'lamp' && <Wand2 className="w-3.5 h-3.5 text-amber-400" />}
                {typeKey === 'crown' && <CrownIcon className="w-3.5 h-3.5 text-amber-400" />}
                {typeKey === 'watch' && <Watch className="w-3.5 h-3.5 text-amber-400" />}
                {typeKey === 'gemstone' && <Gem className="w-3.5 h-3.5 text-amber-400" />}
                {typeKey === 'antique' && <Compass className="w-3.5 h-3.5 text-amber-400" />}
                <span>{ARTIFACTS[typeKey].name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div
        className="relative w-full h-[440px] sm:h-[480px] bg-gradient-to-b from-slate-50/50 via-white to-amber-50/20 cursor-grab active:cursor-grabbing select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div ref={mountRef} className="w-full h-full" onMouseMove={handleDrag} />

        {wishMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>{wishMessage}</span>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold shadow-sm flex items-center gap-1.5 w-fit">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>{artifact.badge}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-200 w-fit">
            {artifact.era}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 z-20 text-[11px] text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Move mouse to shift dynamic spotlight • Drag to orbit 360°</span>
        </div>

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={triggerWishBurst}
            disabled={isBursting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95"
            title="Trigger GSAP Stardust Particle Burst"
          >
            <Wand2 className="w-4 h-4 text-slate-950" />
            <span>{selectedArtifact === 'lamp' ? `Make Wish (${wishCount})` : 'Magic Burst'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center backdrop-blur-md shadow-sm ${
              autoRotate
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white/90 text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
            title={autoRotate ? 'Pause 360° Orbit' : 'Resume 360° Orbit'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow text-amber-600' : ''}`} />
          </button>

          <button
            onClick={toggleWireframe}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center backdrop-blur-md shadow-sm ${
              wireframe
                ? 'bg-amber-500 text-slate-950 border-amber-600'
                : 'bg-white/90 text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
            title="Toggle Hologram Wireframe"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const modes: Array<'gold' | 'studio' | 'vault'> = ['gold', 'studio', 'vault'];
              const next = modes[(modes.indexOf(lightingMode) + 1) % modes.length];
              setLightingMode(next);
            }}
            className="p-2.5 rounded-xl bg-white/90 border border-slate-200 text-slate-700 hover:text-amber-700 transition-all flex items-center justify-center backdrop-blur-md shadow-sm"
            title={`Lighting: ${lightingMode.toUpperCase()} (Click to Cycle)`}
          >
            <Sun className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>

      {/* Artifact Details & Direct Live Auction Link */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800">
              {artifact.tag}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">{artifact.subtitle}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
            {artifact.name}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {artifact.description}
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-2 md:pt-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block">
              Estimated Hammer
            </span>
            <span className="text-2xl font-black text-amber-700 font-mono">
              {artifact.estValue}
            </span>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 md:justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{artifact.bidsActive} Active Bids In Escrow</span>
            </div>
          </div>

          <Link
            href={`/auction/${artifact.lotId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <Gavel className="w-4 h-4" />
            <span>Enter Live Bidding Room</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
