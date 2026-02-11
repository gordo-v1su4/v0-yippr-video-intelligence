"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import type { VideoFormat } from "@/lib/types"
import { FrameSelection } from "@/components/frame-selection"

interface KeyframeTabProps {
  formats: VideoFormat[]
}

type ExtractionMode = "smart" | "equally_spaced" | "interval" | "scene_split"

export function KeyframeTab({ formats }: KeyframeTabProps) {
  const [mode, setMode] = useState<ExtractionMode>("equally_spaced")
  const [maxFrames, setMaxFrames] = useState(30)
  const [interval, setIntervalVal] = useState(5)
  const [threshold, setThreshold] = useState(30)
  const [logs, setLogs] = useState<string[]>(["Awaiting user initiation..."])
  const [isExtracting, setIsExtracting] = useState(false)
  const [showFrameSelection, setShowFrameSelection] = useState(false)
  const [extractedFrames, setExtractedFrames] = useState<{ id: string; timestamp: string }[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  const videoFormats = formats.filter((f) => f.height)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsExtracting(true)

    const steps = [
      { delay: 300, msg: `Starting ${mode} extraction...` },
      { delay: 700, msg: `Mode: ${mode}, Max frames: ${maxFrames}` },
      { delay: 1200, msg: "Downloading source stream..." },
      { delay: 2000, msg: "Decoding video frames..." },
      { delay: 2800, msg: mode === "smart" ? "Running scene detection algorithm..." : "Sampling frames..." },
      { delay: 3600, msg: `Extracted ${maxFrames} keyframes.` },
      { delay: 4000, msg: "Done. Redirecting to frame selection..." },
    ]

    steps.forEach(({ delay, msg }) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
      }, delay)
    })

    setTimeout(() => {
      setIsExtracting(false)
      const frames = Array.from({ length: maxFrames }, (_, i) => {
        const sec = Math.round((i / maxFrames) * 213)
        const mm = String(Math.floor(sec / 60)).padStart(2, "0")
        const ss = String(sec % 60).padStart(2, "0")
        return {
          id: `frame_${String(i + 1).padStart(4, "0")}`,
          timestamp: `${mm}:${ss}`,
        }
      })
      setExtractedFrames(frames)
      setShowFrameSelection(true)
    }, 4500)
  }

  if (showFrameSelection) {
    return (
      <FrameSelection
        videoTitle="Current Video"
        frames={extractedFrames}
        onBack={() => {
          setShowFrameSelection(false)
          setLogs(["Awaiting user initiation..."])
        }}
      />
    )
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
            <select className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none">
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
              className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="smart">Smart Detect (First Frame of Each Cut)</option>
              <option value="equally_spaced">Evenly Spaced</option>
              <option value="interval">Time Interval</option>
              <option value="scene_split">Scene Split (Video Clips)</option>
            </select>
          </div>

          {mode !== "scene_split" && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  Max Frames
                </label>
                <span className="text-primary font-bold text-sm">{maxFrames}</span>
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
                <span className="text-primary font-bold text-sm">{interval}s</span>
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

          {(mode === "smart" || mode === "scene_split") && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {mode === "scene_split" ? "Sensitivity" : "Cut Sensitivity"}
                </label>
                <span className="text-primary font-bold text-sm">{threshold}%</span>
              </div>
              <input
                type="range"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                min={10}
                max={80}
              />
              {mode === "smart" && (
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Fewer cuts</span>
                  <span>Every cut</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isExtracting}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isExtracting
              ? "Extracting..."
              : mode === "scene_split"
                ? "Begin Scene Split"
                : "Initiate Batch Extraction"}
          </button>
        </form>
      </div>

      <div className="glass-card p-5 text-left flex flex-col">
        <h3 className="font-display font-semibold uppercase tracking-wide text-base text-foreground mb-4">
          Live Execution
        </h3>
        <div className="log-viewer flex-1 min-h-[280px]" ref={logRef}>
          {logs.map((log, i) => (
            <div key={i} className={i === 0 ? "opacity-30" : ""}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
