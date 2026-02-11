"use client"

import { useState } from "react"
import { Music } from "lucide-react"
import type { VideoFormat } from "@/lib/types"

interface AudioTabProps {
  formats: VideoFormat[]
}

export function AudioTab({ formats }: AudioTabProps) {
  const [mp3Mode, setMp3Mode] = useState(false)

  const audioFormats = formats.filter((f) => f.resolution === "audio only")

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold uppercase tracking-wide text-lg text-foreground">
          Audio Streams
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <span className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground font-medium uppercase">
            Convert to MP3
          </span>
          <div
            className="toggle-track"
            data-checked={mp3Mode}
            onClick={() => setMp3Mode(!mp3Mode)}
            role="switch"
            aria-checked={mp3Mode}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setMp3Mode(!mp3Mode)
              }
            }}
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {audioFormats.map((f) => (
              <tr
                key={f.format_id}
                className="border-b border-border/50 hover:bg-accent/30 transition-colors"
              >
                <td className="text-left pl-3 py-3">
                    <span className="text-[0.7rem] px-2.5 py-1 bg-secondary text-secondary-foreground font-jetbrains tracking-wider font-medium">
                    {mp3Mode ? "MP3" : f.ext.toUpperCase()}
                  </span>
                </td>
                <td className="text-left py-3 text-sm text-muted-foreground">
                  {f.abr || "--"} kbps bitrate
                </td>
                <td className="text-right pr-3 py-3">
                  <button
                    className="bg-secondary text-secondary-foreground p-2 rounded-md hover:bg-accent transition-colors"
                    aria-label={`Download audio ${f.ext}`}
                  >
                    <Music className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {audioFormats.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  No audio streams available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
