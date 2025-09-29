import { useFetcher } from "@remix-run/react";
import { Page, Card, Button, BlockStack, Text, List } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `
  );
  const responseJson = await response.json();
  const products = responseJson.data.products.edges.map(edge => edge.node.title);
  return { products };
};

export default function AllProducts() {
  const fetcher = useFetcher();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const fetchProducts = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page title="All Products">
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="300">
            <Button loading={isLoading} onClick={fetchProducts}>
              Fetch First 10 Product Names
            </Button>
            {fetcher.data?.products && (
              <List>
                {fetcher.data.products.map((name, idx) => (
                  <List.Item key={idx}>
                    <Text variant="bodyMd">{name}</Text>
                  </List.Item>
                ))}
              </List>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}