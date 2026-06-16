import { useState, useRef, useEffect } from 'react';

interface SpringConfig {
  stiffness: number;
  damping: number;
}

export function useSpring(targetValue: number, config: SpringConfig = { stiffness: 400, damping: 25 }) {
  const [value, setValue] = useState(targetValue);
  const velocity = useRef(0);
  const current = useRef(targetValue);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // Cap delta time at 50ms to prevent huge jumps
      lastTime = time;

      const displacement = targetValue - current.current;
      const springForce = displacement * config.stiffness;
      const damperForce = velocity.current * config.damping;
      const acceleration = springForce - damperForce;

      velocity.current += acceleration * dt;
      current.current += velocity.current * dt;

      setValue(current.current);

      if (Math.abs(velocity.current) > 0.01 || Math.abs(targetValue - current.current) > 0.01) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        current.current = targetValue;
        setValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, config.stiffness, config.damping]);

  return value;
}
