import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Premium image slot. Pass `src` once the client uploads the photo to /public/...
// While `src` is empty, renders an elegant placeholder hinting at the expected path.
//
// Example:
//   <ImageSlot
//     hint="Carga aérea — vista de avión cargo"
//     suggested="/services/agenciamiento-aereo.jpg"
//     ratio="aspect-[4/3]"
//   />
//
// When ready:
//   <ImageSlot
//     src="/services/agenciamiento-aereo.jpg"
//     alt="Carga aérea"
//     ratio="aspect-[4/3]"
//   />

export function ImageSlot({
  src,
  alt = "",
  hint,
  suggested,
  ratio = "aspect-[4/3]",
  rounded = "rounded-2xl",
  priority,
  className,
}: {
  src?: string;
  alt?: string;
  hint?: string;
  suggested?: string;
  ratio?: string;
  rounded?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", ratio, rounded, "shadow-lg ring-1 ring-black/5", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        ratio,
        rounded,
        "border border-dashed border-brand-300 bg-gradient-to-br from-brand-50 via-white to-brand-100/60",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-brand-200">
          <ImageIcon className="h-5 w-5 text-brand-600" strokeWidth={1.6} />
        </span>
        {hint && (
          <p className="text-sm font-medium text-ink-800">{hint}</p>
        )}
        {suggested && (
          <p className="text-[11px] font-mono text-ink-500">{suggested}</p>
        )}
      </div>
    </div>
  );
}
