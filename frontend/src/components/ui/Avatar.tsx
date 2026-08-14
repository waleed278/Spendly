import { initials, cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, color = "#0a9470", size = 32, className }: AvatarProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold text-white", className)}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  );
}
