require("dotenv").config();

const path = require("path");
const next = require("next");

const { app, registerErrorHandler } = require("./app");
const { connectDB } = require("./db");
const PORT = process.env.PORT || 4010;
process.env.PORT = String(PORT);
process.env.API_BASE_URL = process.env.API_BASE_URL || `http://127.0.0.1:${PORT}`;
const DEFAULT_URI = "mongodb://127.0.0.1:27017/mini-tools";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({
  dev,
  dir: path.resolve(__dirname, ".."),
});
const handle = nextApp.getRequestHandler();

async function start() {
  try {
    await connectDB(MONGODB_URI);
    await nextApp.prepare();

    app.all("*", (req, res) => handle(req, res));
    registerErrorHandler();

    app.listen(PORT, () => {
      console.log(`Mini tools app listening on http://localhost:${PORT}`);
      if (!process.env.MONGODB_URI) {
        console.log(
          `Using default MongoDB connection at ${DEFAULT_URI}. Set MONGODB_URI to override.`
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

