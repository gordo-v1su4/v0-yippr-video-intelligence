"use client"

import React, { useState, useCallback } from "react"
import { Search, Info, Zap, Download, Loader2 } from "lucide-react"

interface ChannelVideo {
  id: string
  title: string
  thumbnail: string
  duration_string: string
  resolution: string
  upload_date: string
  best_format_id: string
  ext: string
  duration: number
}

type TimeRangeMode = "full" | "first_5" | "random_5" | "smart_transcript" | "custom"

const MOCK_CHANNEL_VIDEOS: ChannelVideo[] = [
  { id: "v1", title: "Best Camera Settings for 2025", thumbnail: "https://picsum.photos/seed/ch1/400/225", duration_string: "12:34", resolution: "1080p", upload_date: "Jan 15, 2025", best_format_id: "137", ext: "mp4", duration: 754 },
  { id: "v2", title: "iPhone vs Android - The Truth", thumbnail: "https://picsum.photos/seed/ch2/400/225", duration_string: "18:22", resolution: "4K", upload_date: "Jan 12, 2025", best_format_id: "313", ext: "webm", duration: 1102 },
  { id: "v3", title: "My Studio Tour 2025", thumbnail: "https://picsum.photos/seed/ch3/400/225", duration_string: "8:45", resolution: "1080p", upload_date: "Jan 8, 2025", best_format_id: "137", ext: "mp4", duration: 525 },
  { id: "v4", title: "Reviewing Every Laptop in 2025", thumbnail: "https://picsum.photos/seed/ch4/400/225", duration_string: "24:10", resolution: "4K", upload_date: "Jan 5, 2025", best_format_id: "313", ext: "webm", duration: 1450 },
  { id: "v5", title: "The Best Wireless Earbuds", thumbnail: "https://picsum.photos/seed/ch5/400/225", duration_string: "15:33", resolution: "1080p", upload_date: "Jan 2, 2025", best_format_id: "137", ext: "mp4", duration: 933 },
  { id: "v6", title: "Unboxing the New Galaxy S25", thumbnail: "https://picsum.photos/seed/ch6/400/225", duration_string: "10:12", resolution: "4K", upload_date: "Dec 30, 2024", best_format_id: "313", ext: "webm", duration: 612 },
  { id: "v7", title: "Tech Predictions That Were Wrong", thumbnail: "https://picsum.photos/seed/ch7/400/225", duration_string: "20:45", resolution: "1080p", upload_date: "Dec 28, 2024", best_format_id: "137", ext: "mp4", duration: 1245 },
  { id: "v8", title: "The Perfect Desk Setup Guide", thumbnail: "https://picsum.photos/seed/ch8/400/225", duration_string: "14:20", resolution: "4K", upload_date: "Dec 25, 2024", best_format_id: "313", ext: "webm", duration: 860 },
]

export function ChannelTab() {
  const [channelUrl, setChannelUrl] = useState("")
  const [videos, setVideos] = useState<ChannelVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [timeRangeMode, setTimeRangeMode] = useState<TimeRangeMode>("full")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleFetch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!channelUrl.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setVideos(MOCK_CHANNEL_VIDEOS)
      setIsLoading(false)
    }, 1500)
  }, [channelUrl])

  const toggleVideo = (id: string) => {
    setSelectedVideos(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelectedVideos(new Set(videos.map(v => v.id)))
  const deselectAll = () => setSelectedVideos(new Set())

  const handleBulkDownload = () => {
    if (selectedVideos.size === 0) return
    setIsDownloading(true)
    setTimeout(() => setIsDownloading(false), 2000)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold uppercase tracking-tight text-2xl gradient-title mb-1">
            Channel Bulk
          </h1>
          {isDownloading && (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          )}
        </div>
        <p className="text-[0.7rem] text-muted-foreground">
          Analyze and rip multiple videos from any creator.
        </p>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-4">
        <form onSubmit={handleFetch}>
          <div className="flex bg-input p-1 border border-border transition-colors focus-within:border-primary">
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Enter YouTube Channel URL or @handle (e.g., @mkbhd)"
              required
              className="flex-1 bg-transparent border-none text-foreground px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground border-none px-5 py-2 text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Fetch</span>
            </button>
          </div>
        </form>
      </div>

      {/* Empty state cards */}
      {videos.length === 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-4">
            <h4 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Quick Guide
            </h4>
            <ul className="text-muted-foreground text-sm flex flex-col gap-2 normal-case">
              <li>Paste channel URL or just the @handle</li>
              <li>Analyzes the latest 12 video uploads</li>
              <li>Automatic best-quality selection</li>
            </ul>
          </div>
          <div className="glass-card p-4">
            <h4 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Smart Features
            </h4>
            <p className="text-muted-foreground text-sm normal-case">
              Use <strong className="text-foreground">Smart Transcript</strong> mode to find engageable segments automatically via transcript analysis.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {videos.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-foreground">Latest Uploads ({videos.length})</h3>
            <div className="flex gap-2">
              <button onClick={selectAll} className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors">Select All</button>
              <button onClick={deselectAll} className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors">Deselect</button>
            </div>
          </div>

          {/* Bulk settings */}
          <div className="glass-card p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground font-bold block mb-2 uppercase">
                  Time Range Mode
                </label>
                <select
                  value={timeRangeMode}
                  onChange={(e) => setTimeRangeMode(e.target.value as TimeRangeMode)}
                  className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                >
                  <option value="full">Full Video</option>
                  <option value="first_5">First 5 Minutes</option>
                  <option value="random_5">Random 5 Minutes</option>
                  <option value="smart_transcript">Smart (Transcript)</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {timeRangeMode === "custom" && (
                <div className="flex-1">
                  <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground font-bold block mb-2 uppercase">
                    Custom Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      placeholder="00:00"
                      className="flex-1 bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="text"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      placeholder="05:00"
                      className="flex-1 bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleBulkDownload}
                disabled={selectedVideos.size === 0}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Selected
              </button>
              <span className="text-sm text-muted-foreground">
                {selectedVideos.size} video{selectedVideos.size !== 1 ? "s" : ""} selected
              </span>
            </div>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {videos.map(video => (
              <div key={video.id} className="glass-card p-2 relative">
                <div className="relative mb-2">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="rounded-md w-full h-[150px] object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-0 left-0 m-2">
                    <input
                      type="checkbox"
                      checked={selectedVideos.has(video.id)}
                      onChange={() => toggleVideo(video.id)}
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 m-2">
                    <span className="bg-background/75 text-foreground text-xs px-2 py-0.5 rounded font-jetbrains">
                      {video.duration_string}
                    </span>
                  </div>
                </div>
                <div className="px-1">
                  <label
                    className="text-sm font-medium text-foreground block truncate mb-1 cursor-pointer normal-case"
                    onClick={() => toggleVideo(video.id)}
                  >
                    {video.title}
                  </label>
                  <div className="flex justify-between items-center">
                    <span className="badge-modern badge-hd text-[0.6rem]">{video.resolution}</span>
                    <span className="text-muted-foreground text-[0.6rem]">{video.upload_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
