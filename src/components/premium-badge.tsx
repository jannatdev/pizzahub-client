import { Crown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Gold "Premium" pill shown to vendors on the Premium plan (dashboard
 * sidebar + header). Display-only — the backend decides who is premium and
 * enforces every limit itself.
 */
export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700",
        className
      )}
      title="Premium plan — unlimited menu items"
    >
      <Crown className="size-3" />
      Premium
    </span>
  );
}
