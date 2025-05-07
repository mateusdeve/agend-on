import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { ContactInfoSection } from "@/components/home/contact-info-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactInfoSection />
    </>
  )
}
