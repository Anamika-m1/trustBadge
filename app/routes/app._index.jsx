import { useState } from "react";
import { authenticate } from "../shopify.server"; 
import prisma from "../db.server"
import { useLoaderData } from "@remix-run/react";

import {
  Page,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Layout
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";


const badgeImages = [
  { id: "badge2", src: "/badges/money-back-guarantee.png", alt: "Badge 2" },
  { id: "badge1", src: "/badges/free-shipping.png", alt: "Badge 1" },
  { id: "badge3", src: "/badges/money-back-guarantee-2.png", alt: "Badge 3" },
  { id: "badge5", src: "/badges/money-back-guarantee-3.png", alt: "Badge 5" },
];

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const savedBadges = await prisma.badges.findMany({ where: { shop } });
  return { savedBadges };
}

export default function TrustBadge() {
  const { savedBadges } = useLoaderData();
  const [selectedBadges, setSelectedBadges] = useState(
    savedBadges?.map(b => b.id) || []
  );

  const saveSelectedBadges = async () => {
  const selectedBadgeObjects = selectedBadges.map(id => {
    const badge = badgeImages.find(b => b.id === id);
    return badge
      ? {
          id: badge.id,
          image_url: badge.src,
        }
      : null;
    }).filter(Boolean);   
  
    await fetch("/app/trustBadge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badges: selectedBadgeObjects }),
    });
    console.log("Badges saved");
  };

 return (
  <Page title="New Trust Badges">
    <TitleBar title="Techies Trust Badge"></TitleBar>
    <Layout>
    <Layout.Section>
      <Card title="Select Badges">
      <Text variant="headingMd">Select Badges</Text>
      <BlockStack gap="400">
        {badgeImages.map((badge) => (
        <label key={badge.id} style={{ display: "flex", alignItems: "center", marginBottom: "16px", cursor: "pointer" }}>
          <input
            type="radio"
            name="badge"
            value={badge.id}
            checked={selectedBadges[0] === badge.id}
            onChange={() => setSelectedBadges([badge.id])}
            style={{ marginRight: "16px" }}
          />
          <img
            src={badge.src}
            alt={badge.alt}
            style={{ width: "80%", height: "80%", objectFit: "contain", marginRight: "2px" }}
          />
        </label>
        ))}
        <InlineStack>
          <Button
            variant="primary"
            onClick={saveSelectedBadges}
          >
            Save Badges
          </Button>
        </InlineStack>
      </BlockStack>
      </Card>
    </Layout.Section>
    <Layout.Section variant="oneThird">
      <Card title="Preview">
      <Text variant="headingMd">Preview</Text>
      <BlockStack gap="200">
        {selectedBadges.length === 0 ? (
          <Text>No badges selected</Text>
        ) : (
          selectedBadges.map((id) => {
            const badge = badgeImages.find((b) => b.id === id);
            return (
              <img
                key={id}
                src={badge?.src}
                alt={badge?.alt}
                style={{ width: "100%", height: 80, objectFit: "contain", background: "none", border: "none", boxShadow: "none", display: "block", marginBottom: "12px" }}
              />
            );
          })
        )}
      </BlockStack>
      </Card>
    </Layout.Section>
    </Layout>
  </Page>
  );
}