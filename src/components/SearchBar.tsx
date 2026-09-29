import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the box in sync when the URL changes (e.g. back button, clear).
  useEffect(() => {
    setText(value);
  }, [value]);

  // Debounce typing so we do not call the API on every keystroke.
  useEffect(() => {
    if (text === value) return;
    const id = window.setTimeout(() => onSearch(text), 400);
    return () => window.clearTimeout(id);
  }, [text, value, onSearch]);

  // Keyboard shortcut: "/" focuses the search box.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(text.trim());
  };

  const clear = () => {
    setText('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <label htmlFor="product-search" className="sr-only">Search products</label>
      <span className="searchbar__icon" aria-hidden="true">🔍</span>
      <input
        id="product-search"
        ref={inputRef}
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products, e.g. apple, chicken, juice   (press / to focus)"
        autoComplete="off"
      />
      {text && (
        <button type="button" className="btn btn--ghost searchbar__clear" onClick={clear}>
          Clear search
        </button>
      )}
      <button type="submit" className="btn btn--primary">Search</button>
    </form>
  );
}
