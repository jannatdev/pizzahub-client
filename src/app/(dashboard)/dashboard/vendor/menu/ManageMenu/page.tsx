"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getMyMenuItems,
  updateMenuAvailability,
  deleteMyMenuItem,
} from "@/lib/api/vendor/vendorMenu";


import type { MenuItem } from "@/type/menu";


import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ManageMenuCard from "@/components/card/vendor/manageMenuCard";

const ManageMenuPage = () => {
     const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);




 useEffect(() => {
  let ignore = false;

  const loadItems = async () => {
    try {
      console.log("Loading vendor menu items...");
      const result = await getMyMenuItems();
     

console.log("VENDOR MENU API RESULT:", result);
console.log("VENDOR MENU DATA:", result?.data);

if (!ignore) {
  setItems(result?.data ?? []);
}

      if (!ignore) {
        setItems(result.data);
      }
    } catch (error) {
      if (!ignore) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load menu items"
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadItems();

  return () => {
    ignore = true;
  };
}, []);

  // Delete menu item
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleting(true);

      await deleteMyMenuItem(selectedId);

      setItems((prev) =>
        prev.filter((item) => item._id !== selectedId)
      );

      toast.success("Menu item deleted successfully");
      setSelectedId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete menu item"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Update availability
  const handleAvailabilityChange = async (
    id: string,
    isActive: boolean
  ) => {
    const previousItems = items;

    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isActive }
          : item
      )
    );

    try {
      await updateMenuAvailability(id, isActive);
      toast.success(
        isActive
          ? "Item is now available"
          : "Item is now unavailable"
      );
    } catch (error) {
      setItems(previousItems);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update availability"
      );
    }
  };

  if (loading) {

     return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

    return (
        <div className="space-y-6 bg-red-50/20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Menu Items
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your menu items, approval status, and availability.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Items", value: items.length },
          {
            label: "Approved",
            value: items.filter((i) => i.status === "Approved").length,
          },
          {
            label: "Pending",
            value: items.filter((i) => i.status === "Pending").length,
          },
          {
            label: "Rejected",
            value: items.filter((i) => i.status === "Rejected").length,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu Items */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-semibold">
              No menu items found
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You have not added any menu items yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ManageMenuCard
              key={item._id}
              item={item}
              onDelete={setSelectedId}
              onAvailabilityChange={handleAvailabilityChange}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open && !deleting) setSelectedId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete menu item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This menu item will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    );
};

export default ManageMenuPage;