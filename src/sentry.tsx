import React from "react"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getConfig } from "./config"

const startSentry = () => {
  const config = getConfig()

  // Don't report to Sentry in excluded environments (e.g. local development)
  if (config.SENTRY_EXCLUDE_ENVIRONMENTS.includes(config.RUNNING_ENVIRONMENT)) {
    return
  }

  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: config.RUNNING_ENVIRONMENT,
    release: config.VERSION,
  })
}

export default startSentry
