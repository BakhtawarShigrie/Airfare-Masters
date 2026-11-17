"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useState } from "react";

const Earth = ({ scale = 1 }: { scale?: number }) => {
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
  const [controlsTarget, setControlsTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGlobeScale(0.65);
      } else {
        setGlobeScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full relative">
      
      {/* 
        INVISIBLE TARGET AREA: 
        Yeh bilkul globe ke size ka ek transparent ghera hai. 
        Mouse/Touch sirf is hissay mein globe ko move karega.
      */}
      <div 
        ref={setControlsTarget}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full z-10 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }} // Is gheray par aakar page ka scroll block hoga aur globe ghoomega
      />

      {/* 
        3D CANVAS:
        pointer-events-none lagane se Canvas ke khali hissay par touches 
        website ke background par chale jayenge jisse page scroll hoga.
      */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={0.8} /> 
          <directionalLight position={[5, 3, 5]} intensity={2.5} /> 
          <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#60a5fa" />
          
          <Suspense fallback={null}>
            <Earth scale={globeScale} />
            <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={1} />
          </Suspense>

          {/* Ab OrbitControls sirf hamare "controlsTarget" div par sune ga */}
          {controlsTarget && (
            <OrbitControls 
              domElement={controlsTarget}
              enableZoom={false} 
              enablePan={false}  
              rotateSpeed={0.6}  
              autoRotate         
              autoRotateSpeed={0.5}
            />
          )}
        </Canvas>
      </div>
    </div>
  );
}