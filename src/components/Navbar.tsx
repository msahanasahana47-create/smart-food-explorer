import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { favorites, compare, shoppingCount, theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links: { to: string; label: string; count?: number }[] = [
    { to: '/products', label: 'Products' },
    { to: '/favorites', label: 'Favorites', count: favorites.length },
    { to: '/compare', label: 'Compare', count: compare.length },
    { to: '/shopping-list', label: 'Shopping List', count: shoppingCount },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/products" className="logo" aria-label="Food Explorer home">
          <span className="logo__mark" aria-hidden="true">🥑</span>
          <span className="logo__text">Food Explorer</span>
        </Link>

        <nav id="main-nav" className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
            >
              {link.label}
              {link.count !== undefined && link.count > 0 && (
                <span className="badge" aria-label={`${link.count} items`}>{link.count}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
