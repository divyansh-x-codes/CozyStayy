import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, useTexture } from "@react-three/drei";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Compass } from "lucide-react";
import * as THREE from "three";

function Panorama({ files }: { files: string }) {
  const texture = useTexture(files);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Room({ imageUrl }: { imageUrl?: string }) {
  // Procedural cozy room — no external GLB needed, fully functional 3D
  const wall = "#e9e2d5";
  const floor = "#8b6f4e";
  const wood = "#5b3a22";
  const accent = "#0f172a";
  const amber = "#f59e0b";

  // Load the hotel image texture if provided
  const texture = imageUrl ? useTexture(imageUrl) : null;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {/* Side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 2.5, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[5, 2.5, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8f5ee" />
      </mesh>
      {/* Bed base */}
      <mesh position={[0, 0.4, -3]} castShadow>
        <boxGeometry args={[3.6, 0.7, 2.2]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.95, -3]} castShadow>
        <boxGeometry args={[3.4, 0.4, 2]} />
        <meshStandardMaterial color="#f5efe6" />
      </mesh>
      {/* Pillows */}
      <mesh position={[-0.8, 1.25, -3.4]} castShadow>
        <boxGeometry args={[1.1, 0.25, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.8, 1.25, -3.4]} castShadow>
        <boxGeometry args={[1.1, 0.25, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 1.6, -4.05]} castShadow>
        <boxGeometry args={[3.8, 1.6, 0.15]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {/* Throw blanket */}
      <mesh position={[0, 1.16, -2.4]} castShadow>
        <boxGeometry args={[3.4, 0.06, 0.8]} />
        <meshStandardMaterial color={amber} />
      </mesh>
      {/* Nightstands */}
      <mesh position={[-2.4, 0.5, -3]} castShadow>
        <boxGeometry args={[0.9, 1, 0.9]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      <mesh position={[2.4, 0.5, -3]} castShadow>
        <boxGeometry args={[0.9, 1, 0.9]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      {/* Lamps */}
      <mesh position={[-2.4, 1.35, -3]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.5, 16]} />
        <meshStandardMaterial color={amber} emissive={amber} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[2.4, 1.35, -3]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.5, 16]} />
        <meshStandardMaterial color={amber} emissive={amber} emissiveIntensity={0.6} />
      </mesh>
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <planeGeometry args={[4, 2.6]} />
        <meshStandardMaterial color="#c5a888" />
      </mesh>
      {/* Sofa */}
      <mesh position={[3.6, 0.5, 1]} castShadow>
        <boxGeometry args={[1.2, 1, 2.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Coffee table */}
      <mesh position={[2, 0.3, 1]} castShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      {/* Window frame */}
      <mesh position={[-4.95, 2.7, -1]}>
        <boxGeometry args={[0.05, 2, 2.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Window light */}
      <mesh position={[-4.9, 2.7, -1]}>
        <boxGeometry args={[0.02, 1.8, 2.4]} />
        <meshStandardMaterial color="#cfe6ff" emissive="#cfe6ff" emissiveIntensity={0.5} />
      </mesh>
      {/* Plant */}
      <mesh position={[-3.8, 0.6, 3]} castShadow>
        <cylinderGeometry args={[0.35, 0.3, 1, 16]} />
        <meshStandardMaterial color="#5b3a22" />
      </mesh>
      <mesh position={[-3.8, 1.5, 3]} castShadow>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#3f6b3a" />
      </mesh>
      {/* Wall art - Now displaying the hotel image */}
      <mesh position={[0, 3.4, -4.93]}>
        <planeGeometry args={[2, 1.2]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={amber} />
        )}
      </mesh>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-xs text-primary font-medium animate-pulse">Loading 3D experience…</div>
    </Html>
  );
}

function Scene({ imageUrl, isPanorama = false }: { imageUrl?: string; isPanorama?: boolean }) {
  return (
    <>
      {!isPanorama && (
        <>
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />
          <pointLight position={[-2.4, 1.5, -3]} intensity={0.6} color="#f59e0b" />
          <pointLight position={[2.4, 1.5, -3]} intensity={0.6} color="#f59e0b" />
        </>
      )}
      <Suspense fallback={<Loader />}>
        {isPanorama && imageUrl ? (
          <Panorama files={imageUrl} />
        ) : (
          <Room imageUrl={imageUrl} />
        )}
        {!isPanorama && <Environment preset="apartment" />}
        {!isPanorama && <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={12} blur={2.4} />}
      </Suspense>
      <OrbitControls
        enablePan={!isPanorama}
        enableZoom
        enableRotate
        minDistance={isPanorama ? 0.1 : 3}
        maxDistance={isPanorama ? 10 : 12}
        maxPolarAngle={isPanorama ? Math.PI : Math.PI / 2.05}
        target={isPanorama ? [0, 0, 0.1] : [0, 1.2, -1]}
        enableDamping
        autoRotate={isPanorama}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Room3DViewer({ 
  imageUrl, 
  sketchfabId,
  hideButton = false, 
  heroMode = false, 
  simple = false 
}: { 
  imageUrl?: string; 
  sketchfabId?: string;
  hideButton?: boolean; 
  heroMode?: boolean; 
  simple?: boolean 
}) {
  const [open, setOpen] = useState(false);

  // If sketchfabId is provided, we use the iframe embed
  if (sketchfabId) {
    return (
      <div className={`relative ${heroMode ? "h-full w-full" : ""} ${simple ? "h-full" : ""}`}>
        <div className={`overflow-hidden bg-black relative ${heroMode ? "h-full w-full" : simple ? "h-full w-full" : "rounded-[var(--radius)] border border-border h-64"}`}>
          <iframe 
            title="3D Room View"
            className="w-full h-full border-0"
            allowFullScreen
            // @ts-ignore
            mozallowfullscreen="true"
            // @ts-ignore
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            // @ts-ignore
            execution-while-out-of-viewport
            // @ts-ignore
            execution-while-not-rendered
            src={`https://sketchfab.com/models/${sketchfabId}/embed?autospin=0&preload=1`}
          />
          {!simple && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 text-white text-[10px] font-bold flex items-center gap-2 z-10 shadow-lg"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Interactive 3D Model
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${heroMode ? "h-full w-full" : ""} ${simple ? "h-full" : ""}`}>
      <div className={`overflow-hidden bg-gradient-to-br from-secondary to-card relative ${heroMode ? "h-full w-full" : simple ? "h-full w-full" : "rounded-[var(--radius)] border border-border h-64"}`}>
        <Canvas shadows camera={{ position: [4, 2.6, 5], fov: 50 }} dpr={[1, 2]}>
          <Scene imageUrl={imageUrl} />
        </Canvas>
        {!simple && (
          <button
            onClick={() => setOpen(true)}
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-card/95 shadow-soft z-10"
            aria-label="Open 360 Panorama"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
        {!simple && (
          <div className="absolute bottom-3 left-3 chip bg-card/95 text-primary z-10">
            <Compass className="h-3 w-3" /> Explore 3D Space
          </div>
        )}
      </div>
      
      {!hideButton && (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full h-11 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
        >
          <Compass className="h-4 w-4" /> Experience 360° View
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white drop-shadow-lg">
            <div>
              <p className="font-bold text-lg">360° Immersive Preview</p>
              <p className="text-xs opacity-80">Drag to look around · Pinch to zoom</p>
            </div>
            <button onClick={() => setOpen(false)} className="h-11 w-11 grid place-items-center rounded-full bg-white/20 backdrop-blur-md">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} dpr={[1, 2]}>
              <Scene imageUrl={imageUrl} isPanorama />
            </Canvas>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-white/90 text-[10px] uppercase tracking-widest pointer-events-none">
            Touch and Drag to Explore
          </div>
        </div>
      )}
    </div>
  );
}