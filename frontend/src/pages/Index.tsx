import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import DataGridSection from "@/components/home/DataGridSection";
import { NavigationCards } from "@/components/home/NavigationCards";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DataGridSection />
      <NavigationCards />
    </Layout>
  );
};

export default Index;
