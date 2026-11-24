import FeaturedMenuSection from "@/components/homepage/FeatureMenuSection";
import { Hero } from "@/components/homepage/hero";
import PopularPizzaCombos from "@/components/homepage/popularPizzaCombo";
import TestimonialsSection from "@/components/homepage/testimonial";
import WhyChoosePizzaHub from "@/components/homepage/whychoose-PizzaHub";
import { Toaster } from "sonner";

export default async function Home() {
  return (
    <main className="flex-1 flex flex-col bg-red-50/25">
      <Toaster position="top-right" richColors />
      
      <Hero />
      <WhyChoosePizzaHub />
      <FeaturedMenuSection />
      <PopularPizzaCombos />
      <TestimonialsSection></TestimonialsSection>
      
    </main>
  );
}