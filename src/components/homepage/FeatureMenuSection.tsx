
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrowseMenuCard from "@/components/card/BrowseMenuCard";
import type { Menu } from "@/type/menu";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { getAllPublicMenus } from "@/lib/api/browseMenu";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const FeaturedMenuSection = () => {
  const [items, setItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);

        const response = await getAllPublicMenus({
          sort: "newest",
        });

        setItems(response.menus ?? []);
      } catch (error) {
        console.error("Failed to fetch featured menus:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Only approved and active items
  const approvedItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.status === "Approved" &&
          item.isActive === true
      ),
    [items]
  );

  // Dynamic category list
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(approvedItems.map((item) => item.category))
      ),
    ],
    [approvedItems]
  );

  // Category-wise filtering
  const filteredItems = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? approvedItems
        : approvedItems.filter(
            (item) => item.category === activeCategory
          );

    return filtered.slice(0, 6);
  }, [approvedItems, activeCategory]);

  return (
    <section className="py-16">
      <div className="max-w-7xl  mx-auto px-4">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2 text-red-600">
            <UtensilsCrossed className="h-5 w-5" />
            <span className="text-sm font-semibold italic uppercase tracking-wider">
              Our Featured Menu
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Discover Our Popular Foods
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Explore delicious dishes from our trusted vendors.
          </p>
        </motion.div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="mb-8 flex justify-center">
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
            >
              <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-full border border-red-100 px-5 py-2 data-[state=active]:border-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredItems.map((menu) => (
                <motion.div
                  key={menu._id}
                  variants={cardVariants}
                >
                  <BrowseMenuCard
                    menu={menu}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No featured menus available in this category.
          </div>
        )}

        {/* Explore All */}
        {!loading && approvedItems.length > 6 && (
          <div className="mt-10 text-center">
           

            <Link href="/browse-menu">
               <Button
              
              className="bg-red-600 text-white hover:bg-red-700"
            >

                Explore All Menu
                <ArrowRight className="ml-2 h-4 w-4" />
         
            </Button>
            
            
            </Link>
             
                
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenuSection;


 