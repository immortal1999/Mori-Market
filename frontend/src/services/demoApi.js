import catalog from '../data/catalog.json';
import {priceOrder, stages} from './orderRules.js';
const key = 'mori-react-orders-v1';
function read() { try { const value=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(value)?value:[]; } catch { return []; } }
function write(orders) { localStorage.setItem(key, JSON.stringify(orders)); }
function update(id, action) { const orders=read(), order=orders.find(o=>o.id===id); if(!order)throw new Error('Order not found.');action(order);write(orders);return order; }
export const demoApi = {
  async products(){return catalog;},
  async orders(){return read();},
  async placeOrder(request){
    const existing=read().find(o=>o.requestId===request.requestId);if(existing)return existing;
    const totals=priceOrder(catalog,request.items,request.shipping.method);
    const order={...totals,id:`MORI-${crypto.randomUUID().slice(0,8).toUpperCase()}`,requestId:request.requestId,shipping:request.shipping,createdAt:new Date().toISOString(),payment:'Mock card •••• 4242',tracking:[{status:stages[0],at:new Date().toISOString()}],review:null};
    write([order,...read()]);return order;
  },
  async advance(id){return update(id,o=>{if(o.tracking.length<stages.length)o.tracking.push({status:stages[o.tracking.length],at:new Date().toISOString()});});},
  async review(id,review){if(!Number.isInteger(review.rating)||review.rating<1||review.rating>5)throw new Error('Select a rating.');return update(id,o=>{o.review={rating:review.rating,comment:review.comment.slice(0,1000)};});},
  async chat(){throw new Error('Gemini is not connected in demo mode. Run the C# backend and configure its Gemini key to enable replies.');}
};
