"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Play, Square, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Voice {
  id: string
  name: string
  gender: string
  accent: string
  description: string
}

const voices: Voice[] = [
  {
    id: "maya",
    name: "Maya",
    gender: "Female",
    accent: "Indian",
    description: "Warm and professional Indian female voice",
  },
  {
    id: "meera",
    name: "Meera",
    gender: "Female",
    accent: "British",
    description: "Elegant and calm British female voice",
  },
  {
    id: "melody",
    name: "Melody",
    gender: "Female",
    accent: "American",
    description: "Friendly and clear American voice",
  },
  {
    id: "mia",
    name: "Mia",
    gender: "Female",
    accent: "Australian",
    description: "Bright and energetic Aussie voice",
  },
  {
    id: "marie",
    name: "Marie",
    gender: "Female",
    accent: "French-Canadian",
    description: "Smooth and soft French-English voice",
  },
];

export function TTSSection() {
  const [text, setText] = useState("")
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePlay = async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add text to convert to speech",
        variant: "destructive",
      });
      return;
    }
  
    if (!selectedVoice) {
      toast({
        title: "Please select a voice",
        description: "Choose Maya or Manu to continue",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch (`${process.env.NEXT_PUBLIC_BACKEND_URL}/tts`,{ 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });
  
      if (!response.ok) throw new Error("Failed to generate speech");
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
  
      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
  
      toast({
        title: "Speech Generated!",
        description: `Playing with ${voices.find((v) => v.id === selectedVoice)?.name} voice`,
      });
  
      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Playback error:", error);
      toast({
        title: "Playback Error",
        description: "Something went wrong while playing the audio",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    setIsPlaying(false)
  }

  const selectedVoiceData = voices.find((v) => v.id === selectedVoice)

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Generate Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="text-input" className="text-sm font-medium">
            Enter your text
          </Label>
          <Textarea
            id="text-input"
            placeholder="Type or paste your text here... (e.g., 'Hello, welcome to VoiceMorpherAI!')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none text-base"
            maxLength={1000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Maximum 1000 characters</span>
            <span>{text.length}/1000</span>
          </div>
        </div>

        {/* Voice and Accent Selection */}
        <div className="space-y-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {voice.gender} • {voice.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Voice Preview */}
        {selectedVoiceData && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedVoiceData.name[0]}
              </div>
              <div>
                <p className="font-medium">{selectedVoiceData.name}</p>
                <p className="text-sm text-muted-foreground">{selectedVoiceData.gender}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handlePlay}
            disabled={isLoading || isPlaying}
            className="flex-1 h-12 text-base font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : isPlaying ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Playing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Speech
              </>
            )}
          </Button>

          {isPlaying && (
            <Button onClick={handleStop} variant="outline" size="lg" className="h-12">
              <Square className="w-4 h-4" />
            </Button>
          )}

          <Button variant="outline" size="lg" className="h-12" disabled={!text.trim() || !selectedVoice}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
