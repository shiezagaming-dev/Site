import { useMemo, useState } from 'react';
import PizzaScene from './PizzaScene.jsx';
import solPhoto from './assets/the-sol.jpg';
import margheritaPhoto from './assets/margherita.jpg';
import cheesePhoto from './assets/four-cheese.jpg';
import spicyPhoto from './assets/spicy-diablo.jpg';
import gardenPhoto from './assets/garden-verde.jpg';
import bbqPhoto from './assets/bbq-smokehouse.jpg';
import pullPhoto from './assets/cheese-pull-reference.jpg';
import ovenPhoto from './assets/oven-pizza.jpg';

const pizzas = [
  {id:1,name:'The Sol',category:'Classic',price:12.9,description:'Tomato, fior di latte, pepperoni, basil, hot honey.',photo:solPhoto,badge:'HOUSE FAVOURITE'},
  {id:2,name:'Margherita',category:'Classic',price:9.5,description:'San Marzano tomato, mozzarella, fresh basil.',photo:margheritaPhoto,badge:'THE CLASSIC'},
  {id:3,name:'Four Cheese',category:'Special',price:11.9,description:'Mozzarella, gorgonzola, parmesan, creamy ricotta.',photo:cheesePhoto,badge:'EXTRA MELTY'},
  {id:4,name:'Spicy Diablo',category:'Hot',price:12.5,description:'Spicy salami, chilli, red onion, mozzarella.',photo:spicyPhoto,badge:'A LITTLE HEAT'},
  {id:5,name:'Garden Verde',category:'Veggie',price:10.9,description:'Roasted peppers, olives, red onion, basil pesto.',photo:gardenPhoto,badge:'FROM THE GARDEN'},
  {id:6,name:'BBQ Smokehouse',category:'Meat',price:12.9,description:'Smoky BBQ sauce, chicken, red onion, mozzarella.',photo:bbqPhoto,badge:'SMOKY & RICH'},
];
const categories=['All','Classic','Special','Meat','Veggie','Hot'];
const money=(n)=>`€${n.toFixed(2)}`;

export default function App(){
  const [filter,setFilter]=useState('All');
  const [cart,setCart]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [customer,setCustomer]=useState({name:'',phone:'',time:'As soon as possible',notes:''});
  const [orderSent,setOrderSent]=useState(false);
  const shown=useMemo(()=>filter==='All'?pizzas:pizzas.filter(p=>p.category===filter),[filter]);
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const add=(pizza)=>{setCart(old=>{const found=old.find(x=>x.id===pizza.id);return found?old.map(x=>x.id===pizza.id?{...x,qty:x.qty+1}:x):[...old,{...pizza,qty:1}];});setCartOpen(true);};
  const changeQty=(id,delta)=>setCart(old=>old.map(x=>x.id===id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0));
  const jump=(id)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const submitOrder=(e)=>{e.preventDefault();setOrderSent(true);};
  return <>
    <PizzaScene />
    <div className="ambient-vignette" />
    <header className="nav-bar">
      <a className="brand" href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}}><span className="brand-sun">✳</span><span>Pizzeria <b>del Sol</b></span></a>
      <nav><a className="active" href="#top">Home</a><a href="#menu">Menu</a><a href="#story">Our craft</a><a href="#pickup">Pickup</a></nav>
      <div className="nav-actions"><button className="cart-button" onClick={()=>setCartOpen(true)} aria-label="Open cart">Bag <span>{count}</span></button><button className="nav-order" onClick={()=>jump('menu')}>Order takeaway <span>↗</span></button></div>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy reveal">
          <div className="eyebrow"><i/> AUTHENTIC ITALIAN PIZZA</div>
          <h1>Fired by<br/><em>passion.</em><br/>Made for you.</h1>
          <p>Slow-made dough. Real ingredients. Big Italian flavour.<br className="desktop-break"/> Straight from our oven to your hands.</p>
          <div className="hero-ctas"><button className="button button-primary" onClick={()=>jump('menu')}>Explore the menu <span>↗</span></button><button className="text-button" onClick={()=>jump('story')}>Our way of making it <span>↗</span></button></div>
          <div className="hero-meta"><div className="meta-icon">◷</div><div><b>Made fresh to order</b><small>Ready for pickup in 20–30 min</small></div><span className="meta-divider"/><div className="stars">★★★★★<small>Made with care</small></div></div>
        </div>
        <div className="hero-scene-label"><span className="live-dot"/> LIVE FROM THE OVEN <span className="label-line"/> <b>01</b> / 03</div>
        <div className="scroll-cue" onClick={()=>jump('story')} role="button" tabIndex="0"><span className="scroll-mouse"/> Scroll to discover</div>
        <div className="hero-stamp"><span>FRESH</span><b>DAILY</b><small>EST. WITH LOVE</small></div>
      </section>

      <section className="story section-wrap" id="story">
        <div className="story-photo-wrap"><img src={pullPhoto} alt="Fresh pizza with stretchy melted mozzarella" className="story-photo"/><div className="photo-glow"/><div className="photo-caption"><span>THE MOMENT IT MELTS</span><b>Golden edges. Stretchy cheese.</b></div></div>
        <div className="story-copy reveal"><div className="eyebrow"><i/> THE ART OF THE PERFECT CRUST</div><h2>Good pizza<br/>isn't rushed.<br/><em>It's respected.</em></h2><p>We believe the best things start with simple ingredients, a little patience, and a very hot oven. Every pizza is built to order and baked until the crust is golden and the cheese is doing its thing.</p><div className="story-points"><div><span>01</span><p><b>Made by hand</b><small>Every dough ball gets the time it deserves.</small></p></div><div><span>02</span><p><b>Finished in fire</b><small>That char, that crunch, that first bite.</small></p></div></div><button className="button button-outline" onClick={()=>jump('menu')}>Find your pizza <span>↗</span></button></div>
      </section>

      <section className="menu-section section-wrap" id="menu">
        <div className="menu-heading"><div><div className="eyebrow"><i/> YOUR LOCAL PIZZA RITUAL</div><h2>Find your <em>favourite.</em></h2><p>Classic comfort or something with a little kick — there’s a pizza with your name on it.</p></div><div className="menu-side-note">FRESH FROM THE FIRE <span>✳</span></div></div>
        <div className="filters" role="tablist" aria-label="Filter pizzas">{categories.map(c=><button key={c} className={filter===c?'selected':''} onClick={()=>setFilter(c)} role="tab" aria-selected={filter===c}>{c}</button>)}</div>
        <div className="pizza-grid">{shown.map((p,i)=><article className="pizza-card" key={p.id} style={{'--delay':`${i*70}ms`}}><div className="card-photo"><img src={p.photo} alt={`${p.name} pizza`} loading="lazy"/><span className="card-badge">{p.badge}</span><button className="add-button" onClick={()=>add(p)} aria-label={`Add ${p.name} to cart`}>+</button><span className="photo-number">0{p.id}</span></div><div className="card-info"><div className="card-title-row"><h3>{p.name}</h3><strong>{money(p.price)}</strong></div><p>{p.description}</p><button className="customize-link" onClick={()=>add(p)}>Add to your order <span>↗</span></button></div></article>)}</div>
      </section>

      <section className="oven-banner section-wrap"><img src={ovenPhoto} alt="Golden pizza fresh from the oven" loading="lazy"/><div className="oven-overlay"/><div className="oven-text"><div className="eyebrow"><i/> STRAIGHT FROM OUR OVEN</div><h2>Hot, fresh,<br/><em>worth the wait.</em></h2><button className="button button-primary" onClick={()=>jump('menu')}>Order your pizza <span>↗</span></button></div><div className="oven-number">250° <small>OVEN LOVE</small></div></section>

      <section className="pickup section-wrap" id="pickup"><div className="pickup-mark">✳</div><div><div className="eyebrow"><i/> TAKEAWAY, THE WAY IT SHOULD BE</div><h2>Your pizza.<br/><em>Your moment.</em></h2><p>Made fresh. Packed with care. Ready when you are.</p></div><button className="button button-primary" onClick={()=>jump('menu')}>Choose your pizza <span>↗</span></button></section>
    </main>
    <footer><a className="brand" href="#top"><span className="brand-sun">✳</span><span>Pizzeria <b>del Sol</b></span></a><span>Fired by passion. Made for you.</span><span>© 2026 Pizzeria del Sol</span></footer>

    {cartOpen&&<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setCartOpen(false);}}><aside className="cart-drawer"><div className="drawer-head"><div><div className="eyebrow"><i/> YOUR ORDER</div><h2>Your bag <span>({count})</span></h2></div><button className="close-button" onClick={()=>setCartOpen(false)} aria-label="Close cart">×</button></div>{cart.length===0?<div className="empty-cart"><div>✳</div><h3>Your next favourite is waiting.</h3><p>Add a pizza from the menu and we’ll get the oven going.</p><button className="button button-primary" onClick={()=>{setCartOpen(false);jump('menu');}}>Explore the menu ↗</button></div>:<><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.id}><img src={item.photo} alt=""/><div className="cart-item-main"><b>{item.name}</b><small>{money(item.price)} each</small><div className="qty-controls"><button onClick={()=>changeQty(item.id,-1)} aria-label="Decrease quantity">−</button><span>{item.qty}</span><button onClick={()=>changeQty(item.id,1)} aria-label="Increase quantity">+</button></div></div><strong>{money(item.price*item.qty)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(total)}</b></div><small>Pickup only · taxes included in displayed prices</small><button className="button button-primary full-button" onClick={()=>{setCartOpen(false);setCheckoutOpen(true);setOrderSent(false);}}>Continue to pickup <span>↗</span></button></div></>}</aside></div>}

    {checkoutOpen&&<div className="modal-backdrop"><section className="checkout-modal"><button className="close-button modal-close" onClick={()=>setCheckoutOpen(false)} aria-label="Close checkout">×</button>{orderSent?<div className="order-success"><div className="success-icon">✓</div><div className="eyebrow"><i/> DEMO CHECKOUT</div><h2>Looking <em>delicious.</em></h2><p>Your demo order is ready to review, but this site is not connected to a real restaurant order system yet.</p><div className="success-total">Demo total <b>{money(total)}</b></div><button className="button button-primary full-button" onClick={()=>{setCheckoutOpen(false);setCart([]);setOrderSent(false);}}>Back to the website</button></div>:<><div className="eyebrow"><i/> PICKUP DETAILS</div><h2>Almost <em>there.</em></h2><p className="checkout-intro">Tell us where to send your pickup confirmation. This is a demo form — it will not place a real order.</p><form onSubmit={submitOrder}><label>Your name<input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Name for the order"/></label><label>Phone number<input required type="tel" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="Your phone number"/></label><label>Pickup time<select value={customer.time} onChange={e=>setCustomer({...customer,time:e.target.value})}><option>As soon as possible</option><option>In 30 minutes</option><option>In 45 minutes</option><option>In 1 hour</option></select></label><label>Notes (optional)<textarea value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})} placeholder="Any notes for the kitchen?" rows="2"/></label><div className="checkout-total"><span>Total</span><b>{money(total)}</b></div><button className="button button-primary full-button" type="submit">Review demo order <span>↗</span></button></form></>}</section></div>}
  </>;
}
