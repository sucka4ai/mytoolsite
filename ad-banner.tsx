"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdBanner({ slot, format = "auto", responsive = true, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdPushed = useRef(false)

  useEffect(() => {
    if (!isAdPushed.current && adRef.current) {
      try {
        // Push the ad to Google AdSense
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        isAdPushed.current = true
      } catch (err) {
        console.error("[v0] AdSense error:", err)
      }
    }
  }, [])

  // Show placeholder in development/preview mode
  const isProduction = process.env.NODE_ENV === "production"

  if (!isProduction) {
    return (
      <div
        className={`flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4 ${className}`}
      >
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Advertisement Placeholder</p>
          <p className="text-xs text-muted-foreground">Slot: {slot}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`ad-container overflow-hidden rounded-lg ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
