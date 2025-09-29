import dotenv from 'dotenv';
import { createApp, setupErrorHandling } from "./http/app";
import { registerModules } from "./http/module-registry";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { createServer } from "http";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

(async () => {
  // Create Express app with basic middleware
  const app = createApp();

  // Setup authentication
  await setupAuth(app);

  // Register all modular routes BEFORE Vite middleware
  registerModules(app);
  
  // Register additional routes from routes.ts
  await registerRoutes(app);

  // Create HTTP server
  const server = createServer(app);

  // Setup error handling
  setupErrorHandling(app);

  // Start server - configured for port 4003
  const port = Number(process.env.PORT) || 4003;
  server.listen(port, "0.0.0.0", () => {
    log(`TatuTicket Backend API running on http://0.0.0.0:${port}`);
  });
})();
