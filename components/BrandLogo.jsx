import Image from "next/image";

export default function BrandLogo({ className="", imageClassName="", priority=false, sizes="(max-width: 768px) 150px, 210px" }) {
  return (
    <Image
      src="/logo.png"
      alt="Fowaah’s Apartments"
      width={306}
      height={204}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className} ${imageClassName}`}
    />
  );
}
