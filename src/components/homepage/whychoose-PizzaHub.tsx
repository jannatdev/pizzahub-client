
"use client";

import Image from "next/image";
import DeliveryImg from '@/app/asset/Friendly PizzaHub Doorstep Delivery.png'
import { motion, useReducedMotion } from "framer-motion";
import {
  Bike,
  BadgePercent,
  Pizza,
  
  Clock3,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: <Bike className="h-7 w-7" />,
    title: "Fast Delivery",
    description: "Fresh and delicious food delivered to your door.",
  },
  {
    icon: <BadgePercent className="h-7 w-7" />,
    title: "Affordable Prices",
    description: "Enjoy great meals without spending too much.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Trusted Vendors",
    description: "Order confidently from our verified food vendors.",
  },
];

const WhyChoosePizzaHub = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#fff9f3] py-20 md:py-28">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-red-100/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-10">

        {/* Left Content */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-2">
            <span className="h-[2px] w-8 bg-orange-500" />
            <span className="font-semibold italic tracking-wide text-red-600">
              Why Choose Us?
            </span>
          </div>

          {/* Heading */}
          <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-[54px]">
            Delicious Food,
            <br />
            <span className="text-orange-500">
              Delivered with Love!
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Great food deserves a great experience. At PizzaHub,
            we bring your favorite meals closer with fast delivery,
            affordable prices, and trusted local vendors.
          </p>

          {/* Benefits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-3"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
                className="group"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200/70 transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:bg-red-600 group-hover:text-white">
                  {benefit.icon}
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          
          {/* <div className="mt-10">
            <Button
             
              className="h-12 rounded-full bg-red-600 px-7 text-white shadow-lg shadow-red-200 transition hover:-translate-y-1 hover:bg-red-700"
            >
              <Link href="/browse-menu">
                Explore Our Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div> */}
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[580px]"
        >
          {/* Decorative circle */}
          <div className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 " />

          {/* Floating label */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-1 top-12 z-20 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl sm:-left-5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-red-600">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Quick Delivery
              </p>
              <p className="text-xs text-gray-500">
                Right to your doorstep
              </p>
            </div>
          </motion.div>

          {/* Main image */}
          <div className="relative aspect-square w-full">
            <Image
              src={DeliveryImg}
              alt="Delicious PizzaHub food delivery"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="z-10 object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>

          {/* Bottom floating badge */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 right-0 z-20 flex items-center gap-2 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-right-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Pizza className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Made with Love
              </p>
              <p className="text-xs text-gray-500">
                Freshness in every bite
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoosePizzaHub;
