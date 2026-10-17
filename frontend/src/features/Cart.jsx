import {money,priceOrder} from '../services/orderRules.js';
export default function Cart({products,cart,setCart,onCheckout}){
 const lines=Object.entries(cart).filter(([,q])=>q>0).map(([productId,quantity])=>({productId,quantity}));
 if(!lines.length)return <section className="panel empty"><h1>Your cart is waiting.</h1><p>Pick something delicious from the market.</p></section>;
 const totals=priceOrder(products,lines);
 function quantity(id,n){setCart(old=>{const next={...old};if(n<=0)delete next[id];else next[id]=Math.min(n,99);return next;});}
 return <><h1>Your market bag.</h1><div className="two-column"><section className="panel">{totals.items.map(p=><div className="line-item" key={p.id}><img src={p.photo} alt={p.name}/><div><strong>{p.name}</strong><small>{p.pack}</small><button className="text-button" onClick={()=>quantity(p.id,0)}>Remove</button></div><div className="quantity"><button aria-label={`Decrease ${p.name}`} onClick={()=>quantity(p.id,p.quantity-1)}>−</button><span>{p.quantity}</span><button aria-label={`Increase ${p.name}`} onClick={()=>quantity(p.id,p.quantity+1)}>+</button></div><b>{p.quote?'Quote pending':money(p.price*p.quantity)}</b></div>)}</section><aside className="panel"><h2>A good bag.</h2><p className="total"><span>Priced items</span><strong>{money(totals.subtotal)}</strong></p><p className="muted">Delivery calculated at checkout. Quote items are excluded from payment.</p><button className="primary wide" onClick={onCheckout}>Continue to checkout →</button></aside></div></>;
}
