import Image from "next/image";

export function FilmImage({
  src,
  alt = "",
  className = "",
  kenburns = false,
  position = "center",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1200px",
}: {
  src: string;
  alt?: string;
  className?: string;
  kenburns?: boolean;
  position?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) return <div className={`film bg-ink/20 ${className}`} />;
  const unoptimized = src.startsWith("http://localhost") || src.includes("/uploads/");
  return (
    <div className={`film relative h-full w-full ${kenburns ? "kenburns" : ""} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
