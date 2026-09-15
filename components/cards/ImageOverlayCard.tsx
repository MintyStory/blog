import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function ImageOverlayCard({
  href,
  image,
  alt,
  aspect = "aspect-[4/5]",
  children,
  sizes = "(min-width: 1100px) 25vw, 50vw",
}: {
  href: string;
  image: string;
  alt: string;
  aspect?: string;
  children: ReactNode;
  sizes?: string;
}) {
  return (
    <Link href={href} className={`group relative block ${aspect} overflow-hidden rounded`}>
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-40% to-black/70 opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-7">{children}</div>
    </Link>
  );
}
