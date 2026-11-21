import FeaturedMenuSection from "@/components/homepage/FeatureMenuSection";
import Footer from "@/components/homepage/footer";
import { Hero } from "@/components/homepage/hero";
import PopularPizzaCombos from "@/components/homepage/popularPizzaCombo";
import WhyChoosePizzaHub from "@/components/homepage/whychoose-PizzaHub";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {

  const session = await auth.api.getSession({
  headers: await headers(),
});

const isLoggedIn = !!session?.user;
  return (
    <>
      <Hero />
      <WhyChoosePizzaHub />
      <FeaturedMenuSection  isLoggedIn={isLoggedIn}/>
      <PopularPizzaCombos />
      <Footer></Footer>
      {/* Other homepage sections (Featured Menu, Categories, etc.) go here in Phase 9 */}
    </>
  );
}
