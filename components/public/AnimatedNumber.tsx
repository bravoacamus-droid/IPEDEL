"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Cuenta de 0 al valor final cuando el elemento entra en viewport.
// Solo dispara una vez. Respeta prefers-reduced-motion (snap directo al final).

export function AnimatedNumber({
  value,
  duration = 1.4,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // amount: 0 dispara apenas el elemento toca el viewport. Antes
  // usabamos margin "-80px" pero en mobile portrait el elemento casi
  // nunca llegaba a estar 80px adentro del viewport — el contador se
  // quedaba en 0 para siempre. Con amount 0 funciona en cualquier
  // tamaño de pantalla.
  const inView = useInView(ref, { once: true, amount: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("es-PE")}
      {suffix}
    </span>
  );
}
