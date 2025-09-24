import { createApp, setupErrorHandling } from "./http/app";
import { registerModules } from "./http/module-registry";
import { setupAuth } from "./replitAuth";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

(async () => {
  // Create Express app with basic middleware
  const app = createApp();

  // Setup authentication
  await setupAuth(app);

  // Register all modular routes
  registerModules(app);

  // Setup error handling
  setupErrorHandling(app);

  // Create HTTP server
  const server = createServer(app);

  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Modular server running on port ${port}`);
  });
})();