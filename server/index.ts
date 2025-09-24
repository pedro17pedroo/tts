import { createApp, setupErrorHandling } from "./http/app";
import { registerModules } from "./http/module-registry";
import { setupAuth } from "./auth";
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

  // Start server - configured for port 5000 for Replit compatibility
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Modular TatuTicket server running on port ${port}`);
  });
})();
