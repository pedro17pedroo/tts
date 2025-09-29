import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import express from "express";

// Simple logging function
export function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Setup Vite for development
export async function setupVite(app: Express, server: Server): Promise<void> {
  try {
    // In development, we would typically setup Vite middleware here
    // For now, we'll just log that we're in development mode
    log("Development mode: Vite setup would be configured here");
    
    // If you want to integrate with Vite, you would do something like:
    // const { createServer } = await import('vite');
    // const vite = await createServer({
    //   server: { middlewareMode: true }
    // });
    // app.use(vite.ssrFixStacktrace);
    // app.use(vite.middlewares);
  } catch (error) {
    log(`Error setting up Vite: ${error}`);
  }
}

// Serve static files in production
export function serveStatic(app: Express): void {
  try {
    // Serve static files from the client dist directory
    const clientDistPath = path.join(__dirname, "../client/dist");
    app.use(express.static(clientDistPath));
    
    // Handle SPA routing - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      // Skip API routes
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      
      return res.sendFile(path.join(clientDistPath, "index.html"));
    });
    
    log("Static file serving configured for production");
  } catch (error) {
    log(`Error setting up static file serving: ${error}`);
  }
}