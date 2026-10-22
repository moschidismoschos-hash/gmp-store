'use strict';
// GMP Store: read-only public catalog. Only owner-published records in data/products.json are shown.
(() => {
  const dict = window.GMP_TRANSLATIONS;
  const categories = ['home','technology','fashion','beauty','tools','kids','fitness','auto','pets'];
  const homeCategories = ['home','technology','fashion','beauty','tools','pets'];
  const isoLocale = {el:'el-GR',en:'en-IE',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT',pt:'pt-PT',nl:'nl-NL',ja:'ja-JP',ar:'ar-AE'};
  const qs = id => document.getElementById(id);
  const sv = (key, def) => {try {const s=localStorage.getItem('gmp2.'+key);return s===null?def:JSON.parse(s);}catch{return def;}};
  const save = (key, value) => {try {localStorage.setItem('gmp2.'+key,JSON.stringify(value));}catch {}};
  const supported = Object.keys(dict);
  function browserLang(){for(const tag of navigator.languages || [navigator.language || 'en']){const code=String(tag).split('-')[0].toLowerCase();if(supported.includes(code))return code;}return 'en';}
  function browserCountry(){for(const tag of navigator.languages || [navigator.language || '']){const c=String(tag).split('-')[1]?.toUpperCase();if([...qs('country').options].some(o=>o.value===c))return c;}return 'GR';}
  const state = {
    language:sv('language',browserLang()),country:sv('country',null),view:'home',
    category:'all',q:'',sort:'featured',favoritesOnly:false,page:0,
    likes:sv('likes',[]),cart:sv('cart',{}),products:[],dialog:null
  };
  if(!supported.includes(state.language))state.language='en';
  if(!Array.isArray(state.likes))state.likes=[];
  if(!state.cart || typeof state.cart!=='object' || Array.isArray(state.cart))state.cart={};
  if(!state.country)state.country=browserCountry();
  const t = k => (dict[state.language]||dict.en)[k] || dict.en[k] || k;
  const icon = name => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const escapeText = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeImg(s){return typeof s==='string' && /^assets\/products\/[a-z0-9_-]+\.(webp|png|jpe?g)$/i.test(s) ? s : '';}
  function publicProduct(p){return p && p.published === true && /^[a-z0-9-]{2,60}$/.test(p.id) && categories.includes(p.category) && Number.isFinite(p.price_eur) && p.price_eur >= 0 && p.price_eur <= 1000000 && safeImg(p.image) && p.name && typeof p.name === 'object' && (p.name.el || p.name.en);}
  function itemName(p){return p.name[state.language] || p.name.en || p.name.el || '';}
  function itemDescription(p){return p.description?.[state.language] || p.description?.en || p.description?.el || '';}
  function formatEUR(x){return new Intl.NumberFormat(isoLocale[state.language],{style:'currency',currency:'EUR'}).format(x);}
  function catTitle(c){return t('cat_'+c);}
  function translate(){
    document.documentElement.lang=state.language;
    document.documentElement.dir=state.language==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t(n.dataset.t));
    document.querySelectorAll('[data-placeholder]').forEach(n=>n.placeholder=t(n.dataset.placeholder));
    qs('query').placeholder=t('searchPlaceholder');
    qs('language').value=state.language;
    try { const display = new Intl.DisplayNames([isoLocale[state.language]], {type:'region'}); [...qs('country').options].forEach(o => {o.textContent=display.of(o.value) || o.textContent;}); } catch {}
    qs('favorites').setAttribute('aria-label',t('favorites'));
    qs('assistant-reply').textContent=t('assistantWelcome');
    qs('country').value=state.country;
    qs('category-close').setAttribute('aria-label',t('close'));
    renderHome();renderAllCategories();renderCategoryOptions();renderProducts();renderCart();renderBadge();
  }
  function setLanguage(lang){if(!supported.includes(lang))return;state.language=lang;save('language',lang);translate();}
  const categoryIcons={home:'cat-house',technology:'cat-tech',fashion:'cat-fashion',beauty:'cat-beauty',tools:'cat-tools',kids:'cat-kids',fitness:'cat-fitness',auto:'cat-auto',pets:'cat-pets'};
  function categoryButton(c,extraClass=''){
    return `<button type="button" class="category-tile ${extraClass}" data-category="${c}"><span class="category-glyph">${icon(categoryIcons[c])}</span><span class="category-label">${escapeText(catTitle(c))}</span></button>`;
  }
  function renderAllCategories(){
    qs('category-all-grid').innerHTML=categories.map(c=>categoryButton(c,'category-tile-all')).join('');
  }
  let priorCategoryFocus=null;
  function openAllCategories(){
    priorCategoryFocus=document.activeElement;
    qs('category-overlay').hidden=false;
    qs('category-close').focus();
  }
  function closeAllCategories(){
    const wasOpen=!qs('category-overlay').hidden;
    qs('category-overlay').hidden=true;
    if(wasOpen && priorCategoryFocus?.isConnected)priorCategoryFocus.focus();
  }
  function renderHome(){
    qs('home-categories').innerHTML=homeCategories.map(c=>categoryButton(c)).join('');
    const count=state.products.length;
    qs('home-product-count').textContent=String(count);
    qs('home-status-title').textContent=t(count?'catalogReady':'emptyTitle');
    qs('home-status-text').textContent=t(count?'catalogReadyText':'emptyText');
  }
  function renderCategoryOptions(){const s=qs('category');s.innerHTML=`<option value="all">${escapeText(t('all'))}</option>`+categories.map(c=>`<option value="${c}">${escapeText(catTitle(c))}</option>`).join('');s.value=state.category;}
  function changeView(v){
    if(!['home','products','assistant','world','cart'].includes(v))return;
    state.view=v;
    document.querySelectorAll('.view').forEach(n=>{const active=n.id===`view-${v}`;n.classList.toggle('active',active);n.hidden=!active;});
    document.querySelectorAll('.bottom-nav [data-view]').forEach(n=>{const active=n.dataset.view===v;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
    if(v==='products')renderProducts();if(v==='cart')renderCart();
  }
  function filtered(){
    let p=state.products.filter(v=>(state.category==='all'||state.category===v.category)&&(!state.favoritesOnly||state.likes.includes(v.id)));
    const q=state.q.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
    if(q)p=p.filter(v=>[...Object.values(v.name),...Object.values(v.description||{}),catTitle(v.category)].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().includes(q));
    if(state.sort==='low')p.sort((a,b)=>a.price_eur-b.price_eur);
    if(state.sort==='high')p.sort((a,b)=>b.price_eur-a.price_eur);
    return p;
  }
  function empty(title,desc){return `<div class="empty-catalog"><div class="empty-icon">${icon('box')}</div><h3>${escapeText(t(title))}</h3><p>${escapeText(t(desc))}</p></div>`;}
  function renderProducts(){
    const items=filtered();const perPage=4;const total=Math.ceil(items.length/perPage);state.page=Math.min(Math.max(0,state.page),Math.max(0,total-1));
    const display=items.slice(state.page*perPage,(state.page+1)*perPage);
    qs('product-count').textContent=String(items.length);
    qs('page-count').textContent=`${total?state.page+1:0} / ${total}`;
    qs('page-prev').disabled=state.page===0;
    qs('page-next').disabled=state.page>=total-1;
    qs('product-grid').innerHTML=!items.length?empty(state.products.length===0?'emptyTitle':'noMatchTitle',state.products.length===0?'emptyText':'noMatchText'):display.map(p=>{
      const id=escapeText(p.id),name=escapeText(itemName(p));
      return `<article class="product-card"><div class="product-image"><img loading="lazy" src="${safeImg(p.image)}" alt="${name}"><button class="product-heart ${state.likes.includes(p.id)?'active':''}" data-like="${id}" aria-label="${escapeText(t('favorites'))}" aria-pressed="${state.likes.includes(p.id)}">${icon('heart')}</button></div><div class="product-info"><button class="product-name" data-detail="${id}">${name}</button><div class="product-bottom"><strong>${escapeText(formatEUR(p.price_eur))}</strong><button class="add-button" data-add="${id}" aria-label="${escapeText(t('add'))}">${icon('plus')}</button></div></div></article>`;
    }).join('');
  }
  function renderBadge(){const valid=new Set(state.products.map(p=>p.id));state.likes=state.likes.filter(id=>valid.has(id));for(const key of Object.keys(state.cart)){if(!valid.has(key))delete state.cart[key];}save('likes',state.likes);save('cart',state.cart);const f=qs('fav-count');f.textContent=state.likes.length;f.hidden=!state.likes.length;const qty=Object.values(state.cart).reduce((n,c)=>n+(Number(c)||0),0);qs('cart-page-count').textContent=String(qty);qs('cart-badge').textContent=String(qty);qs('cart-badge').hidden=qty===0;}
  function renderCart(){
    const rows=state.products.filter(p=>Number(state.cart[p.id])>0).slice(0,3);
    qs('cart-items').innerHTML=rows.length?rows.map(p=>`<article class="cart-entry"><img src="${safeImg(p.image)}" alt=""><div class="cart-entry-body"><strong>${escapeText(itemName(p))}</strong><small>${escapeText(formatEUR(p.price_eur))}</small><div class="cart-controls"><button type="button" data-qty="-1" data-id="${escapeText(p.id)}" aria-label="−">${icon('minus')}</button><span>${state.cart[p.id]}</span><button type="button" data-qty="1" data-id="${escapeText(p.id)}" aria-label="+">${icon('plus')}</button></div></div></article>`).join(''):empty('emptyCart','emptyCartText');
    const total=state.products.reduce((n,p)=>n+p.price_eur*(Number(state.cart[p.id])||0),0);
    qs('cart-total').textContent=formatEUR(total);
  }
  function toast(msg){const n=qs('toast');n.textContent=msg;n.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.classList.remove('show'),1700);}
  function toggleLike(id){if(!state.products.some(p=>p.id===id))return;const i=state.likes.indexOf(id);if(i>=0)state.likes.splice(i,1);else state.likes.push(id);toast(t(i>=0?'unsaved':'saved'));renderBadge();renderProducts();}
  function add(id){if(!state.products.some(p=>p.id===id))return;state.cart[id]=Math.min(99,(Number(state.cart[id])||0)+1);renderBadge();renderCart();toast(t('added'));}
  function changeQty(id,amount){state.cart[id]=Math.min(99,Math.max(0,(Number(state.cart[id])||0)+amount));if(!state.cart[id])delete state.cart[id];renderBadge();renderCart();}
  function showDetails(id){const p=state.products.find(p=>p.id===id);if(!p)return;state.dialog=id;qs('dialog-content').innerHTML=`<img src="${safeImg(p.image)}" alt=""><h3 id="dialog-title">${escapeText(itemName(p))}</h3><p>${escapeText(itemDescription(p))}</p><div class="dialog-actions"><strong>${escapeText(formatEUR(p.price_eur))}</strong><button type="button" data-add="${escapeText(p.id)}">${escapeText(t('add'))}</button></div><p><small>${escapeText(t('noShipping'))}</small></p>`;qs('dialog-backdrop').hidden=false;qs('dialog-close').focus();}
  function closeDialog(){state.dialog=null;qs('dialog-backdrop').hidden=true;}
  function searchAssistant(q){qs('assistant-reply').textContent=state.products.length===0?t('assistantNoProducts'):(state.products.some(p=>Object.values(p.name).some(n=>n.toLocaleLowerCase().includes(q.toLocaleLowerCase())))?t('assistantFound'):t('assistantNoMatch'));}
  function events(){
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-all-categories]')){openAllCategories();return;}
      const v=e.target.closest('[data-view]');if(v){if(v.dataset.view==='products')state.favoritesOnly=false;changeView(v.dataset.view);return;}
      const c=e.target.closest('[data-category]');if(c){closeAllCategories();state.category=c.dataset.category;state.page=0;state.favoritesOnly=false;renderCategoryOptions();changeView('products');return;}
      const a=e.target.closest('[data-add]');if(a){add(a.dataset.add);return;}
      const like=e.target.closest('[data-like]');if(like){toggleLike(like.dataset.like);return;}
      const d=e.target.closest('[data-detail]');if(d){showDetails(d.dataset.detail);return;}
      const qty=e.target.closest('[data-qty]');if(qty){changeQty(qty.dataset.id,Number(qty.dataset.qty));return;}
    });
    qs('language').addEventListener('change',e=>setLanguage(e.target.value));
    qs('country').addEventListener('change',e=>{state.country=e.target.value;save('country',state.country);});
    qs('sort').addEventListener('change',e=>{state.sort=e.target.value;state.page=0;renderProducts();});
    qs('category').addEventListener('change',e=>{state.category=e.target.value;state.page=0;renderProducts();});
    qs('page-prev').addEventListener('click',()=>{state.page--;renderProducts();});
    qs('page-next').addEventListener('click',()=>{state.page++;renderProducts();});
    qs('favorites').addEventListener('click',()=>{state.favoritesOnly=!state.favoritesOnly;state.page=0;changeView('products');});
    qs('search-form').addEventListener('submit',e=>{e.preventDefault();state.q=qs('query').value;state.favoritesOnly=false;state.page=0;changeView('products');});
    qs('assistant-form').addEventListener('submit',e=>{e.preventDefault();searchAssistant(qs('assistant-query').value.trim());});
    qs('category-close').addEventListener('click',closeAllCategories);
    qs('category-overlay').addEventListener('click',e=>{if(e.target===qs('category-overlay'))closeAllCategories();});
    qs('dialog-close').addEventListener('click',closeDialog);
    qs('dialog-backdrop').addEventListener('click',e=>{if(e.target===qs('dialog-backdrop'))closeDialog();});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){closeAllCategories();closeDialog();}
      if(e.key==='Tab'&&!qs('category-overlay').hidden){
        const buttons=[...qs('category-overlay').querySelectorAll('button:not([disabled])')];
        const first=buttons[0],last=buttons[buttons.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }
  async function init(){
    events();
    try{
      const response=await fetch('data/products.json?v=6',{cache:'no-store'});
      if(!response.ok)throw new Error('Catalog HTTP '+response.status);
      const records=await response.json();
      state.products=Array.isArray(records)?records.filter(publicProduct):[];
    }catch(e){console.error('Catalog load failed',e);state.products=[];}
    translate();changeView('home');
  }
  init();
})();
