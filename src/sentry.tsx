import React from "react";

const SENTRY_DSN = import.meta.env.VITE_APP_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_APP_SENTRY_ENVIRONMENT;
const RELEASE_VERSION = import.meta.env.VITE_APP_GIT_SHA;

export default function Sentry() {
  React.useEffect(() => {
    if (SENTRY_DSN && SENTRY_ENVIRONMENT) {
      import("@sentry/react").then((Sentry) => {
        Sentry.init({
          dsn: SENTRY_DSN,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
          ],
          environment: SENTRY_ENVIRONMENT,
          release: RELEASE_VERSION,
        });
      });
    }
  }, []);

  return null;
}
