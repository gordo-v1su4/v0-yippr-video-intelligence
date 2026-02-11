"use client"

import React, { useState, useRef, useCallback } from "react"
import { UploadCloud, Video, X, ShieldCheck, Info, Settings, Play, Activity } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
}

interface ProcessedVideo {
  id: string
  filename: string
  width: number
  height: number
  duration: number
  fileSize: number
}

type ExtractionMode = "smart" | "equally_spaced" | "interval" | "scene_split"
type UploadStep = "upload" | "process" | "results"

export function UploadTab() {
  const [step, setStep] = useState<UploadStep>("upload")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragover, setDragover] = useState(false)
  const [processedVideos, setProcessedVideos] = useState<ProcessedVideo[]>([])
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>("equally_spaced")
  const [maxFrames, setMaxFrames] = useState(30)
  const [threshold, setThreshold] = useState(30)
  const [logs, setLogs] = useState<string[]>(["Ready to start..."])
  const [isExtracting, setIsExtracting] = useState(false)
  const [resultFrames, setResultFrames] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragover(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragover(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragover(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("video/"))
    addFiles(droppedFiles)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type.startsWith("video/"))
      addFiles(selected)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const mapped: UploadedFile[] = newFiles.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      name: f.name,
      size: f.size,
    }))
    setFiles(prev => [...prev, ...mapped])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const clearFiles = () => {
    setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleProcess = () => {
    // Simulate processing to get video metadata
    const processed: ProcessedVideo[] = files.map(f => ({
      id: f.id,
      filename: f.name,
      width: 1920,
      height: 1080,
      duration: 30 + Math.random() * 120,
      fileSize: f.size,
    }))
    setProcessedVideos(processed)
    setSelectedVideos(new Set(processed.map(v => v.id)))
    setStep("process")
  }

  const toggleVideo = (id: string) => {
    setSelectedVideos(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelectedVideos(new Set(processedVideos.map(v => v.id)))
  const selectNone = () => setSelectedVideos(new Set())

  const handleExtract = () => {
    if (selectedVideos.size === 0) return
    setIsExtracting(true)
    setLogs(["Initializing extraction..."])

    const intervals = [
      { delay: 400, msg: `Mode: ${extractionMode}, Max frames: ${maxFrames}` },
      { delay: 900, msg: "Downloading source streams..." },
      { delay: 1500, msg: "Decoding video frames..." },
      { delay: 2200, msg: "Running scene detection algorithm..." },
      { delay: 3000, msg: `Extracted ${maxFrames} keyframes successfully.` },
      { delay: 3500, msg: "Packaging results..." },
    ]

    intervals.forEach(({ delay, msg }) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
      }, delay)
    })

    setTimeout(() => {
      setIsExtracting(false)
      // Generate mock frame results
      const frames = Array.from({ length: maxFrames }, (_, i) => `frame_${String(i + 1).padStart(4, "0")}`)
      setResultFrames(frames)
      setStep("results")
    }, 4000)
  }

  // Step 1: Upload
  if (step === "upload") {
    return (
      <div className="animate-fade-in">
        <div className="mb-4">
          <h1 className="font-display font-bold uppercase tracking-tight text-2xl gradient-title mb-1">
            Upload Videos
          </h1>
          <p className="font-jetbrains tracking-[0.12em] text-[0.7rem] uppercase text-muted-foreground">
            Drop local files. Extract every frame.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div
              className={`upload-area mb-4 ${dragover ? "dragover" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
            >
              <UploadCloud className="w-12 h-12 text-primary mx-auto mb-3" />
              <h4 className="text-lg font-medium text-foreground mb-2">{"Drag & Drop Videos Here"}</h4>
              <p className="text-muted-foreground text-sm">Supports MP4, MOV, AVI, MKV, WEBM</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*"
                className="hidden"
                onChange={handleFileInput}
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                className="mt-4 bg-transparent text-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary transition-colors"
              >
                Browse Files
              </button>
            </div>

            {files.length > 0 && (
              <div className="glass-card p-4 animate-fade-in">
                <h5 className="text-base font-medium text-foreground mb-3">Selected Files</h5>
                <div className="flex flex-col gap-2">
                  {files.map(f => (
                    <div key={f.id} className="glass-card p-2 flex justify-between items-center">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Video className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate text-foreground normal-case">{f.name}</span>
                        <span className="text-[0.65rem] text-muted-foreground flex-shrink-0">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(f.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={clearFiles}
                    className="bg-transparent text-foreground border border-border px-3 py-1.5 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleProcess}
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Process Videos
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-[18px] h-[18px] text-primary" />
                <h5 className="text-base font-medium text-foreground">Requirements</h5>
              </div>
              <div className="mb-3">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground block mb-2 uppercase">
                  Max File Size
                </label>
                <span className="badge-modern badge-sd">50MB per file</span>
              </div>
              <div className="mb-4">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground block mb-2 uppercase">
                  Accepted Formats
                </label>
                <div className="flex flex-wrap gap-1">
                  {["MP4", "MOV", "AVI", "MKV"].map(fmt => (
                    <span key={fmt} className="badge-modern badge-sd">{fmt}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-md border border-border bg-transparent text-sm text-muted-foreground flex items-start gap-2 normal-case">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Processing time depends on video duration and frame selection.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Process Settings
  if (step === "process") {
    return (
      <div className="animate-fade-in">
        <div className="mb-4">
          <h1 className="font-display font-bold uppercase tracking-tight text-2xl gradient-title mb-1">
            Process Uploads
          </h1>
          <p className="font-jetbrains tracking-[0.12em] text-[0.7rem] uppercase text-muted-foreground">
            Configure extraction settings for your files.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-foreground">Files to Process</h3>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors">All</button>
                  <button onClick={selectNone} className="bg-transparent text-foreground border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary hover:border-primary transition-colors">None</button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {processedVideos.map(v => (
                  <div key={v.id} className="glass-card p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedVideos.has(v.id)}
                        onChange={() => toggleVideo(v.id)}
                        className="w-5 h-5 rounded accent-primary cursor-pointer flex-shrink-0"
                        id={`vid-${v.id}`}
                      />
                      <div className="flex-grow overflow-hidden">
                        <label htmlFor={`vid-${v.id}`} className="font-medium text-foreground block truncate mb-1 cursor-pointer normal-case">
                          {v.filename}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge-modern badge-sd text-[0.6rem]">{v.width}x{v.height}</span>
                          <span className="badge-modern badge-sd text-[0.6rem]">{v.duration.toFixed(1)}s</span>
                          <span className="badge-modern badge-sd text-[0.6rem]">{(v.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="glass-card p-4 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-[18px] h-[18px] text-primary" />
                <h3 className="text-lg font-medium text-foreground">Settings</h3>
              </div>

              <div className="mb-4">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground block mb-2 uppercase">
                  Detection Mode
                </label>
                <select
                  value={extractionMode}
                  onChange={(e) => setExtractionMode(e.target.value as ExtractionMode)}
                  className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                >
                  <option value="smart">Smart (Scene Detection)</option>
                  <option value="equally_spaced">Equally Spaced</option>
                  <option value="interval">Time Interval</option>
                  <option value="scene_split">Scene Split (Video Clips)</option>
                </select>
              </div>

              {extractionMode !== "scene_split" && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">Max Frames</label>
                    <span className="text-primary font-bold text-sm">{maxFrames}</span>
                  </div>
                  <input
                    type="range"
                    value={maxFrames}
                    onChange={(e) => setMaxFrames(Number(e.target.value))}
                    min={5}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              {(extractionMode === "smart" || extractionMode === "scene_split") && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">Sensitivity</label>
                    <span className="text-primary font-bold text-sm">{threshold}%</span>
                  </div>
                  <input
                    type="range"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    min={10}
                    max={80}
                  />
                </div>
              )}

              <button
                onClick={handleExtract}
                disabled={selectedVideos.size === 0 || isExtracting}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isExtracting ? "Extracting..." : extractionMode === "scene_split" ? "Begin Scene Split" : "Begin Extraction"}
              </button>

              <div className="mt-4">
                <label className="font-jetbrains text-[0.65rem] tracking-[0.08em] text-muted-foreground flex items-center gap-2 mb-2 uppercase">
                  <Activity className="w-3.5 h-3.5" />
                  System Logs
                </label>
                <div className="log-viewer" style={{ height: "150px" }}>
                  {logs.map((log, i) => (
                    <div key={i} className={i === 0 ? "opacity-30" : ""}>{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Results
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-display font-bold uppercase tracking-tight text-2xl gradient-title mb-1">
            Extraction Results
          </h1>
          <p className="font-jetbrains tracking-[0.12em] text-[0.7rem] uppercase text-muted-foreground">
            Keyframe batches for your uploaded videos.
          </p>
        </div>
        <button
          onClick={() => { setStep("upload"); setFiles([]); setProcessedVideos([]); setResultFrames([]) }}
          className="bg-transparent text-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary transition-colors"
        >
          Upload More
        </button>
      </div>

      {processedVideos.filter(v => selectedVideos.has(v.id)).map(v => (
        <div key={v.id} className="glass-card p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2 normal-case">{v.filename}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="badge-modern badge-hd">{resultFrames.length} Shots</span>
                <span className="badge-modern badge-sd">{v.duration.toFixed(1)}s</span>
                <span className="badge-modern badge-sd">{v.width}x{v.height}</span>
              </div>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
              Download ZIP
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {resultFrames.map((frame) => (
              <div key={frame} className="relative rounded-md overflow-hidden aspect-video bg-secondary group cursor-pointer border border-border hover:border-primary transition-colors">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs font-jetbrains">{frame}</span>
                </div>
                <div className="absolute bottom-0 right-0 m-1">
                  <span className="bg-background/75 text-foreground text-[0.6rem] px-1.5 py-0.5 rounded font-jetbrains">
                    #{frame.split("_")[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
