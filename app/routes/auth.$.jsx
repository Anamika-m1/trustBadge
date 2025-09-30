import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/app';
  return redirect(redirectTo);
};
