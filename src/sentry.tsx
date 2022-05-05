import React from "react"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getConfig } from "./config"

const startSentry = () => {
  const config = getConfig()
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: config.RUNNING_ENVIRONMENT,
    release: config.VERSION,
  })
}

export default startSentry
