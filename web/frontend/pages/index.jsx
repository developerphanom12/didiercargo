import {
  Page
} from "@shopify/polaris";
// import { TitleBar, useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { useEffect } from "react";


import Dashboard from "../components/Dashboard";
import { CreateProductButton } from "../components/CreateProductButton";
import UpdatePriceComponent from "../components/Update";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";


export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  useEffect(() => {
    async function fetchCollections() {
      try {
        if (!fetch) {
          throw new Error(
            "useAuthenticatedFetch hook not properly initialized."
          );
        }
        const response = await fetch("/api/communityData");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }

    fetchCollections();
  }, [fetch]);
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
     
     {/* <Design/>  */}
     {/* <Dashboard/> */}
    <Register></Register>
   
      {/* <UpdatePriceComponent/> */}
    </Page>
  );
}
