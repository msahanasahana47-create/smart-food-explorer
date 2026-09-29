import { Link } from 'react-router-dom';
import type { ShoppingListItem as Item } from '../types/product';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';

export default function ShoppingListItem({ item }: { item: Item }) {
  const { changeQuantity, removeFromShoppingList } = useApp();

  return (
    <li className="list-item card">
      <img src={item.thumbnail} alt={item.title} width={88} height={88} loading="lazy" />
      <div className="list-item__info">
        <Link to={`/products/${item.id}`}><strong>{item.title}</strong></Link>
        <span className="price">{formatPrice(item.price)}</span>
      </div>
      <div className="qty" role="group" aria-label={`Quantity for ${item.title}`}>
        <button type="button" className="icon-btn" onClick={() => changeQuantity(item.id, -1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
        <output aria-live="polite">{item.quantity}</output>
        <button type="button" className="icon-btn" onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
      </div>
      <span className="list-item__subtotal">{formatPrice(item.price * item.quantity)}</span>
      <button type="button" className="btn btn--ghost btn--danger" onClick={() => removeFromShoppingList(item.id)} aria-label={`Remove ${item.title}`}>
        Remove
      </button>
    </li>
  );
}
