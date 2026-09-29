export default function AboutPage() {
  return (
    <div className="container page prose">
      <h1>About Smart Food Explorer</h1>
      <p>
        Smart Food Explorer & Meal Planner helps you browse a product catalogue, narrow it down with
        search and filters, compare your shortlist, and keep a running shopping list.
      </p>

      <h2>Where the data comes from</h2>
      <p>
        Every product is fetched live from the public <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">DummyJSON Products API</a>:
        the groceries category, product search and single product endpoints. Only food items are shown. There is no backend and no database of our own.
      </p>

      <h2>Main features</h2>
      <ul>
        <li>Search, food type, price, rating and stock filters that work together, plus sorting.</li>
        <li>Explorer Score: an application-generated score built from rating, discount and stock. It is not an official rating.</li>
        <li>Compare up to 3 products with differences highlighted.</li>
        <li>Favorites, shopping list and recently viewed products, saved in your browser with localStorage.</li>
        <li>Shareable URLs for search and filter state, dark mode, and a “/” shortcut to focus search.</li>
      </ul>

      <h2>Built with</h2>
      <p>React 18, TypeScript, React Router 6, Vite, the Fetch API, and plain CSS.</p>
    </div>
  );
}
