"use client";

import {
  ShaderGradientCanvas as _ShaderGradientCanvas,
  ShaderGradient,
} from "shadergradient";

import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

const ShaderGradientCanvas = _ShaderGradientCanvas as React.ComponentType<
  Record<string, unknown>
>;

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        pixelDensity={1}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <ShaderGradient
          /* Smooth, subtle motion */
          animate="on"
          type="plane"
          shader="flow"
          uSpeed={0.1} // slower
          uStrength={1.2} // softer
          uFrequency={0.12} // smoother waves
          uAmplitude={1.3} // subtle displacement
          uDensity={2} // less chaotic
          /* Darker + muted blue palette */
          color1="#5f8bb8" // soft steel blue
          color2="#1e4e7f" // deeper blue
          color3="#0a2f4f" // dark navy
          reflection={0.4} // reduced reflectiveness
          /* Camera tuning */
          cAzimuthAngle={270}
          cPolarAngle={180}
          cDistance={0.6}
          cameraZoom={1.8}
          /* Lighting */
          lightType="env"
          brightness={0.55} // darker scene
          envPreset="lobby"
          grain="on"
          /* Clean output */
          wireframe={false}
          toggleAxis={false}
          zoomOut={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
