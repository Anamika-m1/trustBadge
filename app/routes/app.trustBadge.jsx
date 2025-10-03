import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

import {
  Page,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Tabs,
  Layout,
  DropZone,
  Thumbnail
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";


const badgeImages = [
  { id: "badge2", src: "/badges/money-back-guarantee.png", alt: "Badge 2" },
  { id: "badge1", src: "/badges/free-shipping.png", alt: "Badge 1" },
  { id: "badge3", src: "/badges/money-back-guarantee-2.png", alt: "Badge 3" },
  { id: "badge5", src: "/badges/money-back-guarantee-3.png", alt: "Badge 5" },
];

export async function loader({ request }) {
  const { authenticate } = await import("../shopify.server");
  const prisma = (await import("../db.server")).default;
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const savedBadges = await prisma.badges.findMany({ where: { shop } });
  return { savedBadges };
}

export default function TrustBadge() {
  const [selectedBadges, setSelectedBadages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState([]);
  const [uploadedBadgePreview, setUploadedBadgePreview] = useState(null);

  const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
    setUploadedFiles((files) => [...files, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFilePreviews((previews) => [...previews, reader.result]);
        setUploadedBadgePreview(reader.result); // Select last uploaded by default
      };
      reader.readAsDataURL(file);
    });
  };
  const tabs = [
    {
      id: "checkout-badges",
      content: "Select badge",
      panelID: "checkout-badges-panel",
    },
    {
      id: "upload-badges",
      content: "Upload badges",
      panelID: "upload-badges-panel",
    },
  ];

  const saveSelectedBadges = async () => {
    const selectedBadgeObjects = selectedBadges
      .map((id) => {
        const badge = badgeImages.find((b) => b.id === id);
        return badge
          ? {
            id: badge.id,
            image_url: badge.src,
          }
          : null;
      })
      .filter(Boolean);

    await fetch("/app/saveBadge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badges: selectedBadgeObjects }),
    });
    console.log("Badges saved");
  };

  const saveUploadedBadge = async () => {
    if (uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setUploadedBadgePreview(base64Image);
      await fetch("/app/saveBadge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badges: [
            {
              id: "uploaded",
              image_url: base64Image,
            },
          ],
        }),
      });
      console.log("Uploaded badge saved");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Page title="New Trust Badges">
      <TitleBar title="Techies Trust Badge" />
      <Layout>
        <Layout.Section>
          <Card title="Select Badges">
            <Text variant="headingMd">Select Badges</Text>
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
            >
              {selectedTab === 0 && (
                <BlockStack gap="400">
                  {badgeImages.map((badge) => (
                    <label
                      key={badge.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="badge"
                        value={badge.id}
                        checked={selectedBadges[0] === badge.id}
                        onChange={() => setSelectedBadages([badge.id])}
                        style={{ marginRight: "16px" }}
                      />
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        style={{
                          width: "80%",
                          height: "80%",
                          objectFit: "contain",
                          marginRight: "2px",
                        }}
                      />
                    </label>
                  ))}
                  <InlineStack>
                    <Button variant="primary" onClick={saveSelectedBadges}>
                      Save Badges
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}
              {selectedTab === 1 && (
                <BlockStack gap="200">
                  <DropZone
                    allowMultiple
                    onDrop={handleDropZoneDrop}
                    accept="image/*"
                    type="file"
                  >
                    <DropZone.FileUpload>
                      <Text variant="bodyMd" tone="subdued">
                        + Upload badges
                      </Text>
                    </DropZone.FileUpload>
                  </DropZone>
                  <InlineStack gap="200">
                    {uploadedFiles.map((file, idx) => (
                      <label
                        key={idx}
                        style={{
                          display: "inline-block",
                          margin: "8px",
                          border: uploadedBadgePreview === uploadedFilePreviews[idx] ? "2px solid #0070f3" : "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "4px",
                          cursor: "pointer",
                          position: "relative",
                          background: "#fff",
                        }}
                      >
                        <input
                          type="radio"
                          name="uploadedBadge"
                          checked={uploadedBadgePreview === uploadedFilePreviews[idx]}
                          onChange={() => setUploadedBadgePreview(uploadedFilePreviews[idx])}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            zIndex: 2,
                          }}
                        />
                        <img
                          src={uploadedFilePreviews[idx]}
                          alt={file.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "contain",
                            borderRadius: "6px",
                            display: "block",
                          }}
                        />
                      </label>
                    ))}
                  </InlineStack>
                  <InlineStack>
                    <Button
                      variant="primary"
                      onClick={saveUploadedBadge}
                      disabled={!uploadedBadgePreview}
                    >
                      Save Badges
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}
            </Tabs>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card title="Preview">
            <Text variant="headingMd">Preview</Text>
            <BlockStack gap="200">
              {selectedTab === 1 && uploadedBadgePreview ? (
                <img
                  src={uploadedBadgePreview}
                  alt="Uploaded Badge"
                  style={{
                    width: "30%",
                    height: "30%",
                    objectFit: "contain",
                    background: "none",
                    border: "none",
                    boxShadow: "none",
                    display: "block",
                    marginBottom: "12px",
                  }}
                />
              ) : selectedTab === 0 && selectedBadges.length > 0 ? (
                <img
                  src={badgeImages.find((b) => b.id === selectedBadges[0])?.src}
                  alt={badgeImages.find((b) => b.id === selectedBadges[0])?.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "none",
                    border: "none",
                    boxShadow: "none",
                    display: "block",
                    marginBottom: "12px",
                  }}
                />
              ) : (
                <Text>No badges selected</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}