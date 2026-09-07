/** Fixed CRT scanlines + subtle VHS grain. pointer-events none. */
export function ScanlineOverlay() {
  return (
    <>
      <div className="scanlines" aria-hidden />
      <div className="vhs-grain" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  );
}
