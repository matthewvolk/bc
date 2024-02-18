import { signOut } from "@/actions/sign-out";

export const SignOut = () => {
  return (
    <form action={signOut}>
      <button className="rounded-md bg-neutral-900 px-2.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black">
        Sign out
      </button>
    </form>
  );
};
