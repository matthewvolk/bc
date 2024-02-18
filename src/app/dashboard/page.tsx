import { redirect } from "next/navigation";

import { saveToken } from "@/actions/save-token";
import { authorize } from "@/auth/authorize";
import { SignOut } from "@/components/sign-out";
import { decrypt } from "@/lib/crypto";

const getScopesForToken = async (storeHash: string, accessToken: string) => {
  const response = await fetch(
    `https://api.bigcommerce.com/stores/${storeHash}/graphql`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": accessToken,
      },
      body: JSON.stringify({
        query:
          "query getScopesForToken{ client { scopes { edges { node } } } }",
      }),
    },
  );

  if (!response.ok) {
    return "Error: Incorrect store hash or access token";
  }

  const data = await response.json();

  return data.data.client.scopes.edges.map((edge: any) => edge.node).join("\n");
};

export default async function Dashboard() {
  const { user } = await authorize();

  if (!user) {
    return redirect("/");
  }

  return (
    <main className="container mx-auto">
      <nav className="flex items-center justify-between">
        <h1 className="font-semibold">Hi, {user.username}!</h1>
        <SignOut />
      </nav>

      <h2>Access Token</h2>
      <p>
        You can use your BigCommerce access token to make requests to the
        BigCommerce API.
      </p>

      <form action={saveToken}>
        <label htmlFor="storeHash">Store Hash</label>
        <input
          className="block w-full border"
          id="storeHash"
          name="storeHash"
          type="text"
        />
        <label htmlFor="accessToken">Access Token</label>
        <input
          className="block w-full border"
          id="accessToken"
          name="accessToken"
          type="password"
        />
        <button type="submit">Save</button>
      </form>

      {user.accessToken && user.storeHash && (
        <pre className="h-48 overflow-scroll rounded-md border bg-gray-50 p-1 text-sm">
          {await getScopesForToken(
            user.storeHash,
            await decrypt(user.accessToken, process.env.ACCESS_TOKEN_SECRET!),
          )}
        </pre>
      )}
    </main>
  );
}
