import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user subscription
    const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

    const isPremium = subscription?.plan_type === "premium"

    const formData = await request.formData()
    const file = formData.get("file") as File
    const outputFormat = formData.get("outputFormat") as string
    const conversionType = formData.get("conversionType") as string

    if (!file || !outputFormat) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check file size limits
    const maxSize = isPremium ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File size exceeds ${isPremium ? "100MB" : "10MB"} limit` }, { status: 400 })
    }

    // Check daily conversion limit for free users
    if (!isPremium) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from("conversion_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())

      if (count && count >= 5) {
        return NextResponse.json(
          { error: "Daily conversion limit reached. Upgrade to Premium for unlimited conversions." },
          { status: 429 },
        )
      }
    }

    // In a real application, you would perform the actual file conversion here
    // For this demo, we'll simulate a conversion by returning the original file
    // with a delay to simulate processing time

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Log the conversion
    await supabase.from("conversion_history").insert({
      user_id: user.id,
      conversion_type: conversionType,
      file_name: file.name,
      file_size_bytes: file.size,
    })

    // Return the file (in production, this would be the converted file)
    const buffer = await file.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="converted.${outputFormat.toLowerCase()}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Conversion error:", error)
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 })
  }
}
