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
export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="TrustSeal Trust Badge" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Box>
              <Text variant="headingLg" as="h1">
                Hi! 👋
              </Text>
              <Text variant="bodyMd" tone="subdued">
                Welcome to Techies Trust Badge
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
                    <InlineStack gap="200">
                      <Text variant="bodyLg" as="span" fontWeight="bold" style={{ fontSize: "2rem" }}>•</Text>
                      <Text variant="bodyLg">Visualize how it appears on your store</Text>
                    </InlineStack>
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
