import { useEffect, useRef } from "react";
import { createOrbitalSphereRenderer, ORBITAL_SPHERE_DEFAULTS } from "./orbitalSphereRenderer";

export default function OrbitalSphereBackground({ options = ORBITAL_SPHERE_DEFAULTS }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    const getOptions = () => options;
    const instance = createOrbitalSphereRenderer(canvas, getOptions);
    rendererRef.current = instance;

    const onResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      instance.resize(parent.offsetWidth, parent.offsetHeight);
    };

    const loop = () => {
      if (destroyed) return;
      instance.render();
      animationRef.current = requestAnimationFrame(loop);
    };

    onResize();
    loop();
    window.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      instance.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
