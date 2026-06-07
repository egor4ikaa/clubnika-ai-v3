import { HeroSection } from '@/sections/HeroSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { AIAssistantPreview } from '@/sections/AIAssistantPreview';
import { Footer } from '@/sections/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <AIAssistantPreview />
      <Footer />
    </div>
  );
}
