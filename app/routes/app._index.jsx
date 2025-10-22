import {
  Box,
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Button,
  InlineStack
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

function ScriptBlock() {
  const shop =
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("shop")) ||
    process.env.SHOPIFY_STORE_DOMAIN;
  const adminUrl = shop
    ? `https://${shop}/admin/themes/current/editor?&template=product&addAppBlock=trust-badge`
    : "https://admin.shopify.com/";
  const handleClick = () => {
    if (typeof window === "undefined") return;
    try {
      window.top.location.href = adminUrl;
    } catch (e) {
      window.location.href = adminUrl;
    }
  };
  return (
    <Box style={{ display: "flex", paddingTop: 12 }}>
      <Button
        primary
        type="button"
        onClick={handleClick}
        size="slim" variant="primary"
      >
        Add Trustily Seal to My Store
      </Button>
    </Box>
  );
}

export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="Trustily - Trust Seal Badge" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Box>
              <Text variant="headingLg" as="h1">
                Hi! 👋
              </Text>
              <Text variant="bodyMd" tone="subdued">
                Welcome to Trustily Trust Badge
              </Text>
            </Box>

            <Card>
              <BlockStack gap="400">
                <Box>
                  <Text variant="headingMd" as="h2">
                    Setup guide
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    Use this guide to quickly setup your offer
                  </Text>
                </Box>

                <BlockStack gap="400">
                  <Box>
                    <InlineStack gap="200">
                      <Text variant="bodyLg" as="span" fontWeight="bold" style={{ fontSize: "2rem" }}>•</Text>
                      <Text variant="bodyLg">Enable app</Text>
                    </InlineStack>
                  </Box>

                  <Box padding="40" background="bg-surface-secondary" border="base" borderRadius="2">
                    <BlockStack gap="300">
                      <InlineStack gap="200">
                        <Text variant="bodyLg" as="span" fontWeight="bold" style={{ fontSize: "2rem" }}>•</Text>
                        <Text variant="bodyLg" fontWeight="semibold">Select your Trust Badges</Text>
                      </InlineStack>

                      <Text variant="bodyLg" tone="subdued">
                        Set up your Trust Badges with multiple badges to increase store credibility
                      </Text>
                      <Box>
                        <Button size="slim" variant="primary" url="/app/trustBadge">Select badges</Button>
                      </Box>
                    </BlockStack>
                  </Box>

                  <Box>
                    <BlockStack gap="200">
                    <InlineStack gap="200">
                      <Text variant="bodyLg" as="span" fontWeight="bold" style={{ fontSize: "2rem" }}>•</Text>
                      <Text variant="bodyLg">Visualize how it appears on your store</Text>
                    </InlineStack>

                     <Text variant="bodyLg" fontWeight="semibold">Install the Trustily app from the Shopify App Store</Text>
                      </BlockStack>
                      <BlockStack gap="100" style={{ paddingLeft: 12 }}>
                        <ol style={{ margin: 0, paddingLeft: 20 }}>
                          <li style={{ marginBottom: 8 }}>
                            <Text variant="bodyMd">From your Shopify admin, go to Online Store → Customize.</Text>
                          </li>
                          <li style={{ marginBottom: 8 }}>
                            <Text variant="bodyMd">Select the theme you want to add the Trustily Trust Seal to.</Text>
                          </li>
                          <li style={{ marginBottom: 8 }}>
                            <Text variant="bodyMd">In the Theme Editor, click Add section → Apps → Trustily – Trust Seal.</Text>
                          </li>
                          <li style={{ marginBottom: 8 }}>
                            <Text variant="bodyMd">Choose your preferred trust badge style, position, and size.</Text>
                          </li>
                          <li style={{ marginBottom: 8 }}>
                            <Text variant="bodyMd">Click Save to apply changes.</Text>
                          </li>
                        </ol>
                      </BlockStack>
                      <ScriptBlock />
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
