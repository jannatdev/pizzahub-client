"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Store, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Menu } from "@/type/menu";

interface MenuCardProps {
  menu: Menu;
  isLoggedIn: boolean;
}



export const BrowseMenuCard = ({
  menu,
  isLoggedIn,
}: MenuCardProps)=> {

      const router = useRouter();

  const handleViewDetails = () => {
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }

    router.push(`/browse-menu/${menu._id}`);
  };
    return (
        <div className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Menu Image */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {menu.image ? (
          <Image
            src={menu.image}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}

        <Badge className="absolute left-3 top-3">
          {menu.category}
        </Badge>
      </div>

      {/* Menu Information */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-lg font-semibold">
            {menu.name}
          </h2>

          <p className="shrink-0 font-bold text-primary">
            ৳{menu.price}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {menu.location}
          </span>
        </div>

        {/* Vendor Information */}
        <div className="flex items-center gap-2 border-t pt-3">
          {menu.vendor?.image ? (
            <Image
              src={menu.vendor.image}
              alt={menu.vendor.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Store className="h-4 w-4" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Provided by
            </p>
            <p className="truncate text-sm font-medium">
              {menu.vendor?.name || "Unknown Vendor"}
            </p>
          </div>
        </div>

        {/* View Details */}
        <Button
          className="w-full"
          onClick={handleViewDetails}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
    );
};

export default BrowseMenuCard;