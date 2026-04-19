import { Icon } from "@iconify/react";

type Props = {
  icon?: string;
  title: string;
  description?: string;
};

export function EmptyState({ icon = "mage:search", title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon icon={icon} className="mb-3 h-10 w-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}
