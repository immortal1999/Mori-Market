import {useEffect,useState} from 'react';
import {api,isDemo} from './services/api.js';
import Catalog from './features/Catalog.jsx';
import Cart from './features/Cart.jsx';
import Checkout from './features/Checkout.jsx';
import Orders from './features/Orders.jsx';
import ChatBox from './components/ChatBox.jsx';
function readCart(){try{const c=JSON.parse(localStorage.getItem('mori-react-cart-v1')||'{}');return Object.fromEntries(Object.entries(c).filter(([,q])=>Number.isInteger(q)&&q>0&&q<=99));}catch{return {};}}
export default function App(){
 const [page,setPage]=useState(location.hash.slice(1)||'shop'),[products,setProducts]=useState([]),[orders,setOrders]=useState([]),[cart,setCart]=useState(readCart),[error,setError]=useState(''),[loading,setLoading]=useState(true),[notice,setNotice]=useState('');
 useEffect(()=>{let active=true;Promise.all([api.products(),api.orders()]).then(([p,o])=>{if(active){setProducts(p);setOrders(o);setCart(c=>Object.fromEntries(Object.entries(c).filter(([id])=>p.some(x=>x.id===id))));}}).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false;};},[]);
 useEffect(()=>{const fn=()=>{setPage(location.hash.slice(1)||'shop');window.scrollTo(0,0);};addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn);},[]);
 useEffect(()=>{try{localStorage.setItem('mori-react-cart-v1',JSON.stringify(cart));}catch{setNotice('Browser storage unavailable; your cart is kept in this tab.');}},[cart]);
 const navigate=p=>{location.hash=p;},count=Object.values(cart).reduce((a,b)=>a+b,0);
 function updated(order){setOrders(old=>[order,...old.filter(o=>o.id!==order.id)]);}
 return <><aside className="sidebar"><a className="brand" href="#shop">mori<span>✳</span></a><small>THE EVERYDAY, ELEVATED.</small><nav>{[['shop','◈','Discover'],['cart','▱',`Your bag (${count})`],['orders','◷','Orders & reviews']].map(([p,icon,label])=><button key={p} className={page===p?'active':''} onClick={()=>navigate(p)}><span>{icon}</span>{label}</button>)}</nav><div className="sidebar-note"><span>✳</span><h3>A world of good food.</h3><p>Thoughtfully selected.<br/>Freshly discovered.</p></div><p className="mode">{isDemo?'Browser demo':'C# API mode'}<br/>Mock payments only</p></aside><div className="app-shell"><header className="topbar"><span>Fresh finds, delivered with care.</span><button onClick={()=>navigate('cart')}>Your bag <b>{count}</b></button></header><main>{notice&&<p className="notice" role="status">{notice}</p>}{error?<p className="error" role="alert">{error}</p>:loading?<p>Opening the market…</p>:page==='cart'?<Cart products={products} cart={cart} setCart={setCart} onCheckout={()=>navigate('checkout')}/>:page==='checkout'?<Checkout products={products} cart={cart} onBack={()=>navigate('cart')} onPlaced={o=>{updated(o);setCart({});navigate('orders');}}/>:page==='orders'?<Orders orders={orders} onUpdated={updated}/>:<Catalog products={products} add={id=>{setCart(c=>({...c,[id]:Math.min((c[id]||0)+1,99)}));setNotice('Added to your bag.');}}/>}</main><footer className="site-footer">mori ✳ · A considered way to shop.</footer></div><nav className="mobile-nav"><button onClick={()=>navigate('shop')}>Discover</button><button onClick={()=>navigate('cart')}>Bag ({count})</button><button onClick={()=>navigate('orders')}>Orders</button></nav><ChatBox onTrack={()=>navigate('orders')}/></>;
}
