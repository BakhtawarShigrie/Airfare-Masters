"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

const Earth = () => {
  // Updated JSDelivr CDN links for Three.js official textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg", 
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg",
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg",
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png"  
  ]);

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap} 
          specularMap={specularMap}
          specular={new THREE.Color("grey")}
          shininess={35} // Thori aur chamak add ki hai
        />
      </mesh>
      
      {/* Cloud Layer */}
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.6} // Badalon ko thoda aur wazeh kiya hai
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default function Globe() {
  return (
    <div className="w-full h-screen cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        
        {/* LIGHTING UPDATES - Globe ko bright karne ke liye */}
        <ambientLight intensity={0.8} /> {/* Pehle 0.2 thi, ab 0.8 kar di taake andhera kam ho */}
        <directionalLight position={[5, 3, 5]} intensity={2.5} /> {/* Main Suraj ki roshni */}
        
        {/* Backlight - Globe ki back side (andhere wale hissay) par halki si blue light */}
        <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#60a5fa" />
        
        <Suspense fallback={null}>
          <Earth />
          {/* Background Stars */}
          <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={1} />
        </Suspense>

        {/* OrbitControls mouse se rotate karne ke liye */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}  
          rotateSpeed={0.6}  
          autoRotate         
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}