"use client"

import React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  YouTubeIcon,
  XIcon,
  VimeoIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/platform-icons"

interface HeroLandingProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
}

export function HeroLanding({ onSubmit, isLoading }: HeroLandingProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground mb-1">
          Ultimate URL Extraction
        </h1>
        <p className="font-jetbrains tracking-[0.12em] text-[0.7rem] uppercase text-muted-foreground">
          Paste any link. Get every asset. No compromises.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex bg-input rounded-lg p-1.5 border border-border transition-colors focus-within:border-primary">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link here..."
              required
              className="flex-1 bg-transparent border-none text-foreground px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground border-none px-6 py-3 rounded-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Video"
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-5 mt-6 justify-center">
          {[YouTubeIcon, XIcon, VimeoIcon, TikTokIcon, FacebookIcon].map(
            (Icon, i) => (
              <Icon
                key={i}
                className="w-[22px] h-[22px] opacity-30 hover:opacity-70 transition-opacity text-foreground"
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
