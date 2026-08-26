"use client"

import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Eclipse, X, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

function BannerWithLinkButtons() {
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  if (!isVisible) return null

  return (
    <Banner variant="muted" className="dark text-foreground md:py-2 border-b border-border">
      <div className="flex w-full gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <Sparkles
            className="shrink-0 text-amber-500 opacity-80 max-md:mt-0.5"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-xs sm:text-sm">
              <span className="font-semibold text-primary">New:</span> Verified employee referrals, live salary benchmarks, and resume matching — all in one place.
            </p>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button size="sm" className="text-xs h-7 px-2.5 rounded-full" onClick={() => router.push('/jobs')}>
                Explore Jobs
              </Button>
              <Button variant="link" size="sm" className="text-xs h-7 px-2" onClick={() => router.push('/ai-copilot')}>
                Try AI Copilot <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </Banner>
  )
}

export { BannerWithLinkButtons }
