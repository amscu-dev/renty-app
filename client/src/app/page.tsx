import Navbar from "@/components/custom/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import HeroSection from "./(nondashboard)/landing/_components/HeroSection";
import FeaturesSection from "./(nondashboard)/landing/_components/FeaturesSection";
import DiscoverSection from "./(nondashboard)/landing/_components/DiscoverSection";
import CallToActionSection from "./(nondashboard)/landing/_components/CallToActionSection";
import FooterSection from "./(nondashboard)/landing/_components/FooterSections";

export default function Home() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <Navbar />
      <main className={`w-full`} style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        <div>
          <HeroSection />
          <FeaturesSection />
          <DiscoverSection />
          <CallToActionSection />
          <FooterSection />
        </div>
      </main>
    </div>
  );
}
