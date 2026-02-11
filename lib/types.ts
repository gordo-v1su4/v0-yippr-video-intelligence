export interface VideoFormat {
  format_id: string
  ext: string
  resolution: string
  height: number | null
  width: number | null
  fps: number | null
  filesize: number | null
  filesize_approx: number | null
  abr: number | null
}

export interface VideoInfo {
  id: string
  title: string
  thumbnail: string | null
  duration_string: string
  tags: string[]
  formats: VideoFormat[]
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "--"
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
