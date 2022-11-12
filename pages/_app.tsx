import {appWithTranslation} from "next-i18next";
import {AppProps} from "next/app";
import React from "react";
import Content from "../components/Layout/Content";
import Header from "../components/Layout/Header";
import "../public/style/font.scss";
import "../public/style/globals.scss";

function Application({Component, pageProps}: AppProps) {
  const value = {};

  return (
    <GameContext.Provider value={value}>
      <Header>
        Hello!
      </Header>
      <Content>
        <Component {...pageProps}></Component>
      </Content>
    </GameContext.Provider>
  );
}

export const GameContext = React.createContext<GameContext>({});

export interface GameContext {

}

export default appWithTranslation(Application);
