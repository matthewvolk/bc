"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { authorize } from "@/auth/authorize";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { encrypt } from "@/lib/crypto";

export const saveToken = async (formData: FormData) => {
  const { user } = await authorize();

  if (!user) {
    throw new Error("User not found");
  }

  const storeHash = formData.get("storeHash") as string;
  const accessToken = formData.get("accessToken") as string;

  const encrypted = await encrypt(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
  );

  await db
    .update(userTable)
    .set({
      storeHash,
      accessToken: encrypted,
    })
    .where(eq(userTable.id, user.id));

  revalidatePath("/dashboard");
};
