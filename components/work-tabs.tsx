"use client"

import { Video, Music, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "video-assets", label: "Video Formats", icon: Video },
  { id: "audio-assets", label: "Audio Only", icon: Music },
  { id: "keyframe-assets", label: "Extract Keyframes", icon: Maximize },
]

export function WorkTabs({ activeTab, onTabChange }: WorkTabsProps) {
  return (
    <div className="glass-card p-1 flex gap-1 mb-3 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <tab.icon className="w-3.5 h-3.5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
