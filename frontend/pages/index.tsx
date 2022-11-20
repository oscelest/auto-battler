import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React from "react";
import EncounterSimulator from "../components/Simulator/EncounterSimulator";
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
      <EncounterSimulator/>
    </div>
  );
};

export default IndexPage;
