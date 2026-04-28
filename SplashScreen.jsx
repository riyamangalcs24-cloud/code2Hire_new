function SplashScreen() {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-glow splash-glow-left"></div>
      <div className="splash-glow splash-glow-right"></div>
      <div className="splash-center">
        <div className="splash-mark">
          <i className="fa-solid fa-code"></i>
        </div>
        <div className="splash-brand">
          <span className="splash-kicker">Interview prep, reimagined</span>
          <h1>code2hire</h1>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen