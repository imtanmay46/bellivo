import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const freeFeatures = [
  "Voice commands for basic playback",
  "Search and play songs",
  "Create playlists",
  "Standard audio quality",
  "Mobile and desktop access",
]

const premiumFeatures = [
  "All Free features",
  "Multilingual LLM support",
  "Crossfade & Automix",
  "Complex playlist commands",
  "Ad-free experience",
  "Priority voice processing",
  "Custom voice preferences",
  "High-quality audio",
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/bellivo-logo-dark.png"
              alt="Bellivo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold text-[#C9A86A]">Bellivo</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-[#C9A86A]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg">Start free, upgrade anytime</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/home">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Get Started Free
              </Button>
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-[#C9A86A]/50 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] rounded-full text-sm font-bold text-black">
              Premium
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:shadow-lg hover:shadow-[#2ECC71]/50 text-white">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
