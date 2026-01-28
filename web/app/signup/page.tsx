export const runtime = 'edge';

export default function Signup(): JSX.Element {
  return (
    <section className="section" id="signup">
      <h1>Join the waitlist.</h1>
      <form action="/api/signup" method="post" style={{ maxWidth: 520 }}>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <button className="cta-button" type="submit">Sign up</button>
      </form>
    </section>
  );
}


