"use client";

import { useEffect, useState } from "react";
import { Search, UtensilsCrossed } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import type { Menu } from "@/type/menu";

import MenuPageloading from "../loading";
import { getAllPublicMenus } from "@/lib/api/browseMenu";

import BrowseMenuCard from "@/components/card/BrowseMenuCard";


interface BrowseMenuProps {
  isLoggedIn: boolean;
}

const BrowseMenuPage = ({
  isLoggedIn,
}: BrowseMenuProps) => {
     const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

//    const fetchMenus = async () => {
//     try {
//       setLoading(true);

//       const data = await getAllPublicMenus({
//         search,
//         category,
//         location,
//       });

//       setMenus(data.menus);
//     } catch (error) {
//       console.error("Failed to fetch menus:", error);
//       setMenus([]);
//     } finally {
//       setLoading(false);
//     }
//   };

 useEffect(() => {
  let ignore = false;

  const loadMenus = async () => {
    try {
      const data = await getAllPublicMenus({
        search,
        category,
        location,
      });

      if (!ignore) {
        setMenus(data.menus);
      }
    } catch (error) {
      if (!ignore) {
        console.error("Fetch menus error:", error);
        setMenus([]);
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadMenus();

  return () => {
    ignore = true;
  };
}, [search, category, location]);

  // Build filter options from the returned menu items
  const categories = [
    ...new Set(menus.map((menu) => menu.category).filter(Boolean)),
  ];

  const locations = [
    ...new Set(menus.map((menu) => menu.location).filter(Boolean)),
  ];


    return (
        <section className="space-y-8">
      {/* Page Heading */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">
          Browse Our Menu
        </h1>

        <p className="text-muted-foreground">
          Discover delicious food from our available vendors.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search menu by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select
          value={location}
          onValueChange={(value)=>setLocation(value ?? "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Locations
            </SelectItem>

            {locations.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menu Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {menus.length} menu items found
        </p>
      )}

      {/* Menu Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <MenuPageloading key={index} />
          ))
        ) : menus.length > 0 ? (
          menus.map((menu) => (
            <BrowseMenuCard
              key={menu._id}
              menu={menu}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <UtensilsCrossed className="mb-3 h-12 w-12 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No Menu Items Found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Try another search term or change your filters.
            </p>
          </div>
        )}
      </div>
    </section>
    );
};

export default BrowseMenuPage;