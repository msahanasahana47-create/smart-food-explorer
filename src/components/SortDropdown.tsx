import { SORT_OPTIONS } from '../types/product';
import type { SortOption } from '../types/product';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="sort">
      <label htmlFor="sort-select">Sort by</label>
      <select id="sort-select" value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
