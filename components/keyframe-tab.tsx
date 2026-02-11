"use client"

import React from "react"

import { useState } from "react"
import type { VideoFormat } from "@/lib/types"

interface KeyframeTabProps {
  formats: VideoFormat[]
}

type ExtractionMode = "smart" | "equally_spaced" | "interval"

export function KeyframeTab({ formats }: KeyframeTabProps) {
  const [mode, setMode] = useState<ExtractionMode>("equally_spaced")
  const [maxFrames, setMaxFrames] = useState(30)
  const [interval, setIntervalVal] = useState(5)
  const [threshold, setThreshold] = useState(80)
  const [logs, setLogs] = useState<string[]>([
    "Awaiting user initiation...",
  ])

  const videoFormats = formats.filter((f) => f.height)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Starting ${mode} extraction...`,
      `[${new Date().toLocaleTimeString()}] Mode: ${mode}, Max frames: ${maxFrames}`,
      `[${new Date().toLocaleTimeString()}] Processing...`,
    ])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card p-5 text-left">
        <h3 className="font-display font-semibold uppercase tracking-wide text-base text-foreground mb-4">
          Extraction Intelligence
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground block mb-1.5 uppercase">
              Choose Source Quality
            </label>
            <select className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none">
              {videoFormats.map((f) => (
                <option key={f.format_id} value={f.format_id}>
                  {f.resolution} ({f.ext})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground block mb-1.5 uppercase">
              Extraction Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ExtractionMode)}
              className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="smart">
                Smart Detect (First Frame of Each Cut)
              </option>
              <option value="equally_spaced">Evenly Spaced</option>
              <option value="interval">Time Interval</option>
            </select>
          </div>

          {(mode === "equally_spaced" || mode === "smart") && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  Max Frames
                </label>
                <span className="text-primary font-bold text-sm">
                  {maxFrames}
                </span>
              </div>
              <input
                type="range"
                value={maxFrames}
                onChange={(e) => setMaxFrames(Number(e.target.value))}
                min={5}
                max={100}
                step={5}
              />
            </div>
          )}

          {mode === "interval" && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  Interval (Seconds)
                </label>
                <span className="text-primary font-bold text-sm">
                  {interval}s
                </span>
              </div>
              <input
                type="range"
                value={interval}
                onChange={(e) => setIntervalVal(Number(e.target.value))}
                min={1}
                max={60}
                step={1}
              />
            </div>
          )}

          {mode === "smart" && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  Cut Sensitivity
                </label>
                <span className="text-primary font-bold text-sm">
                  {Math.round((threshold / 80) * 100)}%
                </span>
              </div>
              <input
                type="range"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                min={10}
                max={80}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Fewer cuts</span>
                <span>Every cut</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Initiate Batch Extraction
          </button>
        </form>
      </div>

      <div className="glass-card p-5 text-left flex flex-col">
        <h3 className="font-display font-semibold uppercase tracking-wide text-base text-foreground mb-4">
          Live Execution
        </h3>
        <div className="log-viewer flex-1 min-h-[280px]">
          {logs.map((log, i) => (
            <div key={i} className={i === 0 ? "opacity-30" : ""}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
