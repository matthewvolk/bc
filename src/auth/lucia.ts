import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub } from "arctic";
import { Lucia } from "lucia";

import { db } from "@/db";
import { sessionTable, userTable } from "@/db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username,
      storeHash: attributes.storeHash,
      accessToken: attributes.accessToken,
    };
  },
});

export const github = new GitHub(
  process.env.GITHUB_OAUTH_CLIENT_ID!,
  process.env.GITHUB_OAUTH_CLIENT_SECRET!,
);

declare module "lucia" {
  // eslint-disable-next-line no-unused-vars
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  github_id: number;
  username: string;
  storeHash?: string;
  accessToken?: string;
}
