import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Empty dashboard page used until a feature page is built.
 * Keeps every sidebar link working (no 404s) while the dashboard grows.
 */
export function PagePlaceholder({ icon: Icon, title, description }: PagePlaceholderProps) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="rounded-lg border border-dashed bg-gray-50 px-4 py-3 text-sm text-gray-500">
          This section is coming soon — the layout, navigation and route
          protection are already in place for it.
        </p>
      </CardContent>
    </Card>
  );
}
