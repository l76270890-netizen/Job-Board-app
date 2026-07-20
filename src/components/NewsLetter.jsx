import "./NewsLetter.css";

function NewsLetter() {
  return (
    <section className="newsletter">
      <h2>Get New Job Alerts</h2>
      <p>Be the first to know about new jobs in Nigeria</p>
      <form>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </form>
    </section>
  )
}
export default NewsLetter;