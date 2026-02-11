"use client"

import { useState } from "react"
import type { VideoInfo } from "@/lib/types"
import { VideoHeader } from "@/components/video-header"
import { WorkTabs } from "@/components/work-tabs"
import { VideoFormatsTable } from "@/components/video-formats-table"
import { AudioTab } from "@/components/audio-tab"
import { KeyframeTab } from "@/components/keyframe-tab"

interface VideoResultsProps {
  video: VideoInfo
  submittedUrl: string
}

export function VideoResults({ video, submittedUrl }: VideoResultsProps) {
  const [workTab, setWorkTab] = useState("video-assets")

  return (
    <div className="animate-fade-in">
      <VideoHeader video={video} />
      <WorkTabs activeTab={workTab} onTabChange={setWorkTab} />

      {workTab === "video-assets" && (
        <VideoFormatsTable
          formats={video.formats}
          video={video}
          submittedUrl={submittedUrl}
        />
      )}

      {workTab === "audio-assets" && <AudioTab formats={video.formats} />}

      {workTab === "keyframe-assets" && (
        <KeyframeTab formats={video.formats} />
      )}
    </div>
  )
}
