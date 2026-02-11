"use client"

import { useState, useCallback } from "react"
import { Download, RefreshCw } from "lucide-react"

interface Frame {
  id: string
  timestamp: string
}

interface FrameSelectionProps {
  videoTitle: string
  frames: Frame[]
  onBack: () => void
}

export function FrameSelection({ videoTitle, frames, onBack }: FrameSelectionProps) {
  const [selectedFrames, setSelectedFrames] = useState<Set<string>>(new Set())

  const toggleFrame = useCallback((id: string) => {
    setSelectedFrames(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = () => setSelectedFrames(new Set(frames.map(f => f.id)))
  const deselectAll = () => setSelectedFrames(new Set())

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-display font-bold uppercase tracking-tight text-2xl gradient-title mb-1">
            Frame Selection
          </h1>
          <p className="font-jetbrains tracking-[0.12em] text-[0.7rem] uppercase text-muted-foreground">
            Review and select shots from {videoTitle}
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-transparent text-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary transition-colors"
        >
          Back
        </button>
      </div>

      <div className="glass-card p-3 mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors"
          >
            Deselect All
          </button>
        </div>
        <span className="text-muted-foreground text-sm font-medium">
          {frames.length} frames extracted
        </span>
      </div>

      <div
        className="grid gap-3 mb-20"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {frames.map(frame => (
          <div
            key={frame.id}
            className={`frame-card ${selectedFrames.has(frame.id) ? "selected" : ""}`}
            onClick={() => toggleFrame(frame.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleFrame(frame.id) }}
          >
            <div className="aspect-video bg-secondary flex items-center justify-center relative">
              <span className="text-muted-foreground text-xs font-jetbrains">
                {frame.id}
              </span>
              {selectedFrames.has(frame.id) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
            <div className="frame-info">
              <div className="flex justify-between items-center">
                <span>{frame.timestamp}</span>
                <span className="opacity-50">ID: {frame.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom bar */}
      <div className="frame-actions-sticky animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-sm font-bold">
            {selectedFrames.size}
          </span>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Selected</span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex gap-2">
          <button className="bg-transparent text-foreground border border-border px-3 py-1.5 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Others
          </button>
          <button
            disabled={selectedFrames.size === 0}
            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download Assets
          </button>
        </div>
      </div>
    </div>
  )
}
