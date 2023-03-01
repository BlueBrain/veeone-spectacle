import React from "react"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getConfig } from "./config"

const startSentry = () => {
  const config = getConfig()

  // Don't report to Sentry in excluded environments (e.g. local development)
  if (
    config.SENTRY_EXCLUDE_ENVIRONMENTS.includes(config.RUNNING_ENVIRONMENT) ||
    !config.IS_SENTRY_ENABLED
  ) {
    console.warn(
      `Sentry is disabled for this session. config.IS_SENTRY_ENABLED=${config.IS_SENTRY_ENABLED}
config.SENTRY_EXCLUDE_ENVIRONMENTS=${config.SENTRY_EXCLUDE_ENVIRONMENTS}
config.RUNNING_ENVIRONMENT=${config.RUNNING_ENVIRONMENT}`
    )
    return
  }

  console.info("Sentry initialization...")
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: config.RUNNING_ENVIRONMENT,
    release: config.REVISION,
  })
}

export default startSentry
