"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Search, UtensilsCrossed } from "lucide-react";

import ManageMenuCard, {
  type MenuItem,
} from "@/components/card/manageMenuCard";

import {
  getAllMenuItems,
  approveMenu,
  rejectMenu,
  deleteMenu,
} from "@/lib/api/adminMenu";

type FilterStatus = "All" | "Pending" | "Approved" | "Rejected";

export default function ManageMenuItemsPage() {

    const [menus, setMenus] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);


  // No setState runs before the await, so calling this from the effect is
  // safe (react-hooks/set-state-in-effect): every update lands in the async
  // continuation once the response arrives.
  const fetchMenus = useCallback(async () => {
    try {
      const data = await getAllMenuItems();

      setMenus(Array.isArray(data) ? data : data.menus ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Refresh button: show the spinner first (event handler, not an effect).
  const refresh = () => {
    setLoading(true);
    fetchMenus();
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approveMenu(id);
      toast.success("Menu item approved successfully");
      await fetchMenus();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve menu item");
    } finally {
      setProcessingId(null);
    }
  };


   const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await rejectMenu(id);
      toast.success("Menu item rejected successfully");
      await fetchMenus();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject menu item");
    } finally {
      setProcessingId(null);
    }
  };

    const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      await deleteMenu(id);
      toast.success("Menu item deleted successfully");
      await fetchMenus();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete menu item");
    } finally {
      setProcessingId(null);
    }
  };


     const filteredMenus = menus.filter((menu) => {
    const matchesFilter =
      filter === "All" || menu.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch = [
      menu.itemName,
      menu.category,
      menu.vendorName,
      menu.vendorEmail,
      menu.location,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchText));

    return matchesFilter && matchesSearch;
  });

    const stats = [
    { label: "Total Menus", value: menus.length },
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
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
            <p className="text-sm text-gray-500">{stat.label}</p>
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by menu, category, vendor..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterStatus)}
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
              Try changing your search or filter.
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
