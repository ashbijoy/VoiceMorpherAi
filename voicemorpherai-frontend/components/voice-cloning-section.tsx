
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Play, Square, Mic, StopCircle } from "lucide-react"

export function VoiceCloningSection() {
  const [text, setText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunks = useRef<Blob[]>([])
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      recordedChunks.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) recordedChunks.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (err) {
      console.error("Recording error:", err)
      toast({ title: "Mic access denied", description: "Check your mic permissions", variant: "destructive" })
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleClone = async () => {
    if (!text.trim()) {
      toast({ title: "Text required", description: "Please enter text to clone", variant: "destructive" })
      return
    }

    if (recordedChunks.current.length === 0) {
      toast({ title: "No audio recorded", description: "Please record your voice first", variant: "destructive" })
      return
    }

    const audioBlob = new Blob(recordedChunks.current, { type: "audio/wav" })
    const formData = new FormData()
    formData.append("text", text)
    formData.append("audio", audioBlob, "recorded.wav")

    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clone`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) throw new Error("Failed to clone voice")

      const audioData = await response.blob()
      const url = URL.createObjectURL(audioData)
      const audio = new Audio(url)
      await audio.play()

      toast({ title: "Voice cloned!", description: "Playing the generated speech" })
    } catch (err) {
      console.error("Voice clone error:", err)
      toast({ title: "Playback error", description: "Failed to play cloned voice", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Voice Cloning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Text to speak</Label>
          <Textarea
            placeholder="Type something to say with your cloned voice"
            value={text}
            onChange={e => setText(e.target.value)}
            className="min-h-[100px] resize-none text-base"
            maxLength={1000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Maximum 1000 characters</span>
            <span>{text.length}/1000</span>
          </div>
        </div>

        <div className="flex gap-3">
          {!isRecording ? (
            <Button onClick={startRecording} className="flex-1 h-12">
              <Mic className="w-4 h-4 mr-2" /> Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} className="flex-1 h-12" variant="destructive">
              <StopCircle className="w-4 h-4 mr-2" /> Stop Recording
            </Button>
          )}

          <Button onClick={handleClone} className="flex-1 h-12" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Clone & Play
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
