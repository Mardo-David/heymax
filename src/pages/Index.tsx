import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import InteractiveChatSection from "@/components/InteractiveChatSection";
import DifferentiationSection from "@/components/DifferentiationSection";
import LeadFormSection from "@/components/LeadFormSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemsSection />
      <SolutionSection />
      <HowItWorksSection />
      <SocialProofSection />
      <InteractiveChatSection />
      <DifferentiationSection />
      <LeadFormSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <StickyCTA />
    </main>
  );
};

export default Index;
