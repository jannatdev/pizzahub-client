import FeaturedMenuSection from "@/components/homepage/FeatureMenuSection";
import Footer from "@/components/homepage/footer";
import { Hero } from "@/components/homepage/hero";
import PopularPizzaCombos from "@/components/homepage/popularPizzaCombo";
import TestimonialsSection from "@/components/homepage/testimonial";
import WhyChoosePizzaHub from "@/components/homepage/whychoose-PizzaHub";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Toaster } from "sonner";

export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;

  // Frader Motion variants for homepage animations
  // const heroVariants = {
  //   initial: { y: 20, opacity: 0 },
  //   animate: { y: 0, opacity: 1 },
  //   exit: { y: -20, opacity: 0 },
  // };

  // const sectionVariants = {
  //   initial: { y: 40, opacity: 0 },
  //   animate: { y: 0, opacity: 1 },
  //   exit: { y: 40, opacity: 0 },
  // };

  return (
    <main className="flex-1 flex flex-col bg-red-50/25">
      <Toaster position="top-right" richColors />
      
      <Hero />
      <WhyChoosePizzaHub />
      <FeaturedMenuSection isLoggedIn={isLoggedIn}/>
      <PopularPizzaCombos />
      <TestimonialsSection></TestimonialsSection>
      
    </main>
  );
}