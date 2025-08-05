import DiscoverSection from "./_components/DiscoverSection";
import FeaturesSection from "./_components/FeaturesSection";
import HeroSection from "./_components/HeroSection";

const Landing = () => {
  return (
    <div className="h-full w-full">
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
    </div>
  );
};

export default Landing;
