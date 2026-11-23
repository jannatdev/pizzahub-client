
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Pizza,
  ArrowUpRight,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Regular PizzaHub Customer",
    location: "Dhaka, Bangladesh",
    image: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    review:
      "PizzaHub has genuinely become my favorite place to order pizza. The crust is perfectly baked, the cheese is generous, and the toppings always taste fresh. I love how easy it is to order my favorite pizza!",
    highlight: "My favorite pizza destination!",
    order: "Cheese Lover Pizza",
  },
  {
    name: "Tanvir Ahmed",
    role: "Verified Customer",
    location: "Mirpur, Dhaka",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    review:
      "What I love most about PizzaHub is the delivery experience. My pizza arrived hot, fresh, and right on time. The online ordering process is also incredibly simple. Definitely worth ordering again!",
    highlight: "Hot pizza, right on time!",
    order: "Chicken BBQ Pizza",
  },
  {
    name: "Farhana Rahman",
    role: "Pizza Lover",
    location: "Uttara, Dhaka",
    image: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    review:
      "I tried PizzaHub for a family dinner and everyone loved it. The ingredients taste fresh, the portions are satisfying, and there are plenty of delicious options to choose from. It made our dinner special!",
    highlight: "Perfect for family evenings!",
    order: "Supreme Pizza",
  },
  {
    name: "Sakib Hasan",
    role: "Regular Customer",
    location: "Dhanmondi, Dhaka",
    image: "https://i.pravatar.cc/150?img=13",
    rating: 5,
    review:
      "Ordering through PizzaHub is smooth from start to finish. I can explore the menu, place my order, and follow my order status without any hassle. Great food combined with a convenient experience!",
    highlight: "Ordering has never been easier!",
    order: "Spicy Chicken Pizza",
  },
  {
    name: "Maliha Islam",
    role: "Happy Customer",
    location: "Banani, Dhaka",
    image: "https://i.pravatar.cc/150?img=49",
    rating: 5,
    review:
      "The flavor combinations at PizzaHub are amazing. The cheese melts perfectly, the toppings are delicious, and every bite feels satisfying. It's now one of my first choices whenever I crave pizza!",
    highlight: "Every bite is worth it!",
    order: "Pepperoni Pizza",
  },
];

export default function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-red-50/25 py-20 md:py-28">

      {/* Decorative Background */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-200/30 blur-[100px]" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-red-200/30 blur-[100px]" />

      <div className="container relative mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border italic px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d94b20] shadow-sm">
            <Star className="h-4 w-4 fill-current" />
            The PizzaHub Experience
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-[#250808] sm:text-3xl md:text-5xl">
            Stories That
            <span className="block text-[#e34b27]">
              Make Us Smile.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-500 md:text-lg">
            Real experiences, happy customers, and unforgettable
            flavors. `Here&apos;s` what our pizza lovers have to say.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-5xl">

          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-5 py-5">

              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.name}
                  className="basis-[90%] pl-5 sm:basis-[80%] lg:basis-[76%]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <div className="group relative flex h-full min-h-[390px] flex-col overflow-hidden rounded-[30px] border border-red-100 bg-white p-7 text-[#250808] shadow-[0_15px_50px_-20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10 md:p-12">

                      {/* Decorative shapes */}
                      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-red-50" />

                      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-red-100/40 blur-3xl" />

                      {/* Top Row */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e34b27] shadow-lg shadow-red-950/30">
                          <Quote className="h-6 w-6 fill-white text-black" />
                        </div>

                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2">
                          {Array.from({
                            length: testimonial.rating,
                          }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-orange-600 text-[#ffb52e]"
                            />
                          ))}
                          <span className="ml-2 text-xs font-bold text-black/80">
                            {testimonial.rating}.0
                          </span>
                        </div>
                      </div>

                      {/* Review */}
                      <div className="relative z-10 my-auto py-8">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                          {testimonial.highlight}
                        </p>

                        <h3 className="max-w-2xl text-2xl font-semibold leading-relaxed tracking-tight text-black sm:text-[24xl] md:text-[24px]">
                         &ldquo;{testimonial.review}&rdquo;
                        </h3>
                      </div>

                      {/* Bottom */}
                      <div className="relative z-10 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center">

                        {/* Customer */}
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-[#e34b27]">
                            <AvatarImage
                              src={testimonial.image}
                              alt={testimonial.name}
                            />
                            <AvatarFallback className="bg-red-100 font-bold text-red-700">
                              {testimonial.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h4 className="font-bold text-black/90">
                              {testimonial.name}
                            </h4>

                            <p className="mt-1 text-xs text-black/50">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>

                        {/* Ordered Pizza */}
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e34b27]/20 text-[#ff9875]">
                            <Pizza className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-black/50">
                              Loved ordering
                            </p>
                            <p className="mt-1 text-sm font-semibold text-black/90">
                              {testimonial.order}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Card number */}
                      <span className="pointer-events-none absolute right-8 top-28 text-7xl font-black text-white/[0.035] sm:text-8xl">
                        0{index + 1}
                      </span>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}

            </CarouselContent>
          </Carousel>

          {/* Navigation */}
          <div className="mt-9 flex items-center justify-center gap-6">

            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-white text-[#250808] shadow-sm transition-all hover:border-[#e34b27] hover:bg-[#e34b27] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={current === index ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-9 bg-[#e34b27]"
                      : "w-2.5 bg-orange-200 hover:bg-orange-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e34b27] text-white shadow-lg shadow-red-200 transition-all hover:scale-105 hover:bg-[#c83b1b]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

          {/* Slide counter */}
          <p className="mt-5 text-center text-xs font-semibold tracking-widest text-gray-400">
            TESTIMONIAL {String(current + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        {/* Bottom Trust Banner */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-20 flex max-w-3xl flex-col items-center justify-between gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:flex-row sm:p-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#e34b27]">
              <Pizza className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#250808]">
                Good food. Happy moments.
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Made with love, delivered with care.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#fff5ee] px-5 py-3 text-sm font-bold text-[#e34b27]">
            Made for pizza lovers
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </motion.div> */}

      </div>
    </section>
  );
}
