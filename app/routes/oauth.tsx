import type { Route } from "./+types/oauth";
import { createAdminClient } from "~/api/appwrite/server";
import { redirect, useParams } from "react-router";

export async function loader({ request }: Route.ClientLoaderArgs) {
  try {
    const params = new URL(request.url).searchParams;
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) {
      return redirect("/login");
    }

    const { account } = await createAdminClient();
    const session = await account.createSession({
      userId,
      secret,
    });

    return redirect("/", {
      headers: {
        "Set-Cookie": `session=${session.secret}`,
      },
    });
  } catch {
    return redirect("login");
  }
}

export default function OAuth({ loaderData }: Route.ComponentProps) {
  return <p>Loading...</p>;
}
