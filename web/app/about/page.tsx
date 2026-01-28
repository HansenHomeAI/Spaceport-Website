export const runtime = 'edge';

export default function About(): JSX.Element {
  return (
    <>
      <section className="section two-col-section" id="about">
        <h1>About Spaceport AI.</h1>
        <p><span className="inline-white">Real estate is all about location—yet most listings fail to showcase it properly. Photos and 3D tours capture the inside of a home well, but they leave out what matters most: the context, the surroundings, the feel of the space.</span></p>
        <div className="right-col">
          <p><span className="inline-white">That's where Spaceport AI comes in.</span></p>
        </div>
      </section>
      <section className="section two-col-section" id="about-mission">
        <div className="two-col-content">
          <h2>How it works.</h2>
          <div className="right-col">
            <p><span className="inline-white">Plan your flight</span> – A drone pilot generates a flight path right here on our platform.</p>
            <p><span className="inline-white">Capture and upload</span> – The drone follows the path, taking photos, which are then uploaded back to us.</p>
            <p><span className="inline-white">Get your model</span> – We train a neural network on the images, and within 3 days, you receive a fully immersive 3D model straight to your inbox.</p>
            <a href="/create" className="cta-button2-fixed">Create your own</a>
          </div>
        </div>
      </section>
      <section className="section two-col-section" id="about-innovation">
        <div className="two-col-content">
          <h2>Bringing AI to real estate.</h2>
          <div className="right-col">
            <p>Noticing firsthand how listings fail to capture what buyers actually care about, 21-year-old founder Gabriel Hansen set out to fix it. Teaching himself computer science from the ground up, he built Spaceport—combining advances in neural networks with drone technology to create a whole new way to showcase location.</p>
            <p>Our mission is simple: make the best tool for property marketing.</p>
          </div>
        </div>
      </section>
    </>
  );
}

