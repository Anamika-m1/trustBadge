import { authenticate } from "../shopify.server"; 
import prisma from "../db.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop; 

  const formData = await request.json();
  const { badges } = formData;

  await prisma.badges.deleteMany({
    where: { shop },
  });

  if (badges.length > 0) {
    const badge = badges[0];
    await prisma.badges.create({
      data: {
        shop,
        imageUrl: badge.image_url,
        updatedAt: new Date(),
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}