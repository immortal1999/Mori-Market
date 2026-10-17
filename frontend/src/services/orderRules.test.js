import test from 'node:test';
import assert from 'node:assert/strict';
import {priceOrder,stages} from './orderRules.js';
const products=[{id:'a',price:1.23,review:false},{id:'b',price:null,review:false},{id:'c',price:99,review:true}];
test('uses integer cents and excludes unknown or unconfirmed prices',()=>{const o=priceOrder(products,[{productId:'a',quantity:3},{productId:'b',quantity:2},{productId:'c',quantity:1}]);assert.equal(o.subtotal,3.69);assert.equal(o.total,8.68);assert.equal(o.items.filter(i=>i.quote).length,2);});
test('express delivery is applied',()=>assert.equal(priceOrder(products,[{productId:'a',quantity:1}],'express').total,11.22));
test('invalid carts cannot be priced',()=>{for(const lines of [[],[{productId:'unknown',quantity:1}],[{productId:'a',quantity:0}],[{productId:'a',quantity:1.5}],[{productId:'a',quantity:100}]])assert.throws(()=>priceOrder(products,lines));});
test('tracking has the requested ordered milestones',()=>assert.deepEqual(stages,['Confirmed','Processing','Label Created','Shipped','Delivered']));
