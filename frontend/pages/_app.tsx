import {appWithTranslation} from "next-i18next";
import {AppProps} from "next/app";
import React, {useContext, useState} from "react";
import {io, Socket} from "socket.io-client";
import {ClientToServer} from "../../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../../shared/interfaces/sockets/ServerToClient";
import Content from "../components/Layout/Content";
import Header from "../components/Layout/Header";
import "../public/style/font.scss";
import "../public/style/globals.scss";

function Application({Component, pageProps}: AppProps) {
  const context = useContext(SiteContext);
  const [socket] = useState<Socket<ClientToServer, ServerToClient>>(context.socket);
  const [user, setUser] = useState<User>();
  
  return (
    <SiteContext.Provider value={{socket, user, setUser}}>
      <Header/>
      <Content>
        <Component {...pageProps}></Component>
      </Content>
    </SiteContext.Provider>
  );
}

export const SiteContext = React.createContext<SiteContext>({
  socket: io(`http://localhost:${process.env.NEXT_PUBLIC_PORT_BACKEND}`, {autoConnect: false})
} as SiteContext);

export interface SiteContext {
  user?: User;
  socket: Socket<ServerToClient, ClientToServer>;
  
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

interface User {
  id: string;
  username: string;
}

export default appWithTranslation(Application);
