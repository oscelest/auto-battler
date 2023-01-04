import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React from "react";
import Login from "../components/Application/Login";
import HomeScene from "../components/Scene/HomeScene";
import {i18n} from "../next-i18next.config";
import Style from "./index.module.scss";

export async function getStaticProps({locale}: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? i18n.defaultLocale, ["common"]))
    }
  };
}

const IndexPage: NextPage = () => {
  return (
    <div className={Style.Component}>
      <Login>
        <HomeScene/>
      </Login>
    </div>
  );
};

export default IndexPage;
