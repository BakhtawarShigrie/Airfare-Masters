"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useState } from "react";

const Earth = ({ scale = 1 }: { scale?: number }) => {
  // Updated JSDelivr CDN links for Three.js official textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg", 
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_normal_2048.jpg",
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg",
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png"  
  ]);

  return (
    <group scale={scale}>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap} 
          specularMap={specularMap}
          specular={new THREE.Color("grey")}
          shininess={35}
        />
      </mesh>
      
      {/* Cloud Layer */}
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default function Globe() {
  const [globeScale, setGlobeScale] = useState(1);

  useEffect(() => {
    // Window resize par globe ka size adjust karein
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGlobeScale(0.65); // Mobile ke liye chota globe
      } else {
        setGlobeScale(1); // Desktop ke liye normal size
      }
    };

    // Component load hote hi aik baar run karein
    handleResize();

    // Jab bhi screen resize ho, size update karein
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        
        {/* Lighting */}
        <ambientLight intensity={0.8} /> 
        <directionalLight position={[5, 3, 5]} intensity={2.5} /> 
        <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#60a5fa" />
        
        <Suspense fallback={null}>
          <Earth scale={globeScale} />
          {/* Background Stars */}
          <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={1} />
        </Suspense>

        {/* OrbitControls */}
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