import { Hero } from "@/components/Hero";
import { Lore } from "@/components/Lore";
import { WhitelistForm } from "@/components/WhitelistForm";
import { Teaser } from "@/components/Teaser";

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <Lore />
      <WhitelistForm />
      <Teaser />
    </div>
  );
}
