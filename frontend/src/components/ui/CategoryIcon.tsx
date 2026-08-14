import { getIcon } from "@/lib/icon-map";

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 20 }: CategoryIconProps) {
  const Icon = getIcon(icon);
  const boxSize = size + 18;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: boxSize, height: boxSize, backgroundColor: `${color}1A`, color }}
    >
      <Icon size={size} />
    </div>
  );
}
