import { authenticate } from "../shopify.server"; 
import prisma from "../db.server";
import fs from "fs";
import path from "path";

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
    let imageUrl = null;

    if (badge.image_url.startsWith("data:image")) {
      //Extract Base64 data
      const base64Data = badge.image_url.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      //Save file with unique name
      const fileName = `badge_${Date.now()}.png`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      //Only save the relative URL in DB
      imageUrl = `/uploads/${fileName}`;
    } else {
      imageUrl = badge.image_url;
    }

    await prisma.badges.create({
      data: {
        shop,
        imageUrl,
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
