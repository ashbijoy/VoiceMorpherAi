"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type CloneStep = "upload" | "processing" | "ready" | "generating"

export function VoiceCloningSection() {
  const [step, setStep] = useState<CloneStep>("upload")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [text, setText] = useState("")
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)

    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 30) {
          stopRecording()
          clearInterval(interval)
          return 30
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingTime >= 5) {
      processVoice()
    } else {
      toast({
        title: "Recording too short",
        description: "Please record at least 5 seconds for better voice cloning",
        variant: "destructive",
      })
      setRecordingTime(0)
    }
  }

  const processVoice = () => {
    setStep("processing")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep("ready")
          toast({
            title: "Voice cloned successfully!",
            description: "Your voice has been processed and is ready to use",
          })
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const generateSpeech = () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add text to generate speech with your cloned voice",
        variant: "destructive",
      })
      return
    }

    setStep("generating")

    setTimeout(() => {
      setIsPlaying(true)
      toast({
        title: "Speech generated!",
        description: "Playing with your cloned voice",
      })

      setTimeout(() => {
        setIsPlaying(false)
        setStep("ready")
      }, 3000)
    }, 2000)
  }

  const resetCloning = () => {
    setStep("upload")
    setRecordingTime(0)
    setText("")
    setProgress(0)
    setIsPlaying(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Clone Your Voice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Voice Upload/Recording */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Record Your Voice Sample</h3>
                <p className="text-muted-foreground">Record at least 10 seconds of clear speech for the best results</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="lg"
                  className={`h-16 px-8 text-lg font-medium transition-all duration-200 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording ({30 - recordingTime}s)
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {recordingTime > 0 && !isRecording && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Recorded: {recordingTime} seconds</p>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">Or upload an audio file (MP3, WAV, M4A)</p>
                <Button variant="outline" className="mt-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio File
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === "processing" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Processing Your Voice</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your voice patterns and creating your unique voice model
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="text-center text-sm text-muted-foreground">This usually takes 30-60 seconds...</div>
          </div>
        )}

        {/* Step 3: Ready to Generate */}
        {step === "ready" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Voice Cloned Successfully!</h3>
                <p className="text-muted-foreground">
                  Your voice model is ready. Enter text to generate speech in your voice.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clone-text" className="text-sm font-medium">
                Enter text to speak in your voice
              </Label>
              <Textarea
                id="clone-text"
                placeholder="Type what you want your cloned voice to say..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Maximum 500 characters</span>
                <span>{text.length}/500</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={generateSpeech} className="flex-1 h-12 text-base font-medium" disabled={!text.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Generate Speech
              </Button>
              <Button onClick={resetCloning} variant="outline" className="h-12">
                New Voice
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Generating Speech */}
        {step === "generating" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <Play className="w-12 h-12 text-white" />
                ) : (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isPlaying ? "Playing Your Cloned Voice" : "Generating Speech"}
                </h3>
                <p className="text-muted-foreground">
                  {isPlaying
                    ? "Listen to your text spoken in your cloned voice"
                    : "Creating audio with your cloned voice..."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium mb-1">Generated Text:</p>
              <p className="text-muted-foreground italic">"{text}"</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Tips for better voice cloning:</p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Record in a quiet environment</li>
                <li>• Speak clearly and naturally</li>
                <li>• Record at least 10-15 seconds</li>
                <li>• Use varied intonation and expressions</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
