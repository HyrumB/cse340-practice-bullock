import {WebSocketServer} from "ws"; 

function webSocketErrorHandler(req, res, next) {

    if (res.locals.isDevMode) {
    
      try {
        const wsPort = parseInt(res.locals.port) + 1;
        const wsServer = new WebSocketServer({ port: wsPort });
    
        wsServer.on("listening", () => {
          console.log(`WebSocket is running on http://localhost:${wsPort}`);
        });
    
        wsServer.on("error", (error) => {
          console.error("WebSocket server error:", error.message);
        });

      } catch (error) {
        console.error("Failed to start WebSocket server:", error.message);
      }
    }

    next(); 
  };

export default webSocketErrorHandler;