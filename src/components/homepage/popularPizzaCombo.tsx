import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import familyFeast from '@/app/asset/Pizza Combo Feast.png'
import pizzaCombo from '@/app/asset/Pizza Combo Feast.png'

const combos = [
  {
    name: "Family Feast",
    description: "2 Large Pizzas + Drinks + Sides",
    price: "৳1299",
    oldPrice: "৳1599",
    image: {familyFeast},
    badge: "Best Seller",
  },
  {
    name: "Mega Combo",
    description: "1 Large Pizza + Wings + Drinks",
    price: "৳899",
    oldPrice: "৳1099",
    image: {familyFeast},
    badge: "Popular",
  },
  {
    name: "Pizza Party",
    description: "3 Medium Pizzas + Garlic Bread",
    price: "৳1499",
    oldPrice: "৳1799",
    image: {pizzaCombo},
    badge: "Great Deal",
  },
];

export default function PopularPizzaCombos() {
  return (
    <section className="relative overflow-hidden bg-[#ff4d00] py-16 md:py-24">
      {/* Decorative background */}
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rotate-45 bg-orange-400/30" />
      <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-orange-300/20 blur-3xl" />

      <div className="max-w-7xl relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="max-w-xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Flame size={18} />
              <span>Hot Deals at PizzaHub</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Popular Pizza
              <span className="block text-yellow-300">Combos!</span>
            </h2>

            <p className="mt-5 max-w-md text-lg text-white/90 md:text-xl">
              More pizza, more happiness! Grab your favorite combo
              and enjoy delicious moments with friends and family.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-white px-7 font-bold text-red-600 hover:bg-yellow-100"
              >
                Explore Combos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-2xl font-extrabold text-yellow-300">
                  30%
                </span>
                <span>
                  OFF on selected
                  <br />
                  combo meals
                </span>
              </div>
            </div>
          </div>

          {/* Right Combo Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {combos.slice(0, 2).map((combo, index) => (
              <div
                key={combo.name}
                className={`group relative overflow-hidden rounded-3xl bg-white p-4 shadow-2xl transition duration-300 hover:-translate-y-2 ${
                  index === 1 ? "sm:mt-12" : ""
                }`}
              >
                <div className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  {combo.badge}
                </div>

                <div className="relative h-48 overflow-hidden rounded-2xl bg-orange-50">
                  <Image
                    src={index === 0 ? familyFeast : pizzaCombo}
                    alt={combo.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {combo.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {combo.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-red-600">
                        {combo.price}
                      </span>
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {combo.oldPrice}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="rounded-full bg-red-600 hover:bg-orange-600"
                    >
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}