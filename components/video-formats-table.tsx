"use client"

import { useState, useRef, useEffect } from "react"
import { Download, X } from "lucide-react"
import type { VideoFormat, VideoInfo } from "@/lib/types"
import { formatFileSize } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VideoFormatsTableProps {
  formats: VideoFormat[]
  video: VideoInfo
  submittedUrl: string
}

export function VideoFormatsTable({
  formats,
  video,
  submittedUrl,
}: VideoFormatsTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const videoFormats = formats.filter(
    (f) => f.resolution !== "audio only" && f.height
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left pl-5 py-3 font-jetbrains text-[0.65rem] tracking-[0.08em] font-medium uppercase">
                Resolution
              </th>
              <th className="text-left py-3 font-jetbrains text-[0.65rem] tracking-[0.08em] font-medium uppercase">
                Format
              </th>
              <th className="text-left py-3 font-jetbrains text-[0.65rem] tracking-[0.08em] font-medium uppercase">
                Size
              </th>
              <th className="text-left py-3 font-jetbrains text-[0.65rem] tracking-[0.08em] font-medium uppercase">
                FPS
              </th>
              <th className="text-right pr-5 py-3 font-jetbrains text-[0.65rem] tracking-[0.08em] font-medium uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {videoFormats.map((f) => (
              <tr
                key={f.format_id}
                className="border-b border-border/50 hover:bg-accent/30 transition-colors"
              >
                <td className="text-left pl-5 py-3">
                  <span
                    className={cn(
                      "text-[0.7rem] px-2.5 py-1 rounded-full font-jetbrains tracking-wider font-medium",
                      f.height && f.height >= 720
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {f.height}p
                  </span>
                </td>
                <td className="text-left py-3">
                  <span className="text-foreground font-medium">
                    {f.ext.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2 opacity-50">
                    {f.format_id}
                  </span>
                </td>
                <td className="text-left py-3 text-sm text-muted-foreground">
                  {formatFileSize(f.filesize || f.filesize_approx)}
                </td>
                <td className="text-left py-3 text-sm text-muted-foreground">
                  {f.fps || "--"}
                </td>
                <td className="text-right pr-5 py-3 relative" ref={openDropdown === f.format_id ? dropdownRef : null}>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === f.format_id ? null : f.format_id
                      )
                    }
                    className="bg-secondary text-secondary-foreground p-2 rounded-md hover:bg-accent transition-colors"
                    aria-label={`Download ${f.height}p ${f.ext}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {openDropdown === f.format_id && (
                    <div className="glass-card p-4 mt-2 text-left absolute right-0 w-[320px] z-50 border-primary/50 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase font-bold">
                          Time Bundle (Optional)
                        </span>
                        <button
                          onClick={() => setOpenDropdown(null)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1">
                          <small className="text-muted-foreground block mb-1 text-xs">
                            Start
                          </small>
                          <input
                            type="text"
                            placeholder="00:00"
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <small className="text-muted-foreground block mb-1 text-xs">
                            End
                          </small>
                          <input
                            type="text"
                            placeholder={video.duration_string}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity">
                        Download Segment
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
