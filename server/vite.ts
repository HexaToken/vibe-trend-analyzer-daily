import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Detect if we're in a hosted environment (like Replit, Fly.dev, etc.)
  const isHostedEnvironment = !!(process.env.REPL_ID || process.env.FLY_APP_NAME || process.env.VERCEL || process.env.NETLIFY);

  const serverOptions = {
    middlewareMode: true,
    host: '0.0.0.0',
    port: 5000,
        hmr: isHostedEnvironment ? false : {
      server,
      port: 5000,
      host: '0.0.0.0',
      clientPort: 5000
    },
    allowedHosts: true,
    cors: true,
  };

  if (isHostedEnvironment) {
    log("Detected hosted environment - HMR WebSocket disabled to prevent fetch errors");
  }

    const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        // Don't exit on HMR errors in hosted environments
        if (msg.includes('HMR') || msg.includes('WebSocket') || msg.includes('ping')) {
          viteLogger.warn(msg, options);
          return;
        }
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

    app.use(vite.middlewares);

  // Only serve HTML for non-API routes and non-Vite internal routes
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip serving HTML for API routes or Vite internal routes
    if (url.startsWith('/api') || url.startsWith('/@') || url.startsWith('/__vite')) {
      return next();
    }

    // Check if this is a Vite ping request
    const acceptHeader = req.get('Accept');
    if (acceptHeader === 'text/x-vite-ping') {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

            // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      // For hosted environments, inject script to disable Vite's problematic fetch calls
      const isHostedEnvironment = !!(process.env.REPL_ID || process.env.FLY_APP_NAME || process.env.VERCEL || process.env.NETLIFY);
      if (isHostedEnvironment) {
        template = template.replace(
          '<head>',
          `<head>
    <script>
      // Prevent Vite ping failures in hosted environments
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        // Block Vite ping requests that fail in hosted environments
        if (typeof url === 'string' && (
          options?.headers?.Accept === 'text/x-vite-ping' ||
          url.includes('/@vite/') ||
          url.includes('__vite')
        )) {
          return Promise.resolve(new Response('', { status: 204 }));
        }
        return originalFetch.apply(this, arguments);
      };
    </script>`
        );
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
