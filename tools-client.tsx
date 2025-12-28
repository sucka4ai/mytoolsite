"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { ConversionHistory } from "@/components/conversion-history"
import { FileText, FileImage, Video, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ToolsClientProps {
  isPremium: boolean
  userId: string
}

export function ToolsClient({ isPremium }: ToolsClientProps) {
  const [activeTab, setActiveTab] = useState("documents")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">ConvertPro</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            {!isPremium && (
              <Link href="/pricing">
                <Button className="gap-2">
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-8">
        {!isPremium && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-lg">Free Plan - Limited Access</CardTitle>
              <CardDescription className="text-yellow-900 dark:text-yellow-100">
                You are using the free plan with ads. Upgrade to Premium for unlimited conversions, larger files, and an
                ad-free experience.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>File Conversion Tools</CardTitle>
                <CardDescription>Select a file type to convert</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="documents" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="images" className="gap-2">
                      <FileImage className="h-4 w-4" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-2">
                      <Video className="h-4 w-4" />
                      Media
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="documents" className="mt-6">
                    <FileUploader
                      conversionType="documents"
                      acceptedFormats=".pdf,.doc,.docx,.txt,.odt,.rtf"
                      outputFormats={["PDF", "DOCX", "TXT", "ODT", "RTF"]}
                      isPremium={isPremium}
                    />
                  </TabsContent>

                  <TabsContent value="images" className="mt-6">
                    <FileUploader
                      conversionType="images"
                      acceptedFormats=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                      outputFormats={["JPG", "PNG", "WEBP", "GIF", "SVG"]}
                      isPremium={isPremium}
                    />
                  </TabsContent>

                  <TabsContent value="media" className="mt-6">
                    <FileUploader
                      conversionType="media"
                      acceptedFormats=".mp4,.mp3,.wav,.avi,.mov,.mkv,.flac"
                      outputFormats={["MP4", "MP3", "WAV", "AVI", "MOV"]}
                      isPremium={isPremium}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-2xl font-bold">{isPremium ? "Premium" : "Free"}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Conversions</span>
                    <span className="font-medium">{isPremium ? "Unlimited" : "5/day"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max File Size</span>
                    <span className="font-medium">{isPremium ? "100MB" : "10MB"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ads</span>
                    <span className="font-medium">{isPremium ? "None" : "Yes"}</span>
                  </div>
                </div>
                {!isPremium && (
                  <Link href="/pricing" className="block">
                    <Button className="w-full">Upgrade Now</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <ConversionHistory />
        </div>
      </main>
    </div>
  )
}
