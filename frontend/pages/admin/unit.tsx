import {InputField} from "@noxy/react-input-field";
import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React from "react";
import {i18n} from "../../next-i18next.config";
import Style from "./index.module.scss";

export async function getStaticProps({locale}: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? i18n.defaultLocale, ["common"]))
    }
  };
}

const experience_filter = /^\d*$/;

const UnitAdminPage: NextPage = () => {
  
  
  return (
    <div className={Style.Component}>
      <InputField label={"Name"}/>
      <InputField label={"Experience"} filter={experience_filter}/>
    
    
    </div>
  );
};

export default UnitAdminPage;
