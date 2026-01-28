export const runtime = 'edge';

export default function Pricing(): JSX.Element {
  return (
    <>
      <section className="section" id="pricing-header">
        <h1>Pricing.</h1>
        <p><span className="inline-white">Be among the first to capture the imagination of your buyers like never before. Each model includes a 1-month free trial for the $29/mo hosting.</span></p>
      </section>
      <section className="section" id="pricing">
        <div className="pricing-grid">
          <div className="pricing-card">
            <h2>Autonomous capture.</h2>
            <div className="price">$599</div>
            <p>Your drone follows an automated flight path—no hassle, no extra gear. We train the neural network and host the embeddable link. Hosting continues at $29/month after your free first month.</p>
            <a href="/create" className="cta-button">Create your model</a>
          </div>
          <div className="pricing-card">
            <h2>Custom.</h2>
            <p>High-volume or specialized projects? We'll create a tailored plan to meet your needs.</p>
            <a href="mailto:gabriel@spcprt.com?subject=Custom%20Pricing%20Inquiry&body=Hello%2C%20I%27m%20interested%20in%20learning%20more%20about%20custom%20pricing%20options%20at%20Spaceport." className="cta-button">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
}

