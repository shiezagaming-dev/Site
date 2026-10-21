import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Flame, Clock3, Plus, Minus, ShoppingBag, X, Check, Leaf, Menu as MenuIcon } from 'lucide-react';
import heroPizza from './assets/pizza-hero.png';
import meltingPizza from './assets/pizza-melt.png';

const pizzas = [
  { id: 1, name: 'The Sol', tag: 'THE SIGNATURE', desc: 'Tomato, fior di latte, pepperoni, basil, hot honey.', price: 12.9, category: 'Signature', image: heroPizza },
  { id: 2, name: 'Margherita', tag: 'A CLASSIC, PERFECTED', desc: 'San Marzano tomato, mozzarella, fresh basil.', price: 9.5, category: 'Classic', image: meltingPizza },
  { id: 3, name: 'Four Cheese', tag: 'RICH & CREAMY', desc: 'Mozzarella, gorgonzola, parmesan, creamy ricotta.', price: 11.9, category: 'Classic', image: heroPizza },
  { id: 4, name: 'Spicy Diablo', tag: 'A LITTLE HEAT', desc: 'Spicy salami, chilli, red onion, mozzarella.', price: 12.5, category: 'Signature', image: meltingPizza },
  { id: 5, name: 'Garden Verde', tag: 'GARDEN FRESH', desc: 'Roasted peppers, olives, red onion, basil pesto.', price: 10.9, category: 'Veggie', image: heroPizza },
  { id: 6, name: 'BBQ Smokehouse', tag: 'SMOKY & RICH', desc: 'Smoky BBQ sauce, chicken, red onion, mozzarella.', price: 12.9, category: 'Signature', image: meltingPizza },
];
const euro = n => `€${n.toFixed(2)}`;

function Reveal({ children, className = '', delay = 0 }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return <div className={`reveal ${shown ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pickupName, setPickupName] = useState('');
  const [pickupTime, setPickupTime] = useState('As soon as possible');
  const [size, setSize] = useState('Regular');
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraTopping, setExtraTopping] = useState(false);
  const [toast, setToast] = useState('');
  const filtered = useMemo(() => category === 'All' ? pizzas : pizzas.filter(p => p.category === category), [category]);
  const count = cart.reduce((n, item) => n + item.qty, 0);
  const subtotal = cart.reduce((n, item) => n + item.price * item.qty, 0);

  function addToCart(pizza, options = {}) {
    const itemPrice = pizza.price * (options.size === 'Large' ? 1.3 : options.size === 'Small' ? .8 : 1) + (options.cheese ? 1 : 0) + (options.topping ? 1.2 : 0);
    const key = `${pizza.id}-${options.size || 'Regular'}-${!!options.cheese}-${!!options.topping}`;
    setCart(old => {
      const existing = old.find(i => i.key === key);
      return existing ? old.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i) : [...old, { key, id: pizza.id, name: pizza.name, price: itemPrice, qty: 1, options: options.size || 'Regular', extras: [options.cheese && 'Extra cheese', options.topping && 'Extra topping'].filter(Boolean) }];
    });
    setSelectedPizza(null); setCartOpen(true); setToast(`${pizza.name} added to your bag`); setTimeout(() => setToast(''), 2400);
  }
  function changeQty(key, amount) { setCart(old => old.map(i => i.key === key ? { ...i, qty: i.qty + amount } : i).filter(i => i.qty > 0)); }
  function jumpTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }
  function submitOrder(e) { e.preventDefault(); if (!pickupName.trim() || !cart.length) return; setOrderPlaced(true); }

  return <div className="site-shell">
    <div className="announcement"><span className="pulse-dot"/> FRESH FROM THE OVEN <span className="announcement-sep">—</span> TAKEAWAY MADE WITH LOVE <span className="announcement-right">TUES — SUN · 12:00–22:00</span></div>
    <header className="nav-wrap">
      <a className="brand" href="#top" onClick={e => {e.preventDefault(); jumpTo('top')}}><span className="brand-mark"><Flame size={21}/></span><span>PIZZERIA <b>DEL SOL</b><small>FOR THE LOVE OF PIZZA</small></span></a>
      <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}><button onClick={() => jumpTo('menu')}>The menu</button><button onClick={() => jumpTo('ritual')}>Our ritual</button><button onClick={() => jumpTo('pickup')}>Takeaway</button></nav>
      <div className="nav-actions"><button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag"><ShoppingBag size={17}/><span>Bag</span><b>{count}</b></button><button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <MenuIcon/>}</button></div>
    </header>

    <main>
      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <Reveal><div className="eyebrow"><span/> YOUR LOCAL PIZZA RITUAL</div></Reveal>
          <Reveal delay={100}><h1>Fired by<br/><em>passion.</em><br/>Made for you.</h1></Reveal>
          <Reveal delay={200}><p className="hero-intro">Slow-made dough. Big Italian flavour.<br/>Straight from our oven to your hands.</p></Reveal>
          <Reveal delay={300}><div className="hero-buttons"><button className="button button-hot" onClick={() => jumpTo('menu')}>Explore the menu <ArrowUpRight size={18}/></button><button className="text-button" onClick={() => jumpTo('ritual')}>Our way of making it <ArrowRight size={16}/></button></div></Reveal>
          <Reveal delay={400}><div className="hero-proof"><div className="proof-icon"><Clock3 size={19}/></div><div><b>Made fresh to order</b><small>Ready for pickup in 20–30 min</small></div><div className="proof-divider"/><div><span className="stars">★★★★★</span><small>Made with care</small></div></div></Reveal>
          <div className="scroll-note"><span/> SCROLL TO DISCOVER</div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline"><span>01 / THE SIGNATURE</span><span className="round-stamp">FRESH<br/><b>DAILY</b><small>EST. WITH LOVE</small></span></div>
          <div className="hero-photo-frame"><img className="hero-photo" src={heroPizza} alt="Fresh pepperoni pizza with golden cheese"/><div className="photo-vignette"/><div className="photo-caption"><span className="live-dot"/> STRAIGHT FROM THE OVEN</div><div className="photo-index">01 <span>THE SOL PIZZA <ArrowUpRight size={16}/></span></div></div>
          <div className="hero-visual-bottom"><span>GOOD THINGS TAKE TIME</span><span>FLOUR · FIRE · FLAVOUR</span></div>
        </div>
      </section>

      <div className="ticker" aria-label="Pizzeria values"><div className="ticker-track">{Array.from({length: 4}, (_,i) => <span key={i}>FIRE MAKES FLAVOUR <i>✳</i> GOOD DOUGH TAKES TIME <i>✳</i> ALWAYS MADE FRESH <i>✳</i> PIZZA IS A LOVE LANGUAGE <i>✳</i></span>)}</div></div>

      <section className="menu-section section-pad" id="menu">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><span/> THE GOOD STUFF</div><h2>Find your <em>slice.</em></h2></div><p>Hand-stretched, generously topped<br/>and made fresh when you order.</p></div></Reveal>
        <div className="menu-toolbar"><div className="filter-list">{['All', 'Signature', 'Classic', 'Veggie'].map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'filter active' : 'filter'}>{c}</button>)}</div><span className="menu-count">{filtered.length.toString().padStart(2,'0')} PIZZAS TO LOVE</span></div>
        <div className="pizza-grid">{filtered.map((pizza, i) => <Reveal key={pizza.id} delay={i * 65} className="pizza-card"><div className="pizza-card-image"><img src={pizza.image} alt={`${pizza.name} pizza`} className={`food-photo photo-${pizza.id}`}/><div className="image-shade"/><span className="pizza-tag">{pizza.tag}</span><button className="add-quick" onClick={() => {setSelectedPizza(pizza); setSize('Regular'); setExtraCheese(false); setExtraTopping(false)}} aria-label={`Customize ${pizza.name}`}><Plus size={22}/></button><span className="photo-number">0{pizza.id}</span></div><div className="pizza-card-body"><div className="pizza-title-line"><h3>{pizza.name}</h3><b>{euro(pizza.price)}</b></div><p>{pizza.desc}</p><button className="customize-link" onClick={() => {setSelectedPizza(pizza); setSize('Regular'); setExtraCheese(false); setExtraTopping(false)}}>Make it yours <ArrowUpRight size={15}/></button></div></Reveal>)}</div>
        <div className="menu-footnote"><span>✳</span> Every pizza is made fresh. Good things are worth the wait.</div>
      </section>

      <section className="ritual-section section-pad" id="ritual">
        <div className="ritual-photo"><img src={meltingPizza} alt="Stretchy melted mozzarella on a freshly baked pizza"/><div className="ritual-photo-overlay"/><span className="vertical-label">A LITTLE HEAT. A LOT OF HEART.</span><div className="photo-sticker"><Flame/><b>MADE<br/>WITH FIRE</b></div></div>
        <div className="ritual-copy"><Reveal><div className="eyebrow"><span/> NOT FAST FOOD. GOOD FOOD.</div><h2>Good pizza<br/>isn't rushed.<br/><em>It's respected.</em></h2><p>We believe the best things start with simple ingredients, a little patience, and a very hot oven. Every pizza is built to order and baked until the crust is golden and the cheese is doing its thing.</p><div className="ritual-points"><div><span><Check size={17}/></span><p><b>Made by hand</b><small>Every dough ball gets the time it deserves.</small></p></div><div><span><Flame size={17}/></span><p><b>Finished in fire</b><small>That char, that crunch, that first bite.</small></p></div><div><span><Leaf size={17}/></span><p><b>Ingredients with intention</b><small>Simple ingredients. Big flavour.</small></p></div></div><button className="button button-outline" onClick={() => jumpTo('menu')}>Find your pizza <ArrowUpRight size={17}/></button></Reveal></div>
      </section>

      <section className="pickup-section section-pad" id="pickup"><div className="pickup-top"><div className="eyebrow"><span/> YOUR PIZZA, YOUR PLANS</div><span className="pickup-number">02 — TAKEAWAY</span></div><div className="pickup-content"><Reveal><h2>Hot pizza.<br/><em>Happy you.</em></h2><p>Order your favourites online, swing by, and take the good stuff home. No fuss. Just pizza.</p><button className="button button-hot" onClick={() => jumpTo('menu')}>Choose your pizza <ArrowUpRight size={17}/></button></Reveal><Reveal delay={150} className="pickup-card"><div className="pickup-card-icon"><Clock3 size={22}/></div><span className="eyebrow">THE PICKUP PLAN</span><h3>Fresh, not waiting.</h3><p>We aim for 20–30 minutes from order to pickup. Your pizza is made when you order, so it's at its best when it reaches you.</p><div className="pickup-card-line"><span>ORDER ONLINE</span><ArrowRight size={14}/><span>PICK IT UP</span><ArrowRight size={14}/><span>ENJOY</span></div></Reveal></div></section>
    </main>

    <footer className="footer section-pad"><a className="brand" href="#top" onClick={e => {e.preventDefault(); jumpTo('top')}}><span className="brand-mark"><Flame size={21}/></span><span>PIZZERIA <b>DEL SOL</b><small>FOR THE LOVE OF PIZZA</small></span></a><p>Good pizza. Good people. Good times.</p><button className="back-top" onClick={() => jumpTo('top')}>BACK TO TOP <ArrowUpRight size={15}/></button><div className="footer-bottom"><span>© 2026 PIZZERIA DEL SOL</span><span>MADE WITH FIRE <i>✳</i></span><span>TAKEAWAY · MADE FRESH</span></div></footer>

    {toast && <div className="toast"><Check size={17}/>{toast}</div>}

    {selectedPizza && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setSelectedPizza(null)}}><div className="custom-modal"><button className="modal-close" onClick={() => setSelectedPizza(null)} aria-label="Close"><X/></button><div className="custom-image"><img src={selectedPizza.image} alt={selectedPizza.name}/></div><div className="custom-content"><span className="eyebrow"><span/> MAKE IT YOURS</span><h2>{selectedPizza.name}</h2><p>{selectedPizza.desc}</p><label className="option-label">PIZZA SIZE</label><div className="size-options">{['Small','Regular','Large'].map(s => <button key={s} className={size === s ? 'size-option active' : 'size-option'} onClick={() => setSize(s)}>{s}<small>{s === 'Small' ? '−20%' : s === 'Large' ? '+30%' : 'Classic'}</small></button>)}</div><label className="check-option"><input type="checkbox" checked={extraCheese} onChange={e => setExtraCheese(e.target.checked)}/><span>Extra cheese</span><b>+€1.00</b></label><label className="check-option"><input type="checkbox" checked={extraTopping} onChange={e => setExtraTopping(e.target.checked)}/><span>Extra topping</span><b>+€1.20</b></label><button className="button button-hot add-modal" onClick={() => addToCart(selectedPizza, {size, cheese: extraCheese, topping: extraTopping})}>Add to bag <span>{euro(selectedPizza.price * (size === 'Large' ? 1.3 : size === 'Small' ? .8 : 1) + (extraCheese ? 1 : 0) + (extraTopping ? 1.2 : 0))}</span></button></div></div></div>}

    {cartOpen && <div className="drawer-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setCartOpen(false)}}><aside className="cart-drawer"><div className="drawer-head"><div><span className="eyebrow"><span/> YOUR ORDER</span><h2>Your bag <small>({count})</small></h2></div><button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>{!cart.length ? <div className="empty-cart"><ShoppingBag size={34}/><h3>Your bag is taking a break.</h3><p>Let's fix that with something cheesy.</p><button className="button button-hot" onClick={() => {setCartOpen(false); jumpTo('menu')}}>Explore the menu <ArrowRight size={16}/></button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.key}><div className="cart-item-photo"><img src={pizzas.find(p => p.id === item.id)?.image} alt=""/></div><div className="cart-item-info"><b>{item.name}</b><small>{item.options}{item.extras.length ? ` · ${item.extras.join(', ')}` : ''}</small><strong>{euro(item.price * item.qty)}</strong><div className="qty-control"><button onClick={() => changeQty(item.key, -1)} aria-label="Remove one"><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.key, 1)} aria-label="Add one"><Plus size={13}/></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{euro(subtotal)}</b></div><small>Pickup only · Taxes included in displayed prices.</small><button className="button button-hot checkout-button" onClick={() => {setCheckoutOpen(true); setCartOpen(false); setOrderPlaced(false)}}>Continue to pickup <ArrowRight size={17}/></button></div></>}</aside></div>}

    {checkoutOpen && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setCheckoutOpen(false)}}><div className="checkout-modal"><button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close"><X/></button>{orderPlaced ? <div className="order-success"><span className="success-icon"><Check size={30}/></span><span className="eyebrow">DEMO ORDER COMPLETE</span><h2>Looking good,<br/><em>{pickupName}.</em></h2><p>Your demo order has been prepared on screen. No real order has been sent to a restaurant.</p><div className="success-total">Order total <b>{euro(subtotal)}</b></div><button className="button button-hot" onClick={() => {setCart([]); setCheckoutOpen(false); setOrderPlaced(false); setPickupName('')}}>Back to the good stuff</button></div> : <><span className="eyebrow"><span/> ALMOST PIZZA TIME</span><h2>Pickup <em>details.</em></h2><p className="checkout-note">This is a demo checkout. It won't send a real order yet.</p><form onSubmit={submitOrder}><label className="form-label">YOUR NAME<input required value={pickupName} onChange={e => setPickupName(e.target.value)} placeholder="Name for the order"/></label><label className="form-label">WHEN WOULD YOU LIKE IT?<select value={pickupTime} onChange={e => setPickupTime(e.target.value)}><option>As soon as possible</option><option>In 45 minutes</option><option>In 1 hour</option><option>In 1 hour 30 minutes</option></select></label><div className="checkout-total"><span>Order total</span><b>{euro(subtotal)}</b></div><button className="button button-hot checkout-button" type="submit">Place demo order <ArrowRight size={17}/></button></form></>}</div></div>}
  </div>;
}
