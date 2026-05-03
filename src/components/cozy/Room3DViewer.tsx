import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Maximize2, X, Compass } from "lucide-react";

function Room() {
  // Procedural cozy room — no external GLB needed, fully functional 3D
  const wall = "#e9e2d5";
  const floor = "#8b6f4e";
  const wood = "#5b3a22";
  const accent = "#0f172a";
  const amber = "#f59e0b";
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
      {/* Wall art */}
      <mesh position={[0, 3.4, -4.93]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial color={amber} />
      </mesh>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="text-xs text-primary font-medium animate-pulse">Loading 3D room…</div>
    </Html>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />
      <pointLight position={[-2.4, 1.5, -3]} intensity={0.6} color="#f59e0b" />
      <pointLight position={[2.4, 1.5, -3]} intensity={0.6} color="#f59e0b" />
      <Suspense fallback={<Loader />}>
        <Room />
        <Environment preset="apartment" />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={12} blur={2.4} />
      </Suspense>
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.2, -1]}
        enableDamping
      />
    </>
  );
}

export default function Room3DViewer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="rounded-[var(--radius)] overflow-hidden bg-gradient-to-br from-secondary to-card border border-border h-64 relative">
        <Canvas shadows camera={{ position: [4, 2.6, 5], fov: 50 }} dpr={[1, 2]}>
          <Scene />
        </Canvas>
        <button
          onClick={() => setOpen(true)}
          className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-card/95 shadow-soft"
          aria-label="Open fullscreen 3D"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 chip bg-card/95 text-primary">
          <Compass className="h-3 w-3" /> Drag · Pinch · Rotate
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full h-11 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
      >
        <Compass className="h-4 w-4" /> View in 360°
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <p className="font-semibold">360° Room Preview</p>
            <button onClick={() => setOpen(false)} className="h-10 w-10 grid place-items-center rounded-full bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1">
            <Canvas shadows camera={{ position: [5, 2.8, 6], fov: 55 }} dpr={[1, 2]}>
              <Scene />
            </Canvas>
          </div>
          <div className="p-4 text-center text-white/70 text-xs">Drag to rotate · Pinch to zoom · Two fingers to pan</div>
        </div>
      )}
    </div>
  );
}