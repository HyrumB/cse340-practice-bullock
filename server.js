// Import express using ESM syntax
import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.MODE || "production";
const port = process.env.PORT || 3000;

// Create an instance of an Express application
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Register the 'public' directory to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Global middleware to check the current mode
app.use((req, res, next) => {
  res.locals.inDevMode = true;
  res.locals.port = port;
  res.locals.devModeWarning = ""; // Placeholder for a dev mode warning
  res.locals.scripts = []; // Placeholder for front-end scripts

  if (req.devModeEnabled) {
    // Complete the missing code here...
  }
  next();
});

// Global middleware to set a custom header
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Hakure Shrine");
  next();
});

// Home page
app.get("/", (req, res) => {
  const title = "Home Page";
  const content = `
        <h1>Welcome to the Home Page</h1>
    `;
  res.render("index", { title, content });
});

// About page
app.get("/about", (req, res) => {
  const title = "About Page";
  const content = "<h1>Welcome to the About Page</h1>";
  res.render("index", { title, content });
});

// Contact page
app.get("/contact", (req, res) => {
  const title = "Contact Page";
  const content = "<h1>Welcome to the Contact Page</h1>";
  res.render("index", { title, content });
});

// ID validation middleware
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    const error = new Error("Invalid ID: must be a number.");
    error.status = 400;
    next(error);
    return;
  }
  next();
};

// Middleware to validate name
const validateName = (req, res, next) => {
  const { name } = req.params;
  if (!/^[a-zA-Z]+$/.test(name)) {
    const error = new Error("Invalid name: must only contain letters.");
    error.status = 400;
    next(error);
    return;
  }
  next();
};

// Account page route with ID and name validation
app.get("/account/:name/:id", validateName, validateId, (req, res) => {
  const title = "Account Page";
  const { name, id } = req.params;
  const isEven = id % 2 === 0 ? "even" : "odd";
  const content = `
        <h1>Welcome, ${name}!</h1>
        <p>Your account ID is ${id}, which is an ${isEven} number.</p>
    `;
  res.render("index", { title, content });
});

// Handle 404 errors by passing an error
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const context = { error: err.message };
  res.status(status);
  switch (status) {
    case 400:
      context.title = "Bad Request";
      res.render("400", context);
      break;
    case 404:
      context.title = "Page Not Found";
      res.render("400", context);
      break;
    default:
      context.title = "Internal Server Error";
      context.error = err.message;
      res.render("500", context);
  }
});

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket is running on http://localhost:${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
