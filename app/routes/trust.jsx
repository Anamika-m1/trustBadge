import prisma from "../db.server";

export const loader = async () => {

  const badges = await prisma.badges.findMany({
    where: { isSelected: true }
  });
  return new Response(JSON.stringify(badges), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};