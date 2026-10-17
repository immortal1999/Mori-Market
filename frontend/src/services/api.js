import {demoApi} from './demoApi.js';
export const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';
async function request(path, method='GET', body){
  const response=await fetch(`${import.meta.env.VITE_API_BASE_URL||''}/api${path}`,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.detail||data.title||'The request failed. Please try again.');
  return data;
}
export const api=isDemo?demoApi:{products:()=>request('/products'),orders:()=>request('/orders'),placeOrder:data=>request('/orders','POST',data),advance:id=>request(`/orders/${encodeURIComponent(id)}/advance`,'POST'),review:(id,data)=>request(`/orders/${encodeURIComponent(id)}/review`,'PUT',data),chat:messages=>request('/chat','POST',{messages})};
