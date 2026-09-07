import { Hero } from "@/components/Hero";
import { Lore } from "@/components/Lore";
import { WhitelistForm } from "@/components/WhitelistForm";
import { Roadmap } from "@/components/Roadmap";

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <Lore />
      <WhitelistForm />
      <Roadmap />
    </div>
  );
}
