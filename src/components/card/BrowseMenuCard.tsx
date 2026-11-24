"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, MapPin, Pizza, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Menu } from "@/type/menu";

interface MenuCardProps {
  menu: Menu;
}

export const BrowseMenuCard = ({
  menu,
}: MenuCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    // Viewing menu details is public — no login required.
    router.push(`/menu/${menu._id}`);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
      {/* Menu Image */}
      <div className="relative h-52 w-full overflow-hidden bg-red-50">
        {menu.imageUrl ? (
          <Image
            src={menu.imageUrl}
            alt={menu.itemName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw h-60"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-red-300">
            <Pizza className="h-10 w-10" />
            <span className="text-xs font-medium">
              No image available
            </span>
          </div>
        )}

        {/* Category — orange accent */}
        <Badge className="absolute left-3 top-3 max-w-[75%] bg-orange-500 font-semibold text-white">
          <span className="min-w-0 truncate">
            {menu.category}
          </span>
        </Badge>
      </div>

      {/* Menu Information */}
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {menu.itemName}
          </h2>

          <p className="shrink-0 text-lg font-bold text-red-600">
            ৳{menu.price}
          </p>
        </div>

        {menu.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {menu.description}
          </p>
        ) : null}

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
          <span className="line-clamp-1">
            {menu.location}
          </span>
        </div>

        {/* Vendor Information */}
        <div className="mt-auto flex items-center gap-3 border-t border-orange-100 pt-3">
          {menu.vendorImage ? (
            <Image
              src={menu.vendorImage}
              alt={menu.vendorName || "Vendor"}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-red-100"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Store className="h-4 w-4" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Provided by
            </p>
            <p className="truncate text-sm font-medium text-gray-900">
              {menu.vendorName || "Unknown Vendor"}
            </p>
          </div>
        </div>

        {/* View Details */}
        <Button
          className="w-full bg-red-600 text-white hover:bg-red-700"
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
