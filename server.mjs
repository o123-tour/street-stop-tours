import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT) || 8080;
const PUBLIC_DIR = join(process.cwd(), "dist", "client");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveFile(urlPath) {
  const safePath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = join(PUBLIC_DIR, safePath);

  if (existsSync(fullPath) && statSync(fullPath).isFile()) {
    return fullPath;
  }

  const indexHtml = join(fullPath, "index.html");
  if (existsSync(indexHtml) && statSync(indexHtml).isFile()) {
    return indexHtml;
  }

  const fallback404 = join(PUBLIC_DIR, "404.html");
  if (existsSync(fallback404)) {
    return fallback404;
  }

  return join(PUBLIC_DIR, "index.html");
}

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "street-stop-tours",
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  const filePath = resolveFile(url.pathname);
  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const isHashedAsset = url.pathname.startsWith("/assets/");

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": isHashedAsset ? "public, max-age=31536000, immutable" : "no-cache",
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Street Stop Tours server listening on http://0.0.0.0:${PORT}`);
});
