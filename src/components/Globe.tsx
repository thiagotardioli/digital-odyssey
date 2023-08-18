import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Globe: React.FC = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initial setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xffffff);

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Load Earth texture
        const earthTexture = new THREE.TextureLoader().load('/assets/earth_texture.jpg');
        const globeGeometry = new THREE.SphereGeometry(1, 50, 50);
        const globeMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // Camera setup
        camera.position.z = 5;

        // Animate function
        const animate = () => {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.001;
            renderer.render(scene, camera);
        };

        // Integrate OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;

        // Set minimum and maximum distance (in world units) to dolly in/out
        // FSetting this to 3 will prevent zooming in closer than 3 units from the target
        controls.minDistance = 3; 
        // Setting this to 15 will prevent zooming out further than 15 units from the target
        controls.maxDistance = 15; 


        animate();

        // Clean up on unmount
        return () => {
            controls.dispose();
            scene.dispose();
            renderer.dispose();
            containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} />;
};

export default Globe;
