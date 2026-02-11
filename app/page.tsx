"use client"

import { useState } from "react"
import { PageTabs } from "@/components/page-tabs"
import { HeroLanding } from "@/components/hero-landing"
import { VideoResults } from "@/components/video-results"
import { UploadTab } from "@/components/upload-tab"
import { ChannelTab } from "@/components/channel-tab"
import type { VideoInfo } from "@/lib/types"

// Demo data to simulate a video analysis result
const MOCK_VIDEO: VideoInfo = {
  id: "dQw4w9WgXcQ",
  title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  duration_string: "3:33",
  tags: ["rick astley", "never gonna give you up", "music video", "80s", "pop", "classic"],
  formats: [
    { format_id: "137", ext: "mp4", resolution: "1920x1080", height: 1080, width: 1920, fps: 30, filesize: 52428800, filesize_approx: null, abr: null },
    { format_id: "136", ext: "mp4", resolution: "1280x720", height: 720, width: 1280, fps: 30, filesize: 31457280, filesize_approx: null, abr: null },
    { format_id: "135", ext: "mp4", resolution: "854x480", height: 480, width: 854, fps: 30, filesize: 15728640, filesize_approx: null, abr: null },
    { format_id: "134", ext: "mp4", resolution: "640x360", height: 360, width: 640, fps: 30, filesize: 8388608, filesize_approx: null, abr: null },
    { format_id: "133", ext: "mp4", resolution: "426x240", height: 240, width: 426, fps: 30, filesize: 4194304, filesize_approx: null, abr: null },
    { format_id: "313", ext: "webm", resolution: "3840x2160", height: 2160, width: 3840, fps: 30, filesize: 157286400, filesize_approx: null, abr: null },
    { format_id: "271", ext: "webm", resolution: "2560x1440", height: 1440, width: 2560, fps: 30, filesize: 94371840, filesize_approx: null, abr: null },
    { format_id: "140", ext: "m4a", resolution: "audio only", height: null, width: null, fps: null, filesize: 3407872, filesize_approx: null, abr: 128 },
    { format_id: "251", ext: "webm", resolution: "audio only", height: null, width: null, fps: null, filesize: 3932160, filesize_approx: null, abr: 160 },
    { format_id: "249", ext: "webm", resolution: "audio only", height: null, width: null, fps: null, filesize: 1966080, filesize_approx: null, abr: 50 },
  ],
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("url-extraction")
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [submittedUrl, setSubmittedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = (url: string) => {
    setIsLoading(true)
    setSubmittedUrl(url)
    // Simulate API call
    setTimeout(() => {
      setVideoInfo(MOCK_VIDEO)
      setIsLoading(false)
    }, 1500)
  }

  const handleReset = () => {
    setVideoInfo(null)
    setSubmittedUrl("")
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Yippr ASCII Logo - persistent across all tabs */}
        <pre className="font-mono text-primary leading-tight text-[0.6rem] md:text-xs tracking-wider select-none mb-5">
{`░█░█░▀█▀░█▀█░█▀█░█▀▄
░░█░░░█░░█▀▀░█▀▀░█▀▄
░░▀░░▀▀▀░▀░░░▀░░░▀░▀`}
        </pre>

        <PageTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); handleReset() }} />

        {activeTab === "url-extraction" && (
          <>
            {!videoInfo && !isLoading && (
              <HeroLanding onSubmit={handleAnalyze} isLoading={isLoading} />
            )}

            {isLoading && (
              <HeroLanding onSubmit={handleAnalyze} isLoading={isLoading} />
            )}

            {videoInfo && !isLoading && (
              <>
                <div className="max-w-[1100px] mx-auto mb-4">
                  <button
                    onClick={handleReset}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <span>{"<-"}</span> Analyze another video
                  </button>
                </div>
                <VideoResults video={videoInfo} submittedUrl={submittedUrl} />
              </>
            )}
          </>
        )}

        {activeTab === "upload-videos" && <UploadTab />}

        {activeTab === "channel-bulk" && <ChannelTab />}
      </div>
    </main>
  )
}
