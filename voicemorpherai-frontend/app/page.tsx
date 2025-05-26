"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { TTSSection } from "@/components/tts-section"
import { VoiceCloningSection } from "@/components/voice-cloning-section"
import { Mic, Volume2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                VoiceMorpherAI
              </h1>
              <p className="text-sm text-muted-foreground">Transform text into natural speech</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="tts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="tts" className="flex items-center gap-2 text-base">
                <Volume2 className="w-4 h-4" />
                Text-to-Speech
              </TabsTrigger>
              <TabsTrigger value="cloning" className="flex items-center gap-2 text-base">
                <Mic className="w-4 h-4" />
                Voice Cloning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tts" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Text-to-Speech</h2>
                <p className="text-muted-foreground text-lg">
                  Convert your text into natural-sounding speech with our AI voices
                </p>
              </div>
              <TTSSection />
            </TabsContent>

            <TabsContent value="cloning" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Voice Cloning</h2>
                <p className="text-muted-foreground text-lg">
                  Clone any voice and generate speech that sounds just like the original
                </p>
              </div>
              <VoiceCloningSection />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-muted-foreground">
          <p className="text-sm flex items-center justify-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for creators
          </p>
        </footer>
      </div>
    </div>
  )
}
