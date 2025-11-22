const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const MiniToolDB = require("./models/MiniToolDB");
const toolsRouter = require("./routes/tools");
const {getZipFileEntryByPath} = require("./Services/ReactZipFileProcessingService");
const {getMiniToolMimeType, getMiniToolContent} = require("./Services/MiniToolService");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tools", toolsRouter);

// Handle root path
app.get("/mini-tools-react/:iframeSlug", serveReactApp);

app.get("/mini-tools-react/:iframeSlug/*", serveReactApp);
async function serveReactApp(req, res, next) {
  try {
    //region Not found error handling
    const tool = await MiniToolDB.findOne({
      iframeSlug: req.params.iframeSlug.toLowerCase(),
    });

    if (!tool) {
      console.log(`[React App] Tool not found for slug: ${req.params.iframeSlug}`);
      return res.status(404).send("Tool not found");
    }

    if (!tool.reactAppZipPath) {
      console.log(`[React App] No zip file path for slug: ${req.params.iframeSlug}`);
      return res.status(404).send("React app zip not found");
    }
    //endregion

    // Get the requested file path
    // For root route, req.params[0] will be undefined
    // For wildcard route, req.params[0] will contain the path
    let requestedPath = req.params[0] || "";
    // Normalize path - remove leading slash if present
    if (requestedPath.startsWith("/")) {
      requestedPath = requestedPath.slice(1);
    }
    // If empty path, default to index.html
    const normalizedPath = requestedPath || "index.html";
    const fileEntry = await getZipFileEntryByPath(tool.reactAppZipPath, normalizedPath);

    if (!fileEntry || Object.keys(fileEntry).length === 0) {
      console.error(`[React App] File not found: ${normalizedPath}`);
      return res.status(404).send(`File not found: ${normalizedPath}`);
    }

    const mimeType = getMiniToolMimeType(fileEntry);
    res.set("Content-Type", mimeType);

    if (mimeType !== "text/html" && mimeType !== "text/html; charset=utf-8") {
      res.set("Cache-Control", "public, max-age=31536000");
    }

    // Pass base path for HTML path rewriting
    const basePath = `/mini-tools-react/${req.params.iframeSlug}/`;
    const content = getMiniToolContent(fileEntry, basePath);
    
    res.send(content);
  } catch (error) {
    console.error(`[React App] Error serving file:`, error);
    next(error);
  }
}

function registerErrorHandler() {
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
}

module.exports = { app, registerErrorHandler };

