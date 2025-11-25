import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CategoryBadgeProps {
  name: string;
  icon?: string;
  color?: string;
  className?: string;
}

function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;

  const iconKey = iconName as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[iconKey];

  if (IconComponent && typeof IconComponent !== 'string') {
    return IconComponent as LucideIcon;
  }

  return null;
}

export function CategoryBadge({ name, icon, color, className }: CategoryBadgeProps) {
  const IconComponent = getIconComponent(icon);

  return (
    <Badge
      variant="secondary"
      className={cn('gap-1.5', className)}
      style={color ? { backgroundColor: `${color}20`, color: color } : undefined}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
      <span>{name}</span>
    </Badge>
  );
}
