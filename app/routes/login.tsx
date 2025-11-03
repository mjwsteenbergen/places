import { Button } from "~/components/design-system/button";
import type { Route } from "./+types/login";
import { createAdminClient } from "~/api/appwrite/server";
import { OAuthProvider } from "node-appwrite";

export async function loader({}: Route.ClientLoaderArgs) {
  const { account, baseUrl } = await createAdminClient();

  const redirectUrl = await account.createOAuth2Token({
    provider: OAuthProvider.Authentik,
    success: `${baseUrl}/oauth`,
    failure: `${baseUrl}/signup`,
    scopes: ["repo", "user"],
  });

  return {
    redirectUrl: redirectUrl.replace(
      "authorize?client_id",
      "authorize/?client_id"
    ),
  };
}

export default function Login({ loaderData }: Route.ComponentProps) {
  return (
    <div className="bg-primary-medium w-screen h-screen flex justify-center items-center bg-red-500">
      <div className="bg-neutral-default p-8 rounded-lg shadow">
        <h1 className="font-heading text-5xl mb-4 w-full text-center">Login</h1>
        <p>You don't seem to be authenticated</p>
        <Button href={loaderData.redirectUrl} className="w-full mt-4">
          Login with Authentik
        </Button>
      </div>
    </div>
  );
}
