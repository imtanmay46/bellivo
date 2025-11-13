import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PremiumHero } from "@/components/premium-hero"
import { PremiumFeatures } from "@/components/premium-features"
import { PremiumPricing } from "@/components/premium-pricing"
import { PremiumAccessibility } from "@/components/premium-accessibility"
import { PremiumFooter } from "@/components/premium-footer"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/home")
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0B0B0B]">
      <Navbar />
      <PremiumHero />
      <div id="features">
        <PremiumFeatures />
      </div>
      <div id="pricing">
        <PremiumPricing />
      </div>
      <PremiumAccessibility />
      <PremiumFooter />
    </div>
  )
}
