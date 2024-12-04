import React, { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { TitleBar } from "@shopify/app-bridge/actions";

export default function StoreInfo() {
  const app = useAppBridge();
 // console.log(app,"Hello")
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    // Extract the 'shop' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
     console.log(shop ,"Hello")

    if (shop) {
      setStoreName(shop);
    }
  }, []);


  return (
    <div>
      <h1>Store Name: {storeName}</h1>
    </div>
  );
}
