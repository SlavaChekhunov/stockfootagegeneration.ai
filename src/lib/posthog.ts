import { PostHog } from 'posthog-node'

export default function PostHogClient(): PostHog {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_POSTHOG_KEY is not defined')
  }

  if (!host) {
    throw new Error('NEXT_PUBLIC_POSTHOG_HOST is not defined')
  }

  return new PostHog(apiKey, { host })
}