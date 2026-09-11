/** Fixed CRT scanlines + VHS grain + occasional TV tears / RGB wash. */
export function ScanlineOverlay() {
  return (
    <>
      <div className="scanlines" aria-hidden />
      <div className="vhs-grain" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="site-crt-rgb" aria-hidden />
      <div className="site-crt-tear site-crt-tear--a" aria-hidden />
      <div className="site-crt-tear site-crt-tear--b" aria-hidden />
      <div className="site-crt-flash" aria-hidden />
    </>
  );
}
