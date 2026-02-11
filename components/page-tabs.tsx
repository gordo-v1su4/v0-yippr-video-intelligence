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
    <nav className="flex gap-1 border-b border-border pb-0 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors rounded-t-md border-b-2",
            activeTab === tab.id
              ? "text-primary border-primary bg-primary/5"
              : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
