import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Link from "next/link";
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

const AdminPage: NextPage = () => {
  return (
    <div className={Style.Component}>
      <div className={Style.Panel}>
        <Link href={"/admin/unit"}>
          Unit
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
