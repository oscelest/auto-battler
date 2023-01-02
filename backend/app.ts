require("dotenv").config({path: "../.env"});
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import {Server} from "socket.io";
import {ClientToServer} from "../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../shared/interfaces/sockets/ServerToClient";
import {EncounterSocket} from "./sockets/Encounter.socket";

export const script = (async () => {
  
  let io: Server<ClientToServer, ServerToClient>;
  
  const app = Fastify({logger: false});
  const port = +(process.env.SERVER_BACKEND_PORT || 4000);
  const host = "127.0.0.1";
  
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
  
  app.addHook("onClose", (instance, done) => {
    io.close();
    done();
  });
  
  app.ready().then(() => {
    io = new Server<ClientToServer, ServerToClient>(app.server, {cors: {origin: "*"}});
    io.on("connection", EncounterSocket.onConnection.bind(io));
  });
  
  await app.listen({port, host});
})();
