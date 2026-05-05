"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Sección con imagen de fondo + efecto parallax suave + overlay configurable.
// Se mide su propio progreso de scroll para que el parallax sea local a la
// sección (no al documento entero).

export function ParallaxSection({
  image,
  alt = "",
  overlayClassName,
  children,
  className,
  intensity = 0.18,
  priority = false,
}: {
  image: string;
  alt?: string;
  overlayClassName?: string;
  children: React.ReactNode;
  className?: string;
  /** Fracción del alto de la sección que la imagen se desplaza (0–0.5). */
  intensity?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yPercent = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${intensity * 50}%`, `${intensity * 50}%`],
  );

  return (
    <section ref={ref} className={cn("relative isolate overflow-hidden", className)}>
      <motion.div
        style={{ y: yPercent }}
        className="pointer-events-none absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10 will-change-transform"
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10", overlayClassName)} />
      {children}
    </section>
  );
}
