
"use client"
import React, { useEffect, useRef } from "react"

export function LiquidEffectAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const script = document.createElement("script")
    script.type = "module"
    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
      const canvas = document.getElementById('liquid-canvas');
      
      if (canvas) {
        const app = LiquidBackground(canvas);
        
        // Use a strictly neutral, very dark texture to avoid unwanted colors
        app.loadImage('https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=2564');
        
        // Material settings for a "Glass/Mercurial" feel that is transparent
        app.liquidPlane.material.metalness = 1.0;
        app.liquidPlane.material.roughness = 0.01;
        app.liquidPlane.material.transparent = true;
        app.liquidPlane.material.opacity = 0.2; // Very transparent to show the #050505 background
        
        // STABILITY LOCK:
        // We set the displacement scale for cursor reactivity
        app.liquidPlane.uniforms.displacementScale.value = 5.0;
        
        // KILL AUTO-MOTION:
        // We override the internal render loop to force the time uniform to a static value.
        // This prevents the "flowing" or "moving" effect when the cursor is still.
        const originalRender = app.render;
        app.render = () => {
          // Force all known time-based uniforms to zero or static
          if (app.liquidPlane.uniforms.uTime) {
            app.liquidPlane.uniforms.uTime.value = 0.0;
          }
          if (app.liquidPlane.uniforms.time) {
            app.liquidPlane.uniforms.time.value = 0.0;
          }
          if (app.liquidPlane.uniforms.interval) {
            app.liquidPlane.uniforms.interval.value = 0.0;
          }
          originalRender();
        };

        window.__liquidApp = app;
      }
    `;
    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp && typeof window.__liquidApp.dispose === 'function') {
        window.__liquidApp.dispose()
      }
      if (script.parentNode) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden z-0 pointer-events-none bg-[#050505]">
      <canvas 
        ref={canvasRef} 
        id="liquid-canvas" 
        className="fixed inset-0 w-full h-full" 
      />
      {/* Ensure the background is strictly the old #050505 color by layering it */}
      <div className="absolute inset-0 bg-[#050505]/60 pointer-events-none" />
    </div>
  )
}

declare global {
  interface Window {
    __liquidApp?: any
  }
}
