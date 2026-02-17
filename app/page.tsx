"use client"

import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { SignatureSection } from "@/components/home/signature-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <SignatureSection />
      <TestimonialsSection />
      <SiteFooter />
    </main>
  )
}
