import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { NavigationCards } from "@/components/home/NavigationCards";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <NavigationCards />
    </Layout>
  );
};

export default Index;
