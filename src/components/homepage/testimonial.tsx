
"use client";

import { motion } from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Pizza,
  Truck,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { useEffect, useState } from "react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const update = () => setCurrent(api.selectedScrollSnap());

    update();
    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-[#fff8f2] py-20 md:py-28">
      {/* Decorative Background */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-red-200/20 blur-3xl" />

      <div className="container relative mx-auto px-4">

        {/* Section Heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#f15a24]"
          >
            <Star className="h-4 w-4 fill-current" />
            Customer Love
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl md:text-5xl"
          >
            {`Don't`} Just Take Our Word.
            <span className="block text-[#f15a24]">
              Hear It From Our Customers.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-base leading-7 text-gray-600 md:text-lg"
          >
            From the first bite to the last slice, discover why pizza lovers
            choose PizzaHub for their favorite flavors and a better
            food delivery experience.
          </motion.p>
        </motion.div>

        {/* Testimonial Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="mx-auto max-w-5xl"
        >
          <CarouselContent className="-ml-4 py-5">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-4 md:basis-1/2 lg:basis-1/2"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full"
                >
                  <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
                    <CardContent className="flex flex-1 flex-col p-7 md:p-8">

                      {/* Quote Icon & Rating */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#f15a24]">
                          <Quote className="h-6 w-6 fill-current" />
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.rating }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-[#ffae00] text-orange-700"
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Highlight */}
                      <h3 className="mb-4 text-xl font-bold text-gray-900">
                        &ldquo;{testimonial.highlight}&rdquo;
                      </h3>

                      {/* Review */}
                      <p className="flex-1 text-[15px] leading-7 text-gray-600">
                        {testimonial.review}
                      </p>

                      {/* Ordered Item */}
                      <div className="my-6 flex items-center gap-2 rounded-xl bg-[#fff8f2] px-4 py-3">
                        <Pizza className="h-5 w-5 text-[#f15a24]" />
                        <span className="text-sm text-gray-500">
                          Loved ordering:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {testimonial.order}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                        <Avatar className="h-12 w-12 border-2 border-red-600">
                          <AvatarImage
                            src={testimonial.image}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {testimonial.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Customer
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <CarouselPrevious className="static h-11 w-11 translate-y-0 rounded-full border-orange-200 bg-white text-[#f15a24] hover:bg-[#f15a24] hover:text-white" />

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-8 bg-[#f15a24]"
                      : "w-2.5 bg-orange-200 hover:bg-orange-400"
                  }`}
                />
              ))}
            </div>

            <CarouselNext className="static h-11 w-11 translate-y-0 rounded-full border-orange-200 bg-white text-[#f15a24] hover:bg-[#f15a24] hover:text-white" />
          </div>
        </Carousel>

        {/* Bottom Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 flex max-w-2xl flex-col items-center justify-center gap-4 rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-700 text-white">
            <Truck className="h-7 w-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Great pizza. Great experience.
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Every PizzaHub order is an opportunity to make your day
              a little more delicious.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
