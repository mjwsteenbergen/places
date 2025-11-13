import { Client, Account, Databases, Users, Teams } from "node-appwrite";
import { config } from "dotenv";
import { redirect } from "react-router";
import type { Route } from "../../+types/root";
import cookie from "cookie";

export const withSessionClient = async <T>(
  request: Route.ClientActionArgs["request"],
  func: (account: AppWriteClient) => T
): Promise<T> => {
  let sessionClient: AppWriteClient | undefined = undefined;
  try {
    const cookies = cookie.parse(request.headers.get("Cookie") ?? "");
    sessionClient = await createSessionClient(cookies.place_session ?? "");
  } catch (error) {
    return redirect("/login") as T;
  }
  if (sessionClient) {
    return func(sessionClient);
  }
  return redirect("/login") as T;
};

export async function createSessionClient(session: string) {
  const client = new Client()
    .setEndpoint("https://appwrite.thornhillcorp.uk/v1") // Your API Endpoint
    .setProject("68ed4e8900179a221a94"); // Your project ID

  if (!session) {
    throw new Error("No session");
  }

  client.setSession(session);

  return {
    ...createClient(client),
  };
}

const createClient = (client: Client) => {
  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
    get teams() {
      return new Teams(client);
    },
    // get tablesDB() {
    //   return new TablesDB(client)
    // }
  };
};

export type AppWriteClient = ReturnType<typeof createClient>;

export async function createAdminClient() {
  const env = config({
    quiet: true,
  });

  const client = new Client()
    .setEndpoint("https://appwrite.thornhillcorp.uk/v1") // Your API Endpoint
    .setProject("68ed4e8900179a221a94") // Your project ID
    .setKey(process.env.APPWRITE_TOKEN ?? "") // Your secret API key
    .setSelfSigned(true); // Use only on dev mode with a self-signed SSL cert

  return {
    baseUrl: process.env.BASE_URL,
    ...createClient(client),
  };
}
