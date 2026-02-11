import { Clock, Layers } from "lucide-react"
import type { VideoInfo } from "@/lib/types"

interface VideoHeaderProps {
  video: VideoInfo
}

export function VideoHeader({ video }: VideoHeaderProps) {
  return (
    <div className="glass-card p-4 mb-3 animate-fade-in">
      <div className="flex gap-4 items-start flex-col sm:flex-row">
        {video.thumbnail && (
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={`Thumbnail for ${video.title}`}
            className="rounded-md flex-shrink-0 w-full sm:w-[220px] h-auto sm:h-[124px] object-cover"
            crossOrigin="anonymous"
          />
        )}
        <div className="text-left flex-grow">
          <h2 className="text-lg font-bold text-foreground mb-2 text-balance">
            {video.title}
          </h2>
          <div className="flex flex-wrap gap-4 mb-2">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Duration:{" "}
              <strong className="text-foreground">
                {video.duration_string}
              </strong>
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Video ID:{" "}
              <strong className="text-foreground">{video.id}</strong>
            </span>
          </div>
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {video.tags.slice(0, 10).map((tag) => (
                <span
                  key={tag}
                  className="text-[0.65rem] px-2 py-0.5 bg-secondary text-secondary-foreground font-jetbrains uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
