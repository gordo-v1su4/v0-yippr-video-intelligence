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
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in">
      <div className="glass-card w-full max-w-[800px] px-6 py-10 md:px-10 md:py-12">
        <pre className="font-mono text-primary leading-tight text-sm md:text-base tracking-wider mb-4 select-none">
{`░█░█░▀█▀░█▀█░█▀█░█▀▄
░░█░░░█░░█▀▀░█▀▀░█▀▄
░░▀░░▀▀▀░▀░░░▀░░░▀░▀`}
        </pre>

        <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-4xl text-foreground mb-2">
          Ultimate URL Extraction
        </h2>

        <p className="font-jetbrains tracking-[0.15em] text-[0.7rem] uppercase text-muted-foreground mb-8 max-w-[500px] mx-auto">
          Paste any link. Get every asset. No compromises.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex bg-background rounded-lg p-1.5 border border-border transition-colors focus-within:border-primary">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link here..."
              required
              className="flex-1 bg-transparent border-none text-foreground px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground border-none px-6 py-3 rounded-md font-bold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
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

        <div className="flex items-center gap-5 mt-8 justify-center">
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
