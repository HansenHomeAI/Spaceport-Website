export const runtime = 'edge';

export default function Landing(): JSX.Element {
  return (
    <>
      <section className="section" id="landing">
        <iframe className="landing-iframe" src="https://hansenhomeai.github.io/WebbyDeerKnoll/" />
        <div id="iframe-overlay" />
        <div className="landing-content">
          <h1>Location. Visualized in 3D.</h1>
          <a href="https://10716eforestcreekrd.hansentour.com" className="cta-button with-symbol">
            <img src="/assets/3DSymbol.svg" className="symbol-3d" alt="" aria-hidden="true" />
            View example
          </a>
        </div>
      </section>

      {/* Logos carousel */}
      <section className="section" id="landing-carousel">
        <div className="logo-carousel">
          <div className="logos">
            <img src="/assets/MirrRanchGroup.png" alt="Mirr Ranch Group" />
            <img src="/assets/MullinRealEstate.png" alt="Mullin Real Estate" />
            <img src="/assets/MirrRanchGroup2.png" alt="Mirr Ranch Group" />
            <img src="/assets/MullinRealEstate2.png" alt="Mullin Real Estate" />
            <img src="/assets/White6SpaceFullLogo.svg" alt="Spaceport" />
          </div>
        </div>
      </section>

      {/* Stats section matching legacy visuals */}
      <section className="section" id="landing-stats">
        <div className="stats-grid">
          <div className="stat-box">
            <h1>10×</h1>
            <p>Higher engagement compared to traditional listing media.</p>
          </div>
          <div className="stat-box">
            <h1>72%</h1>
            <p>Of buyers say location context is their top priority.</p>
          </div>
          <div className="stat-box">
            <h1>3 days</h1>
            <p>From upload to a fully immersive 3D model in your inbox.</p>
          </div>
        </div>
        <p className="stats-source">Internal analytics and industry benchmarks.</p>
      </section>
    </>
  );
}

