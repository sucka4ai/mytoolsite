"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Clock, FileIcon } from "lucide-react"

interface Conversion {
  id: string
  conversion_type: string
  file_name: string
  file_size_bytes: number
  created_at: string
}

export function ConversionHistory() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("conversion_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        setConversions(data || [])
      }
      setIsLoading(false)
    }

    fetchHistory()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversions</CardTitle>
        <CardDescription>Your last 10 file conversions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : conversions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No conversions yet. Start converting files to see your history!
          </p>
        ) : (
          <div className="space-y-3">
            {conversions.map((conversion) => (
              <div key={conversion.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{conversion.file_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{conversion.conversion_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(conversion.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
