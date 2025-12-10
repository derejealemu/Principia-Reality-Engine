import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { VisualizationData, ViewSettings } from '../types';

interface VisualizationCanvasProps {
  data: VisualizationData | null;
  params: Record<string, number | boolean>;
  viewSettings: ViewSettings;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({ data, params, viewSettings }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  // We need a ref for params so the animation loop accesses the latest values without closure staleness
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Update camera distance based on zoom setting
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;

    // Calculate current direction vector from target to camera
    const direction = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();

    // Scale direction by new zoom distance
    const newPos = new THREE.Vector3()
      .copy(controls.target)
      .add(direction.multiplyScalar(viewSettings.zoom));

    camera.position.copy(newPos);

  }, [viewSettings.zoom]);

  // Update Auto Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = viewSettings.autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [viewSettings.autoRotate]);

  // Update Bloom Strength
  useEffect(() => {
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = viewSettings.bloomStrength;
    }
  }, [viewSettings.bloomStrength]);

  // Initialize Three.js context once
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050510');
    scene.fog = new THREE.FogExp2('#050510', 0.02);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    // Initial pos
    camera.position.z = viewSettings.zoom;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = viewSettings.autoRotate;

    // Post Processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      viewSettings.bloomStrength,  // strength
      0.4,  // radius
      0.85  // threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Default Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    composerRef.current = composer;
    controlsRef.current = controls;
    bloomPassRef.current = bloomPass;

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Run Generated Code or Idle Animation
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const controls = controlsRef.current;

    // 1. Cleanup - Remove old objects
    const cleanMaterial = (material: any) => {
      material.dispose();
      // Dispose textures if present
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    };

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(cleanMaterial);
          } else {
            cleanMaterial(obj.material);
          }
        }
      }
    });

    // Remove everything except lights (optional, but usually we want to clear lights too if the new scene sets them up, 
    // but here we have default lights we might want to keep. 
    // Actually, the previous code kept lights. Let's stick to that logic or improve it.
    // The previous code removed everything *except* lights.
    // Let's remove children that are not the default lights we added.
    // Since we don't have references to the default lights easily available in this scope (they were added in init),
    // we can just clear the scene and re-add default lights, OR filter.
    // Better approach: The generated code might add its own lights. 
    // Let's clear EVERYTHING that isn't the camera/helper.

    // Actually, looking at the init code:
    // const ambientLight = new THREE.AmbientLight(0x404040, 2);
    // const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // These are added to the scene.

    // If we want to keep them, we need to identify them. 
    // But the generated code might want a dark scene. 
    // Ideally, we should probably clear everything. 
    // However, to be safe and consistent with previous behavior (which kept lights), 
    // let's try to remove everything that is NOT a light, or just remove everything and re-add default lights if needed.
    // But wait, the previous code: `if (!(obj instanceof THREE.Light))`

    // Let's stick to the previous logic of keeping lights for now to avoid breaking scenes that rely on them,
    // but use the traverse for disposal.

    // Note: traverse visits children. We need to remove them from the parent.
    // Iterating backwards is good for removal.

    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];
      if (!(obj instanceof THREE.Light)) {
        scene.remove(obj);
      }
    }
    // Reset camera to current zoom setting
    controls.reset();
    camera.position.set(0, 0, viewSettings.zoom);
    camera.rotation.set(0, 0, 0);

    let animationFn: Function | null = null;

    // 2. Determine Mode (Idle vs Generated)
    if (!data) {
      // --- IDLE MODE: Procedural Background ---
      // Choose a random archetype
      const archetype = Math.floor(Math.random() * 3); // 0: Quantum Cloud, 1: Spiral, 2: Hyper-Torus

      const particleCount = 3000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const color1 = new THREE.Color(0x00f3ff); // Neon Blue
      const color2 = new THREE.Color(0xbc13fe); // Neon Purple

      for (let i = 0; i < particleCount; i++) {
        let x = 0, y = 0, z = 0;

        if (archetype === 0) { // Quantum Cloud (Sphere with noise)
          const r = 5 * Math.cbrt(Math.random());
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else if (archetype === 1) { // Galactic Spiral
          const r = Math.random() * 8;
          const theta = r * 2 + (Math.random() - 0.5) + (i % 2 === 0 ? 0 : Math.PI); // 2 arms
          const yOffset = (Math.random() - 0.5) * (10 - r) * 0.5;
          x = r * Math.cos(theta);
          y = yOffset;
          z = r * Math.sin(theta);
        } else if (archetype === 2) { // Hyper-Torus
          const u = Math.random() * Math.PI * 2;
          const v = Math.random() * Math.PI * 2;
          const R = 5;
          const r = 1.5;
          x = (R + r * Math.cos(v)) * Math.cos(u);
          y = (R + r * Math.cos(v)) * Math.sin(u);
          z = r * Math.sin(v) + (Math.random() - 0.5) * 0.5;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Mix colors based on position
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 0.15;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      points.name = "idle_viz";
      scene.add(points);

      // Idle Animation Function
      // Renamed unused params to _camera, _renderer, _THREE to satisfy strict TypeScript rules
      animationFn = (scene: THREE.Scene, _camera: THREE.Camera, _renderer: THREE.WebGLRenderer, _THREE: any, time: number) => {
        const p = scene.getObjectByName("idle_viz");
        if (p) {
          // Rotate
          p.rotation.y = time * 0.05;
          p.rotation.z = time * 0.02;
        }
      };

      // Reset Camera for idle
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

    } else {
      // --- GENERATED MODE: Execute Gemini Code ---
      try {
        const setupFunction = new Function(
          'scene',
          'camera',
          'renderer',
          'THREE',
          data.setupCode
        );

        setupFunction(scene, camera, renderer, THREE);

        if (data.animationCode) {
          animationFn = new Function(
            'scene',
            'camera',
            'renderer',
            'THREE',
            'time',
            'params',
            data.animationCode
          );
        }

      } catch (err) {
        console.error("Error executing generated visualization code:", err);
      }

      // Ensure auto-rotate matches view settings in Generated mode
      controls.autoRotate = viewSettings.autoRotate;
      controls.autoRotateSpeed = 2.0;
    }

    // 3. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (animationFn) {
        try {
          // Pass paramsRef.current so it's always fresh
          animationFn(scene, camera, renderer, THREE, time, paramsRef.current);
        } catch (e) {
          console.error("Animation loop error", e);
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          return;
        }
      }

      // Use composer for bloom effect instead of raw renderer
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-full cursor-move" title="Click and drag to rotate" />;
};