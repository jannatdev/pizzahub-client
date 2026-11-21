"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  CalendarDays,
} from "lucide-react";

import type { MenuItem } from "@/type/menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (id: string) => void;
  onAvailabilityChange: (
    id: string,
    isActive: boolean
  ) => void;
}

const ManageMenuCard = ({
  item,
  onDelete,
  onAvailabilityChange,
}: MenuItemCardProps) => {
  const isApproved = item.status === "Approved";
  const isActive = item.isActive !== false;

  // Status pill tints (same palette as the details/admin cards)
  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <Card className="overflow-hidden border-red-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
        {/* Left Part - Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-red-50 ring-1 ring-red-100 sm:h-44 sm:w-48">
          <Image
            src={item.imageUrl || "/placeholder-food.png"}
            alt={item.itemName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>

        {/* Right Part - Information */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                {/* Category pill */}
                <span className="inline-block rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {item.category}
                </span>

                <h2 className="mt-1.5 truncate text-lg font-bold">
                  {item.itemName}
                </h2>
              </div>

              <Badge
                className={
                  statusStyles[item.status] ||
                  "bg-gray-100 text-gray-700"
                }
              >
                {item.status}
              </Badge>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="font-extrabold text-red-600">
                ৳{item.price}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={15} className="text-orange-500" />
                {item.location}
              </span>

              <span className="flex items-center gap-1">
                <CalendarDays size={15} className="text-orange-500" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-red-100 pt-3">
            {/* Availability toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                disabled={!isApproved}
                onCheckedChange={(checked) =>
                  onAvailabilityChange(item._id, checked)
                }
              />

              <span className="text-sm text-muted-foreground">
                {isApproved
                  ? isActive
                    ? "Available"
                    : "Unavailable"
                  : "Availability locked"}
              </span>
            </div>

            {/* View / Edit / Delete */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/menu/${item._id}`} />}
                className="border-orange-200 bg-orange-50/50 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                <Eye size={15} className="mr-1" />
                View
              </Button>

              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    href={`/dashboard/vendor/menu/EditMenu/${item._id}`}
                  />
                }
                className="border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Pencil size={15} className="mr-1" />
                Edit
              </Button>

              <Button
                size="sm"
                onClick={() => onDelete(item._id)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 size={15} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageMenuCard;
