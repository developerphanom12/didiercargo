import React from "react";
import { Page, LegacyCard, Layout, Button } from "@shopify/polaris";
import { Link } from "react-router-dom";

export default function Dashboard() {
  
  return (
    <>
      <Page narrowWidth>
        <Layout>
          <Layout.Section>
            <LegacyCard title="Cargo Insurance" sectioned>
              <p>This is dummy Context..</p>

              
            </LegacyCard>
          </Layout.Section>
          <Layout.Section>
          <div className="opn-btn">
              <Link  to="#"
            target="_blank"> <Button>Open APP</Button></Link>
              </div>
             
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
