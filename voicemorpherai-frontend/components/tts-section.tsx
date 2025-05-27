"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceCloningSection() {
  const [text, setText] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const handleClone = async () => {
    if (!audioFile || !text.trim()) {
      toast({
        title: "Missing Input",
        description: "Please upload audio and enter text.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("audio", audioFile)
    formData.append("text", text)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clone`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to clone voice")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)

      await audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)

      toast({
        title: "Cloning Successful",
        description: "Playing the cloned voice."
      })
    } catch (error) {
      console.error("Clone error:", error)
      toast({
        title: "Clone Error",
        description: "Something went wrong.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          Voice Cloning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Upload Reference Audio (.wav preferred)
          </Label>
          <input
            type="file"
            id="file-upload"
            accept="audio/wav,audio/mp3"
            onChange={handleFileUpload}
            className="block w-full border p-2 rounded-md bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-input" className="text-sm font-medium">
            Text to Clone
          </Label>
          <Textarea
            id="text-input"
            placeholder="Type the message you want spoken in the cloned voice..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] resize-none text-base"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleClone}
            disabled={isLoading || !audioFile || !text.trim()}
            className="flex-1 h-12 text-base font-medium"
          >
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