import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// Poll for image URL after upload
async function pollForImageUrl(admin, fileId, maxAttempts = 10, delay = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await admin.graphql(
      `#graphql
      query getFile($id: ID!) {
        node(id: $id) {
          ... on MediaImage {
            image { url }
          }
        }
      }`,
      { variables: { id: fileId } }
    );

    const url = (await response.json()).data?.node?.image?.url;
    if (url) return url;

    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error("Image URL not available after polling");
}

// Upload base64 image to Shopify
async function uploadToShopify(admin, base64Image) {
  const [, , base64Data] = base64Image.match(/^data:(.+);base64,(.+)$/) || [];
  if (!base64Data) throw new Error("Invalid base64 format");

  const fileBuffer = Buffer.from(base64Data, "base64");
  const fileName = `trustbadge_${Date.now()}.png`;

  // Stage upload
  const stagedResp = await admin.graphql(
    `#graphql
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        input: [{ resource: "IMAGE", filename: fileName, mimeType: "image/png", httpMethod: "POST" }]
      }
    }
  );

  const target = (await stagedResp.json()).data?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) throw new Error("Failed to create staged upload");

  // Upload file
  const formData = new FormData();
  target.parameters.forEach(({ name, value }) => formData.append(name, value));
  formData.append("file", new Blob([fileBuffer], { type: "image/png" }), fileName);

  const uploadResp = await fetch(target.url, { method: "POST", body: formData });
  if (!uploadResp.ok) throw new Error(`Upload failed: ${uploadResp.status}`);

  // Create file in Shopify
  const createResp = await admin.graphql(
    `#graphql
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          ... on MediaImage {
            id
            image { url }
          }
        }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        files: [{ alt: "Trust Badge", contentType: "IMAGE", originalSource: target.resourceUrl }]
      }
    }
  );

  const file = (await createResp.json()).data?.fileCreate?.files?.[0];
  if (!file) throw new Error("No file returned from Shopify");

  return file.image?.url || await pollForImageUrl(admin, file.id);
}

export async function action({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { badges } = await request.json();

    if (badges?.length > 0) {
      const { image_url } = badges[0];
      const imageUrl = image_url.startsWith("data:image")
        ? await uploadToShopify(admin, image_url)
        : image_url;

      if (!imageUrl) throw new Error("Image URL is required");

      // Check if image already exists
      const existingBadge = await prisma.badges.findFirst({
        where: { shop: session.shop, imageUrl }
      });

      if (!existingBadge) {
        // Add new image (not selected by default)
        await prisma.badges.create({
          data: { shop: session.shop, imageUrl, isSelected: false }
        });
      }

      // Mark only this badge as selected
      await prisma.badges.updateMany({
        where: { shop: session.shop },
        data: { isSelected: false }
      });

      await prisma.badges.updateMany({
        where: { shop: session.shop, imageUrl },
        data: { isSelected: true }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    console.error("Badge upload error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}