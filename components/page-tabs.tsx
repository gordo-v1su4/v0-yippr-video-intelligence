"use client"

import { cn } from "@/lib/utils"

interface PageTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "url-extraction", label: "URL Extraction" },
  { id: "upload-videos", label: "Upload Videos" },
  { id: "channel-bulk", label: "Channel Bulk" },
]

export function PageTabs({ activeTab, onTabChange }: PageTabsProps) {
  return (
    <nav className="flex gap-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 font-jetbrains text-[0.7rem] font-medium tracking-[0.1em] uppercase rounded-md border transition-all",
            activeTab === tab.id
              ? "text-primary bg-secondary border-border"
              : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
