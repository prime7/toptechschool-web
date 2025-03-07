import Image from "next/image";

interface UserAvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export function UserAvatar({ src, alt, size = 32 }: UserAvatarProps) {
  return (
    <div
      className="inline-block overflow-hidden rounded-full border-2 border-foreground"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size} height={size} loading="lazy" />
    </div>
  );
}
