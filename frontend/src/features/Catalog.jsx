import {useMemo, useState} from 'react';
import {money} from '../services/orderRules.js';

const categoryOrder = [
  'Leafy greens', 'Fresh vegetables', 'Fresh fruit', 'Roots & tubers',
  'Herbs', 'Aromatics', 'Mushrooms', 'Sprouts', 'Peppers & chiles',
  'Squash & gourds', 'Beans & peas', 'Eggs', 'Tofu & plant-based',
  'Noodles & wrappers', 'Kimchi & fermented', 'Pantry nuts & legumes',
  'Frozen fruit & specialty'
];
const categoryIcons = {
  'Leafy greens': '🥬', 'Fresh vegetables': '🥕', 'Fresh fruit': '🍊',
  'Roots & tubers': '🥔', Herbs: '🌿', Aromatics: '🧄', Mushrooms: '🍄',
  Sprouts: '🌱', 'Peppers & chiles': '🌶️', 'Squash & gourds': '🎃',
  'Beans & peas': '🫛', Eggs: '🥚', 'Tofu & plant-based': '◻',
  'Noodles & wrappers': '🍜', 'Kimchi & fermented': '🥢',
  'Pantry nuts & legumes': '🥜', 'Frozen fruit & specialty': '🧊'
};

export default function Catalog({products, add}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All groceries');
  const availableCategories = useMemo(() => categoryOrder.filter(name =>
    products.some(product => product.category === name)
  ), [products]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter(product => {
      const inCategory = category === 'All groceries' || product.category === category;
      const searchable = [product.name, product.origin, product.pack, product.category]
        .filter(Boolean).join(' ').toLowerCase();
      return inCategory && (!term || searchable.includes(term));
    });
  }, [products, category, query]);

  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">A LITTLE MORE DELIGHT IN EVERYDAY</p>
        <h1>Good food,<br/><em>good days.</em></h1>
        <p className="hero-description">Explore fresh produce and pantry favorites from across Asia, thoughtfully gathered for your kitchen.</p>
        <div className="hero-highlights"><span>✳ Carefully selected</span><span>↗ Easy to explore</span></div>
        <button className="hero-action" onClick={() => document.getElementById('browse')?.scrollIntoView({behavior: 'smooth'})}>
          Browse the market <span aria-hidden="true">↓</span>
        </button>
      </div>
      <div className="hero-art">
        <img src={products.find(product => product.photo)?.photo} alt="Fresh produce from the Mori Market catalog"/>
        <span className="hero-sticker">Fresh<br/>finds ✳</span>
      </div>
    </section>
    <section id="browse" className="catalog-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MADE FOR YOUR KITCHEN</p>
          <h2>Find something lovely.</h2>
          <p className="section-intro">Browse by aisle or search for a favorite.</p>
        </div>
        <label className="search-wrap">
          <span aria-hidden="true">⌕</span>
          <input className="search" aria-label="Search products" placeholder="Search produce, herbs, noodles…" value={query} onChange={event => setQuery(event.target.value)}/>
          {query && <button className="clear-search" type="button" aria-label="Clear search" onClick={() => setQuery('')}>×</button>}
        </label>
      </div>
      <div className="category-bar" aria-label="Product categories">
        <button className={'category-chip all-chip' + (category === 'All groceries' ? ' selected' : '')} aria-pressed={category === 'All groceries'} onClick={() => setCategory('All groceries')}>
          <span aria-hidden="true">✳</span><span>All groceries</span><b>{products.length}</b>
        </button>
        {availableCategories.map(name => {
          const count = products.filter(product => product.category === name).length;
          return <button key={name} className={'category-chip' + (category === name ? ' selected' : '')} aria-pressed={category === name} onClick={() => setCategory(name)}>
            <span aria-hidden="true">{categoryIcons[name] || '•'}</span><span>{name}</span><b>{count}</b>
          </button>;
        })}
      </div>
      <div className="results-line" aria-live="polite">
        <p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'item' : 'items'}{category !== 'All groceries' ? ' in ' + category : ' to explore'}</p>
        <span>Supplier-listed prices · Pack sizes shown on each item</span>
      </div>
      {filtered.length > 0
        ? <div className="product-grid">{filtered.map(product => <article className="product" key={product.id}>
          <div className="product-photo">
            <img src={product.photo} alt={product.photoDescription || product.name} loading="lazy"/>
            <span className="origin-pill">{product.origin || 'Market find'}</span>
          </div>
          <div className="product-copy">
            <small className="product-category">{categoryIcons[product.category] || '✳'} {product.category}</small>
            <h3>{product.name}</h3>
            <p className="product-pack">{product.pack}</p>
            <footer>
              <strong>{product.price === null || product.review ? 'Quote needed' : money(product.price)}</strong>
              <button className="add-button" onClick={() => add(product.id)} aria-label={'Add ' + product.name + ' to cart'}>+</button>
            </footer>
            {product.photoSource && <a className="image-credit" href={product.photoSource} target="_blank" rel="noreferrer">Reference photo ↗</a>}
          </div>
        </article>)}</div>
        : <div className="empty-results"><span>⌕</span><h3>No matches this time</h3><p>Try a different item name, pack size, origin, or aisle.</p><button onClick={() => {setQuery(''); setCategory('All groceries');}}>Clear filters</button></div>}
    </section>
  </>;
}
