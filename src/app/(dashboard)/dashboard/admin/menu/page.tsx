
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Search,
  UtensilsCrossed,
} from "lucide-react";

import ManageMenuCard, {
  type MenuItem,
} from "@/components/card/admin/manageMenuCard";

import {
  getAllMenuItems,
  approveMenu,
  rejectMenu,
  deleteMenu,
} from "@/lib/api/admin/adminMenu";

type FilterStatus = "All" | "Pending" | "Approved" | "Rejected";

// Extract the menu array from different possible API response structures.
const extractMenus = (response: unknown): MenuItem[] => {
  if (Array.isArray(response)) {
    return response as MenuItem[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const data = response as Record<string, unknown>;

  // Common API response structures
  const possibleArrays = [
    data.menus,
    data.menuItems,
    data.items,
    data.data,
  ];

  for (const item of possibleArrays) {
    if (Array.isArray(item)) {
      return item as MenuItem[];
    }

    // Handle nested response: { data: { menus: [...] } }
    if (item && typeof item === "object") {
      const nested = item as Record<string, unknown>;

      if (Array.isArray(nested.menus)) {
        return nested.menus as MenuItem[];
      }

      if (Array.isArray(nested.menuItems)) {
        return nested.menuItems as MenuItem[];
      }

      if (Array.isArray(nested.items)) {
        return nested.items as MenuItem[];
      }
    }
  }

  return [];
};

export default function ManageMenuItemsPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch all menu items
  const fetchMenus = useCallback(async () => {
  try {
    const response = await getAllMenuItems();

    console.log("Admin menu API response:", response);

    const menuList = extractMenus(response);

    setMenus(menuList);
  } catch (error) {
    console.error("Failed to fetch menus:", error);

    setMenus([]);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to load menu items."
    );
  } finally {
    setLoading(false);
  }
}, []);

  
  useEffect(() => {
  const timer = setTimeout(() => {
    fetchMenus();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchMenus]);
  // Refresh menus
  const refresh = () => {
    fetchMenus();
  };

  // Approve menu
  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);

      await approveMenu(id);

      setMenus((previousMenus) =>
        previousMenus.map((menu) =>
          menu._id === id
            ? { ...menu, status: "Approved" }
            : menu
        )
      );

      toast.success("Menu item approved successfully.");
    } catch (error) {
      console.error("Approve menu error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve menu item."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Reject menu
  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);

      await rejectMenu(id);

      setMenus((previousMenus) =>
        previousMenus.map((menu) =>
          menu._id === id
            ? { ...menu, status: "Rejected" }
            : menu
        )
      );

      toast.success("Menu item rejected successfully.");
    } catch (error) {
      console.error("Reject menu error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reject menu item."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Delete menu
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      await deleteMenu(id);

      setMenus((previousMenus) =>
        previousMenus.filter((menu) => menu._id !== id)
      );

      toast.success("Menu item deleted successfully.");
    } catch (error) {
      console.error("Delete menu error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete menu item."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Search and status filtering
  const filteredMenus = menus.filter((menu) => {
    const matchesFilter =
      filter === "All" || menu.status === filter;

    const searchText = search.toLowerCase().trim();

    const searchableFields = [
      menu.itemName,
      menu.category,
      menu.vendorName,
      menu.vendorEmail,
      menu.location,
    ];

    const matchesSearch = searchableFields.some((value) =>
      String(value ?? "").toLowerCase().includes(searchText)
    );

    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = [
    {
      label: "Total Menus",
      value: menus.length,
    },
    {
      label: "Pending",
      value: menus.filter((menu) => menu.status === "Pending").length,
    },
    {
      label: "Approved",
      value: menus.filter((menu) => menu.status === "Approved").length,
    },
    {
      label: "Rejected",
      value: menus.filter((menu) => menu.status === "Rejected").length,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Menu Items
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review, approve, reject, and manage vendor menu items.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {stat.label}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by menu, category, vendor..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as FilterStatus)
          }
          className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-red-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Menu Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading menu items...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="rounded-xl border bg-white py-14 text-center">
            <UtensilsCrossed
              size={36}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-gray-800">
              No menu items found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {menus.length === 0
                ? "There are currently no menu items available."
                : "Try changing your search or filter."}
            </p>
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <ManageMenuCard
              key={menu._id}
              menu={menu}
              processing={processingId === menu._id}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
