import { fileURLToPath } from "url";
import path from "path";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express(); // instance an express app

const mode = process.env.MODE || "production";
const port = process.env.PORT || 3000;

// Place before all other calls to app
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(req);
  next();
});

// Place after your existing app.use(express.static(...)) call
app.set("views", path.join(__dirname, "views"));

// Home page
app.get("/", (req, res) => {
  const title = "Home Page";
  const content = "<h1>Welcome to the Home Page</h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("index", { title, content, mode, port });
});

app.get("/about", (req, res) => {
  const title = "page 1";
  const content = "<h1>Welcome to the About page</h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("index", { title, content, mode, port });
});

app.get("/contact", (req, res) => {
  const title = "page 2";
  const content = "<h1>Welcome to the Contact page</h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("index", { title, content, mode, port });
});

app.get("/explore/:name/:age/:id", (req, res) => {
  const name = req.params.name;
  const age = req.params.age;
  const id = req.params.id;
  const title = "hello ";
  const content = `<h1>hello ${name}</h1>
                   <p> | ${age} | ${id} | </p>`;
  res.render("index", { title, content, mode, port });
});

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");
  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });
    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
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
