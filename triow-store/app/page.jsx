import HeroSlider from '@/components/HeroSlider';
import CategoryGrid from '@/components/CategoryGrid';
import ProductShowcase from '@/components/ProductShowcase';
import BudgetSection from '@/components/BudgetSection';
import Reviews from '@/components/Reviews';
import TrustBadges from '@/components/TrustBadges';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryGrid />
      <ProductShowcase />
      <BudgetSection />
      <Reviews />
      <TrustBadges />
    </>
  );
}
