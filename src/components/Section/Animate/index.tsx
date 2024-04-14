import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function AnimateSection() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene, Camera, and Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // allow transparency
    renderer.setClearColor(0xffffff, 1); // background color white
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    scene.add(light);

    let model: THREE.Object3D;

    // GLTF Model loading
    const loader = new GLTFLoader();
    loader.load(
      process.env.PUBLIC_URL + 'images/animate/shiba/scene.gltf',
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.01; // rotate the model
      }
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};
