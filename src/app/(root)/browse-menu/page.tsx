"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Search, UtensilsCrossed } from "lucide-react";

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
import { useSession } from "@/lib/auth-client";

import BrowseMenuCard from "@/components/card/BrowseMenuCard";

/** Debounce so typing doesn't fire one request per keystroke. */
const FETCH_DEBOUNCE_MS = 300;

/** Fallback facet builder when the server does not return filter options. */
const distinctValues = (items: Menu[], key: "category" | "location") =>
  [
    ...new Set(
      items.map((item) => item[key]).filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

const BrowseMenuPage = () => {
  // Browsing is public — no login required. Only View Details needs an
  // account, so the session decides where the button navigates.
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const data = await getAllPublicMenus({
          search,
          category,
          location,
          sort,
        });

        if (ignore) return;

        const items = data.menus ?? [];
        setMenus(items);

        // Filter options come from the server over ALL approved items, so
        // they never collapse while a filter is applied.
        setCategories(
          Array.isArray(data.categories) && data.categories.length
            ? data.categories
            : distinctValues(items, "category")
        );
        setLocations(
          Array.isArray(data.locations) && data.locations.length
            ? data.locations
            : distinctValues(items, "location")
        );
      } catch (error) {
        if (!ignore) {
          console.error("Fetch menus error:", error);
          setMenus([]);
          setFetchError(
            error instanceof Error
              ? error.message
              : "Failed to fetch menus."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, FETCH_DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, category, location, sort]);

  return (
    <section className="space-y-8 max-w-7xl mx-auto">
      {/* Page Heading */}
      <div className="space-y-3 text-center">
        <span className="inline-block rounded-full bg-orange-500/15 px-4 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-orange-500/30">
          🍕 Fresh picks from local vendors
        </span>

        <h1 className="text-3xl font-bold md:text-4xl">
          Browse Our Menu
        </h1>

        <p className="text-muted-foreground">
          Discover delicious food from our available vendors.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />

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
            onValueChange={(value) => setLocation(value ?? "all")}
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

          {/* Price Sort */}
          <Select
            value={sort}
            onValueChange={(value) => setSort(value ?? "newest")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">
                Newest First
              </SelectItem>
              <SelectItem value="price_asc">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_desc">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menu Count */}
      {!loading && !fetchError && (
        <p className="text-sm text-muted-foreground">
          {menus.length} menu items found
        </p>
      )}

      {/* Menu Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 cotainer mx-auto">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <MenuPageloading key={index} />
          ))
        ) : fetchError ? (
          <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertTriangle className="mb-3 h-12 w-12 text-red-500" />

            <h2 className="text-lg font-semibold text-red-700">
              Could Not Load Menu
            </h2>

            <p className="mt-1 max-w-md text-sm text-red-600/80">
              {fetchError}
            </p>
          </div>
        ) : menus.length > 0 ? (
          menus.map((menu) => (
            <BrowseMenuCard
              key={menu._id}
              menu={menu}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/30 p-8 text-center">
            <UtensilsCrossed className="mb-3 h-12 w-12 text-orange-500" />

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
