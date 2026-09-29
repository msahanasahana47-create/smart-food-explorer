import type { Product } from '../types/product';
import { calculateFoodScore, scoreLabel } from '../utils/foodScore';

interface FoodScoreProps {
  product: Pick<Product, 'rating' | 'discountPercentage' | 'stock'>;
  detailed?: boolean;
}

export default function FoodScore({ product, detailed = false }: FoodScoreProps) {
  const score = calculateFoodScore(product);
  const tone = score.total >= 80 ? 'high' : score.total >= 60 ? 'mid' : 'low';

  return (
    <div className={`score score--${tone}`}>
      <div className="score__row">
        <span className="score__value" aria-hidden="true">{score.total}</span>
        <div>
          <strong>Explorer Score: {score.total}/100</strong>
          {detailed && <span className="score__label"> · {scoreLabel(score.total)}</span>}
          <div
            className="score__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score.total}
            aria-label="Explorer score"
          >
            <span style={{ width: `${score.total}%` }} />
          </div>
        </div>
      </div>
      {detailed && (
        <ul className="score__breakdown">
          <li>Rating: {score.rating}/50</li>
          <li>Discount: {score.discount}/20</li>
          <li>Availability: {score.availability}/30</li>
        </ul>
      )}
      <p className="score__note">Application-generated score, not an official rating.</p>
    </div>
  );
}
