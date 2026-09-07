import { redirect } from "next/navigation";

/** Old GameFi portfolio route — SPA-first Nightfall City lives at `/`. */
export default function PortfolioRedirectPage() {
  redirect("/");
}
