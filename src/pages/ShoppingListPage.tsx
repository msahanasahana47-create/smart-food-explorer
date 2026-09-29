import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';
import EmptyState from '../components/EmptyState';
import ShoppingListItem from '../components/ShoppingListItem';

export default function ShoppingListPage() {
  const { shoppingList, shoppingCount, clearShoppingList } = useApp();
  const total = shoppingList.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Shopping list</h1>
        {shoppingList.length > 0 && (
          <button type="button" className="btn btn--ghost" onClick={clearShoppingList}>Clear list</button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <EmptyState
          title="Your shopping list is empty."
          message="Open a product and choose Add to Shopping List."
          icon="🛒"
          action={<Link to="/products" className="btn btn--primary">Browse products</Link>}
        />
      ) : (
        <>
          <ul className="list">
            {shoppingList.map((item) => <ShoppingListItem key={item.id} item={item} />)}
          </ul>
          <section className="summary card" aria-label="Order summary">
            <p>Total items: <strong>{shoppingCount}</strong></p>
            <p>Estimated total price: <strong className="price price--lg">{formatPrice(total)}</strong></p>
          </section>
        </>
      )}
    </div>
  );
}
