"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Re-runs the server render so dynamic data (e.g. the vendor plan) is read
 * again. Used by server-rendered error states that must not call setState
 * from an effect.
 */
export function RefreshButton({ label = "Try again" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button variant="outline" size="sm" onClick={() => router.refresh()}>
      <RefreshCw className="mr-2 size-4" />
      {label}
    </Button>
  );
}
