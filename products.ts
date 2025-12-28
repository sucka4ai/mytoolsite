export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  stripePriceId?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic file conversion with ads",
    priceInCents: 0,
    features: ["Up to 5 conversions per day", "Max file size: 10MB", "Basic file formats", "Ad-supported"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Unlimited conversions, ad-free",
    priceInCents: 999, // $9.99/month
    features: [
      "Unlimited conversions",
      "Max file size: 100MB",
      "All file formats",
      "Ad-free experience",
      "Priority support",
      "Batch conversions",
    ],
  },
]
