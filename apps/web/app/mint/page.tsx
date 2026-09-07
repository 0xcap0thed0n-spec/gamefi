import { redirect } from "next/navigation";

/** Old GameFi mint route — SPA-first Nightfall City lives at `/`. */
export default function MintRedirectPage() {
  redirect("/");
}
