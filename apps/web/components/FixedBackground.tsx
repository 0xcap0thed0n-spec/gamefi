import { site } from "@/content/site";

/** Fixed full-viewport background art - does not move on scroll. */
export function FixedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        backgroundImage: `url(${site.assets.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-void-950/70" />
    </div>
  );
}