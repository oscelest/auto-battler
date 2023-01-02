require("dotenv").config({path: "../.env"});
import FastifyWebSocket, {SocketStream} from "@fastify/websocket";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";

export const script = (async () => {
  
  const app = Fastify({logger: false});
  const port = +(process.env.SERVER_BACKEND_PORT || 4000);
  
  const ico: string = Buffer.from(
    "AAABAAEAEBACAAEAAQCwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAQAAAAAAAAAAAAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "base64"
  ).toString("binary");
  
  app.register(FastifyWebSocket);
  
  app.addHook("preHandler", (request: FastifyRequest, reply: FastifyReply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    reply.header("Access-Control-Allow-Credentials", "true");
    reply.header("Content-Security-Policy", "default-src 'none'");
    done();
  });
  
  app.get("/favicon.ico", (request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Content-Security-Policy", "default-src 'none'; img-src '*'");
    reply.header("Content-Type", "image/x-icon");
    reply.send(ico);
  });
  
  app.get("/", {websocket: true}, (connection: SocketStream, req: FastifyRequest) => {
    console.log("test?");
    
    connection.socket.send(`Hello there!`);
    
    // connection.socket.on("message", message => {
    //   console.log("message", message);
    //   // message.toString() === 'hi from client'
    //   connection.socket.send("hi from server", (e) => {
    //     console.log(e);
    //   });
    // });
  });
  
  app.listen({port});
  
  console.log("Server started and listening on", port);
})();
