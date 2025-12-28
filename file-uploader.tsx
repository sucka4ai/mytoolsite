"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileIcon, X, Loader2 } from "lucide-react"
import { AdBanner } from "@/components/ad-banner"

interface FileUploaderProps {
  conversionType: string
  acceptedFormats: string
  outputFormats: string[]
  isPremium: boolean
}

export function FileUploader({ conversionType, acceptedFormats, outputFormats, isPremium }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxFileSize = isPremium ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB or 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (selectedFile) {
      if (selectedFile.size > maxFileSize) {
        setError(
          `File size exceeds ${isPremium ? "100MB" : "10MB"} limit. ${!isPremium ? "Upgrade to Premium for larger files." : ""}`,
        )
        return
      }
      setFile(selectedFile)
    }
  }

  const handleConvert = async () => {
    if (!file || !outputFormat) {
      setError("Please select a file and output format")
      return
    }

    setIsConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("outputFormat", outputFormat)
      formData.append("conversionType", conversionType)

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Conversion failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `converted.${outputFormat.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Reset form
      setFile(null)
      setOutputFormat("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during conversion")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isPremium && <AdBanner slot="file-uploader-top" />}

      <Card className="border-2 border-dashed p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-medium">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Accepted formats: {acceptedFormats.split(",").join(", ")}</p>
            <p className="text-sm text-muted-foreground">Max size: {isPremium ? "100MB" : "10MB"}</p>
          </div>
          <input type="file" accept={acceptedFormats} onChange={handleFileChange} className="hidden" id="file-upload" />
          <Label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>Select File</span>
            </Button>
          </Label>
        </div>
      </Card>

      {file && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        <div>
          <Label htmlFor="output-format">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger id="output-format">
              <SelectValue placeholder="Select output format" />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleConvert} disabled={!file || !outputFormat || isConverting} size="lg" className="w-full">
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert File"
          )}
        </Button>
      </div>

      {!isPremium && <AdBanner slot="file-uploader-bottom" />}
    </div>
  )
}
