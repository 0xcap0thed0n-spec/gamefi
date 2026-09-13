import { site } from "@/content/site";

/** Fixed full-viewport background art - does not move on scroll. */
export function FixedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-cover bg-no-repeat max-md:[background-position:28%_center] md:bg-center"
      aria-hidden
      style={{
        backgroundImage: `url(${site.assets.background})`,
      }}
    >
      <div className="absolute inset-0 bg-void-950/70" />
    </div>
  );
}
