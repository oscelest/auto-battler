require("dotenv").config({path: "../.env"});
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import {Server} from "socket.io";
import {ClientToServer} from "../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../shared/interfaces/sockets/ServerToClient";

export const script = (async () => {
  
  const app = Fastify({logger: false});
  const port = +(process.env.SERVER_BACKEND_PORT || 4000);
  
  app.addHook("preHandler", (request: FastifyRequest, reply: FastifyReply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "*");
    done();
  });
  
  const ico: string = Buffer.from(
    "AAABAAEAEBACAAEAAQCwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAQAAAAAAAAAAAAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "base64"
  ).toString("binary");
  
  app.get("/favicon.ico", (request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Content-Security-Policy", "default-src 'none'; img-src '*'");
    reply.header("Content-Type", "image/x-icon");
    reply.send(ico);
  });
  
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Not found");
  });
  
  app.ready().then(() => {
    const io = new Server<ClientToServer, ServerToClient>(app.server, {
      cors: {origin: "*"}
    });
    
    io.on("connection", socket => {
      socket.on("game_start", () => {
        console.log(app.printRoutes());
      });
    });
    
    io.listeners("game_start");
  });
  
  await app.listen({port});
})();
