"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CupSoda,

  Pizza,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const comboItems = [
  {
    title: "Large Pizza",
    subtitle: "Your favorite toppings",
    icon: Pizza,
    className: "left-0 top-12 rotate-[-8deg]",
    iconClass: "bg-yellow-400 text-red-700",
  },
 
  {
    title: "Cold Drink",
    subtitle: "Perfectly chilled",
    icon: CupSoda,
    className: "right-10 bottom-4 rotate-[-5deg]",
    iconClass: "bg-red-500 text-white",
  },
];

const ComboOfferSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-orange-500" />

      {/* Decorative glow */}
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

      {/* Decorative circles */}
      <div className="absolute right-[38%] top-10 h-5 w-5 rounded-full bg-yellow-300/70" />
      <div className="absolute left-[8%] bottom-16 h-3 w-3 rounded-full bg-white/30" />
      <div className="absolute right-[8%] top-1/2 h-8 w-8 rounded-full border-2 border-yellow-300/50" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">

        {/* ================= LEFT ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-white"
        >
          {/* Small label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/50 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <BadgePercent className="h-4 w-4 text-yellow-300" />

            <span className="text-sm font-semibold text-yellow-200">
              Special Combo Offer
            </span>
          </div>

          {/* Heading */}
          <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            More Food.
            <br />

            <span className="text-yellow-300">
              More Happiness.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-lg text-base leading-7 text-red-50/90 md:text-lg">
            Get your favorite pizza, crispy fries, and a refreshing
            drink together. Our special combo gives you more flavor
            for less.
          </p>

          {/* Offer price */}
          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-sm font-medium text-yellow-200">
                Combo starting from
              </p>

              <div className="mt-1 flex items-center gap-3">
                <span className="text-4xl font-black">
                  ৳499
                </span>

                <span className="text-lg text-white/50 line-through">
                  ৳699
                </span>
              </div>
            </div>

            <div className="rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-red-800 shadow-lg">
              SAVE 28%
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "1 Large Pizza",
              "French Fries",
              "Soft Drink",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-9">
            <Button
             
              className="group h-12 rounded-full bg-white px-7 text-base font-bold text-red-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:text-red-800"
            >
              <Link href="/browse-menu">
                Order Combo Now

                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 0.9, x: 35 }
          }
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto h-[430px] w-full max-w-[560px]"
        >
          {/* Center glow */}
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/20 blur-3xl" />

          {/* Big circular background */}
          <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm md:h-[390px] md:w-[390px]" />

          {/* Floating sparkles */}
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-10 top-16 z-20"
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>

          {/* Combo cards */}
          {comboItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 25,
                        scale: 0.9,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -7, 0],
                      }
                }
                className={`absolute z-10 ${item.className}`}
              >
                <div className="w-44 rounded-3xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:rotate-0 md:w-52">
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md ${item.iconClass}`}
                  >
                    <Icon className="h-9 w-9" />
                  </div>

                  <h3 className="text-base font-black text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Center offer badge */}
          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0 }
            }
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 180,
            }}
            className="absolute left-1/2 top-1/2 z-30 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] items-center justify-center rounded-full border-4 border-yellow-300 bg-red-700 text-center shadow-2xl"
          >
            <div>
              <p className="text-xs font-bold uppercase text-yellow-300">
                Special
              </p>

              <p className="text-2xl font-black text-white">
                COMBO
              </p>

              <p className="text-xs font-bold text-yellow-200">
                DEAL
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComboOfferSection;