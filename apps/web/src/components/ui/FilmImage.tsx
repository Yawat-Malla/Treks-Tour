export function FilmImage({
  src,
  alt = "",
  className = "",
  kenburns = false,
  position = "center",
}: {
  src: string;
  alt?: string;
  className?: string;
  kenburns?: boolean;
  position?: string;
}) {
  return (
    <div className={`film h-full w-full ${kenburns ? "kenburns" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ objectPosition: position }} />
    </div>
  );
}
