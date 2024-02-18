"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authorize } from "@/auth/authorize";
import { lucia } from "@/auth/lucia";

export const signOut = async (): Promise<ActionResult> => {
  const { session } = await authorize();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
};

interface ActionResult {
  error: string | null;
}
