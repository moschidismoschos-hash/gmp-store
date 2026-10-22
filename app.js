'use strict';
// GMP Store: self-contained, public demo. No orders, payments, accounts or third-party APIs.
const CATEGORIES = [
  {id:'home', image:'home.webp', el:'Σπίτι & Κήπος', en:'Home & Garden'},
  {id:'technology', image:'technology.webp', el:'Τεχνολογία', en:'Technology'},
  {id:'fashion', image:'fashion.webp', el:'Μόδα', en:'Fashion'},
  {id:'beauty', image:'beauty.webp', el:'Ομορφιά', en:'Beauty'},
  {id:'tools', image:'tools.webp', el:'Εργαλεία', en:'Tools'},
  {id:'kids', image:'kids.webp', el:'Παιδιά', en:'Kids'},
  {id:'fitness', image:'fitness.webp', el:'Άθληση', en:'Fitness'},
  {id:'auto', image:'auto.webp', el:'Αυτοκίνητο', en:'Automotive'},
  {id:'pets', image:'pets.webp', el:'Κατοικίδια', en:'Pets'}
];
const PRODUCTS = [
  {id:1,category:'home',image:'products/vacuum.webp',price:89.90,featured:true,el:'Ρομποτική σκούπα έξυπνης πλοήγησης',en:'Smart navigation robot vacuum',descriptionEl:'Δοκιμαστικό προϊόν για αυτοματοποιημένο καθαρισμό. Τα πραγματικά τεχνικά χαρακτηριστικά θα προστεθούν μετά την επιλογή προμηθευτή.',descriptionEn:'Demo product for automated cleaning. Verified specifications will be added after supplier selection.'},
  {id:2,category:'technology',image:'products/watch.webp',price:59.90,featured:true,el:'Έξυπνο ρολόι πολλαπλών λειτουργιών',en:'Multifunction smartwatch',descriptionEl:'Ενδεικτικό έξυπνο ρολόι. Η συμβατότητα και οι λειτουργίες δεν έχουν επιβεβαιωθεί.',descriptionEn:'Sample smartwatch. Compatibility and features are not verified.'},
  {id:3,category:'technology',image:'products/earbuds.webp',price:29.90,featured:true,el:'Ασύρματα ακουστικά',en:'Wireless earbuds',descriptionEl:'Ενδεικτικά ασύρματα ακουστικά. Ο χρόνος μπαταρίας και τα χαρακτηριστικά θα επαληθευτούν.',descriptionEn:'Sample wireless earbuds. Battery life and specifications need verification.'},
  {id:4,category:'tools',image:'products/drill.webp',price:49.90,featured:true,el:'Επαναφορτιζόμενο δραπανοκατσάβιδο',en:'Cordless power drill',descriptionEl:'Δοκιμαστικό εργαλείο. Δεν έχει επιλεγεί προμηθευτής ή επιβεβαιωθεί συμμόρφωση.',descriptionEn:'Demo power tool. Supplier and compliance have not been verified.'},
  {id:5,category:'home',image:'products/cookware.webp',price:79.90,featured:true,el:'Σετ μαγειρικών σκευών',en:'Cookware set',descriptionEl:'Ενδεικτικό σετ για την κουζίνα. Τα υλικά και οι πιστοποιήσεις θα ελεγχθούν.',descriptionEn:'Sample kitchen set. Materials and certifications are yet to be reviewed.'},
  {id:6,category:'pets',image:'products/fountain.webp',price:24.90,featured:true,el:'Συντριβάνι νερού κατοικιδίων',en:'Pet drinking fountain',descriptionEl:'Ιδέα για αξεσουάρ κατοικιδίων. Χωρίς πραγματικό απόθεμα σε αυτή τη δοκιμή.',descriptionEn:'Pet accessory concept. No actual inventory in this preview.'},
  {id:7,category:'technology',image:'categories/technology.webp',price:44.90,el:'Ακουστικά κεφαλής για καθημερινή χρήση',en:'Everyday over-ear headphones',descriptionEl:'Ενδεικτικό προϊόν τεχνολογίας. Η ποιότητα θα αξιολογηθεί με δείγματα.',descriptionEn:'Sample technology product. Quality to be evaluated using samples.'},
  {id:8,category:'beauty',image:'categories/beauty.webp',price:29.90,el:'Σετ περιποίησης καθημερινής χρήσης',en:'Everyday care set',descriptionEl:'Ενδεικτική συλλογή. Δεν έχουν ελεγχθεί συστατικά ή κανονιστική συμμόρφωση.',descriptionEn:'Sample set. Ingredients and regulatory compliance have not been checked.'},
  {id:9,category:'fashion',image:'categories/fashion.webp',price:69.90,el:'Κομψή τσάντα καθημερινής χρήσης',en:'Everyday elegant handbag',descriptionEl:'Δοκιμαστικό είδος μόδας. Διαστάσεις και υλικά θα επιβεβαιωθούν.',descriptionEn:'Sample fashion item. Dimensions and materials will be verified.'},
  {id:10,category:'kids',image:'categories/kids.webp',price:19.90,el:'Λούτρινο παιχνίδι',en:'Soft plush toy',descriptionEl:'Ενδεικτικό παιχνίδι. Δεν πωλείται· θα απαιτηθούν έλεγχοι ασφάλειας.',descriptionEn:'Sample toy. Not for sale; safety checks will be required.'},
  {id:11,category:'fitness',image:'categories/fitness.webp',price:38.90,el:'Αξεσουάρ γυμναστικής',en:'Fitness accessories',descriptionEl:'Ενδεικτικά αξεσουάρ για καθημερινή άσκηση.',descriptionEn:'Sample accessories for everyday exercise.'},
  {id:12,category:'auto',image:'categories/auto.webp',price:34.90,el:'Σετ αξεσουάρ αυτοκινήτου',en:'Car accessories set',descriptionEl:'Δοκιμαστική κατηγορία· η καταλληλότητα θα ελεγχθεί πριν από πωλήσεις.',descriptionEn:'Sample category; suitability will be verified before sales.'}
];
const WORDS = {
  el: {
    demoStrip:'ΔΟΚΙΜΑΣΤΙΚΗ ΕΚΔΟΣΗ · Χωρίς πραγματικές αγορές ή χρεώσεις',searchLabel:'Αναζήτηση προϊόντων',searchPlaceholder:'Αναζήτηση προϊόντων, κατηγοριών...',language:'Γλώσσα',
    heroOverline:'ΕΝΑ ΝΕΟ ΚΟΣΜΟ ΑΓΟΡΩΝ',heroTitle:'Ό,τι χρειάζεσαι.<br><em>Από όλο τον κόσμο.</em>',heroBody:'Έξυπνες επιλογές για το σπίτι, την τεχνολογία και την καθημερινότητα. Ένα κατάστημα σχεδιασμένο για όλους.',browseButton:'Ανακάλυψε τα προϊόντα',assistantButton:'Βοηθός αγορών',heroPillarOne:'Διεθνής προσανατολισμός',heroPillarTwo:'Διαφανής ενημέρωση',floatingTitle:'Ένας κόσμος επιλογών',floatingBody:'Το δικό μας παγκόσμιο κατάστημα',
    perk1Title:'Επιλεγμένα προϊόντα',perk1Body:'Αρχικός δοκιμαστικός κατάλογος',perk2Title:'Διεθνής σχεδιασμός',perk2Body:'Με προοπτική επέκτασης',perk3Title:'Χωρίς δική μας αποθήκη',perk3Body:'Μελλοντική σύνδεση προμηθευτών',perk4Title:'Ασφαλής δοκιμή',perk4Body:'Δεν πραγματοποιούνται χρεώσεις',
    categoriesOverline:'ΕΞΕΡΕΥΝΗΣΕ',categoriesTitle:'Κατηγορίες για κάθε ανάγκη',categoriesBody:'Βρες γρήγορα αυτό που σε ενδιαφέρει.',editorialOverline1:'ΑΝΑΚΑΛΥΨΕ',editorialOverline2:'ΤΕΧΝΟΛΟΓΙΑ',editorialTitle1:'Έξυπνες λύσεις<br>για το σπίτι',editorialTitle2:'Μικρές συσκευές.<br>Μεγάλες ιδέες.',editorialCta:'Δες τη συλλογή →',
    productsOverline:'Η ΣΥΛΛΟΓΗ ΜΑΣ',productsTitle:'Προτεινόμενα προϊόντα',priceNotice:'Τα προϊόντα και οι τιμές είναι ενδεικτικά για την προεπισκόπηση.',sortLabel:'Ταξινόμηση',sortFeatured:'Προτεινόμενα',sortLow:'Τιμή: χαμηλή πρώτα',sortHigh:'Τιμή: υψηλή πρώτα',noResults:'Δεν βρέθηκαν προϊόντα. Δοκίμασε άλλη αναζήτηση.',
    smartOverline:'GMP SMART FIND · ΔΟΚΙΜΗ',smartTitle:'Δεν ξέρεις τι να επιλέξεις;<br><em>Πες μας τι χρειάζεσαι.</em>',smartBody:'Γράψε τι ψάχνεις ή το ποσό που θέλεις να διαθέσεις. Ο δοκιμαστικός βοηθός προτείνει προϊόντα από τον κατάλογο.',assistantPanelTitle:'Βοηθός GMP',assistantPanelStatus:'Δοκιμαστικός · χωρίς τεχνητή νοημοσύνη',assistantGreeting:'Γεια σου! Δοκίμασε: «δώρο μέχρι 50 ευρώ», «κάτι για το σπίτι» ή «ακουστικά».',assistantLabel:'Τι ψάχνεις;',assistantPlaceholder:'Τι χρειάζεσαι σήμερα;',chip1:'Δώρο έως 50 €',chip2:'Για το σπίτι',chip3:'Τεχνολογία',
    globalOverline:'ΧΩΡΙΣ ΣΥΝΟΡΑ',globalTitle:'Ο κόσμος είναι η αγορά μας',globalCardTitle:'Επιλογή χώρας',globalBody:'Αυτή είναι δοκιμαστική προεπισκόπηση. Η διαθεσιμότητα, οι χρόνοι παράδοσης και τα μεταφορικά θα εμφανίζονται όταν συνδεθούν πραγματικοί προμηθευτές.',countryLabel:'Χώρα παράδοσης',countryFeedback:'Δεν υπάρχουν ακόμη πραγματικά στοιχεία αποστολής για τη χώρα που διάλεξες.',
    roadmapOverline:'ΣΤΑ ΕΠΟΜΕΝΑ ΒΗΜΑΤΑ',roadmapTitle:'Όσα ετοιμάζουμε για σένα',roadmap1Title:'Πραγματικές προσφορές',roadmap1Body:'Μετά τον έλεγχο τιμών και προμηθευτών.',roadmap2Title:'Βίντεο προϊόντων',roadmap2Body:'Με αληθινές παρουσιάσεις και χρήσιμες λεπτομέρειες.',roadmap3Title:'Λέσχη μελών',roadmap3Body:'Πρόγραμμα επιβράβευσης με ξεκάθαρους κανόνες.',roadmapStatus:'Σε σχεδιασμό',
    trustOverline:'ΧΤΙΖΟΥΜΕ ΕΜΠΙΣΤΟΣΥΝΗ',trustTitle:'Διαφάνεια σε κάθε βήμα',trust1:'Προμηθευτές υπό αξιολόγηση',trust2:'Αποστολές σε σχεδιασμό',trust3:'Αγαπημένα και καλάθι επίδειξης',trust4:'Καμία συλλογή στοιχείων πληρωμής',footerBody:'Μια ιδέα που γίνεται πραγματικότητα. Πρώτη δοκιμαστική έκδοση.',footerDemo:'Προεπισκόπηση — όχι ενεργό κατάστημα',
    all:'Όλα',favorites:'Αγαπημένα',cart:'Το καλάθι μου',demo:'Δείγμα',priceDemo:'Ενδεικτική τιμή',add:'Προσθήκη στο καλάθι',added:'Προστέθηκε στο δοκιμαστικό καλάθι',liked:'Προστέθηκε στα αγαπημένα',unliked:'Αφαιρέθηκε από τα αγαπημένα',cartEmpty:'Το καλάθι είναι άδειο.',favoritesEmpty:'Δεν έχεις ακόμη αγαπημένα.',remove:'Αφαίρεση',total:'Σύνολο επίδειξης',checkout:'Ολοκλήρωση παραγγελίας (μη διαθέσιμη)',checkoutInfo:'Δοκιμαστική λειτουργία. Δεν υπάρχουν πραγματικές αγορές, πληρωμές ή συνδεδεμένοι προμηθευτές.',details:'Πληροφορίες προϊόντος',noShipping:'Δεν υπάρχουν ακόμη διαθέσιμα πραγματικά μεταφορικά.',assistantMatches:'Σου προτείνω αυτά τα δοκιμαστικά προϊόντα:',assistantNoMatch:'Δεν βρήκα ακριβή αντιστοίχιση. Δοκίμασε «σπίτι», «τεχνολογία» ή «δώρο μέχρι 50».',filterShow:'Εμφανίζονται τα σχετικά προϊόντα παρακάτω.'
  },
  en: {
    demoStrip:'DEMO VERSION · No real orders or charges',searchLabel:'Search products',searchPlaceholder:'Search products, categories...',language:'Language',
    heroOverline:'A NEW WORLD OF SHOPPING',heroTitle:'Everything you need.<br><em>From around the world.</em>',heroBody:'Smart ideas for home, technology and everyday life. A store designed for everyone.',browseButton:'Explore products',assistantButton:'Shopping assistant',heroPillarOne:'International ambition',heroPillarTwo:'Transparent information',floatingTitle:'A world of choice',floatingBody:'Our global store concept',
    perk1Title:'Curated products',perk1Body:'Initial sample catalog',perk2Title:'Global-first design',perk2Body:'Built for future growth',perk3Title:'No warehouse of our own',perk3Body:'Supplier integrations planned',perk4Title:'Safe demo',perk4Body:'No charges are possible',
    categoriesOverline:'EXPLORE',categoriesTitle:'Categories for every need',categoriesBody:'Quickly discover what interests you.',editorialOverline1:'DISCOVER',editorialOverline2:'TECHNOLOGY',editorialTitle1:'Smart solutions<br>for your home',editorialTitle2:'Small devices.<br>Big ideas.',editorialCta:'View collection →',
    productsOverline:'OUR COLLECTION',productsTitle:'Featured products',priceNotice:'Products and prices are illustrative for this preview.',sortLabel:'Sort products',sortFeatured:'Featured',sortLow:'Price: low to high',sortHigh:'Price: high to low',noResults:'No products found. Try a different search.',
    smartOverline:'GMP SMART FIND · DEMO',smartTitle:'Not sure what to choose?<br><em>Tell us what you need.</em>',smartBody:'Describe what you need or your budget. Our simple demo assistant suggests items from the sample catalog.',assistantPanelTitle:'GMP assistant',assistantPanelStatus:'Rule-based demo · not artificial intelligence',assistantGreeting:'Hello! Try “gift under 50”, “something for home” or “earbuds”.',assistantLabel:'What are you looking for?',assistantPlaceholder:'What do you need today?',chip1:'Gift under €50',chip2:'For the home',chip3:'Technology',
    globalOverline:'BEYOND BORDERS',globalTitle:'The world is our marketplace',globalCardTitle:'Choose a country',globalBody:'This is a demo preview. Product availability, delivery estimates and shipping costs will appear when real suppliers are connected.',countryLabel:'Delivery country',countryFeedback:'Real shipping information is not yet available for the selected country.',
    roadmapOverline:'COMING NEXT',roadmapTitle:'What we are building',roadmap1Title:'Real verified deals',roadmap1Body:'After supplier and pricing verification.',roadmap2Title:'Product videos',roadmap2Body:'Real demonstrations and useful product details.',roadmap3Title:'Member rewards',roadmap3Body:'A transparent loyalty program.',roadmapStatus:'Planned',
    trustOverline:'BUILDING TRUST',trustTitle:'Transparency at every step',trust1:'Suppliers under review',trust2:'Deliveries being planned',trust3:'Demo wish list and cart',trust4:'No payment information collected',footerBody:'An idea becoming real. First preview release.',footerDemo:'Preview — not a live store',
    all:'All',favorites:'Favorites',cart:'My cart',demo:'Sample',priceDemo:'Illustrative price',add:'Add to cart',added:'Added to demo cart',liked:'Added to favorites',unliked:'Removed from favorites',cartEmpty:'Your cart is empty.',favoritesEmpty:'No favorites yet.',remove:'Remove',total:'Sample total',checkout:'Checkout (not available)',checkoutInfo:'Demo only. No real purchases, payments or connected suppliers.',details:'Product details',noShipping:'No actual delivery rates available yet.',assistantMatches:'Here are matching sample products:',assistantNoMatch:'No exact match. Try “home”, “technology” or “gift under 50”.',filterShow:'Matching products are shown below.'
  }
};
const store = {
  load(key, fallback){try {const value=JSON.parse(localStorage.getItem('gmpStore.'+key));return value??fallback;}catch{return fallback;}},
  save(key,value){try{localStorage.setItem('gmpStore.'+key,JSON.stringify(value));}catch{/* private browsing */}}
};
const state = {language:store.load('language','el'),country:store.load('country','GR'),cart:store.load('cart',{}),likes:store.load('likes',[]),category:'all',query:'',sort:'featured',favoritesOnly:false,drawerType:null,drawerProduct:null};
if(!WORDS[state.language]) state.language='el';
if(!['GR','DE','FR','GB','US'].includes(state.country)) state.country='GR';
const el=id=>document.getElementById(id);
const tr=key=>WORDS[state.language][key]??key;
const catName=id=>CATEGORIES.find(c=>c.id===id)?.[state.language]??id;
const COUNTRY_NAMES={GR:{el:'Ελλάδα',en:'Greece'},DE:{el:'Γερμανία',en:'Germany'},FR:{el:'Γαλλία',en:'France'},GB:{el:'Ηνωμένο Βασίλειο',en:'United Kingdom'},US:{el:'Ηνωμένες Πολιτείες',en:'United States'}};
const currency=n=>new Intl.NumberFormat(state.language==='el'?'el-GR':'en-IE',{style:'currency',currency:'EUR'}).format(n);
const label=p=>p[state.language];
const safeSearch=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
const getProduct=id=>PRODUCTS.find(p=>p.id===Number(id));
const ico=(id)=>`<svg class="ico" aria-hidden="true"><use href="#i-${id}"/></svg>`;
function updateTranslations(){
  document.documentElement.lang=state.language;
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=tr(node.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(node=>node.innerHTML=tr(node.dataset.i18nHtml));
  document.querySelectorAll('[data-placeholder]').forEach(node=>node.placeholder=tr(node.dataset.placeholder));
  el('languageSelect').value=state.language;
  [...el('countrySelect').options].forEach(option=>{option.textContent=COUNTRY_NAMES[option.value][state.language];});
  document.querySelector('[data-i18n="assistantGreeting"]')?.dataset; // greeting uses same translation pipeline
  el('countryFeedback').textContent=tr('countryFeedback');
  renderCategories();renderProducts();refreshCount();
  if(state.drawerType)renderDrawer();
}
function renderCategories(){
  const nav=el('navCategories'),pills=el('filterPills'),grid=el('categoryGrid');
  const options=[{id:'all',[state.language]:tr('all')},...CATEGORIES];
  nav.innerHTML=options.map(c=>`<button type="button" data-category="${c.id}" class="${state.category===c.id?'is-active':''}">${c[state.language]}</button>`).join('');
  pills.innerHTML=options.map(c=>`<button type="button" data-category="${c.id}" class="${state.category===c.id?'is-active':''}">${c[state.language]}</button>`).join('')+`<button type="button" data-favorites-only="true" class="${state.favoritesOnly?'is-active':''}">♥ ${tr('favorites')}</button>`;
  grid.innerHTML=CATEGORIES.map(c=>`<button class="category-tile" type="button" data-category="${c.id}"><img loading="lazy" alt="" src="assets/categories/${c.image}"><span>${c[state.language]}</span></button>`).join('');
}
function filteredProducts(){
  const q=safeSearch(state.query.trim());
  let items=PRODUCTS.filter(p=>(state.category==='all'||p.category===state.category)&&(!state.favoritesOnly||state.likes.includes(p.id))&&(!q||safeSearch([p.el,p.en,catName(p.category),CATEGORIES.find(c=>c.id===p.category)?.el].join(' ')).includes(q)));
  if(state.sort==='low')items.sort((a,b)=>a.price-b.price);
  if(state.sort==='high')items.sort((a,b)=>b.price-a.price);
  return items;
}
function renderProducts(){
  const filtered=filteredProducts();
  el('productGrid').innerHTML=filtered.map(p=>`
    <article class="product-card"><div class="product-photo"><span class="product-tag">${tr('demo')}</span><img src="assets/${p.image}" alt="${label(p)}" loading="lazy"><button type="button" class="like-button ${state.likes.includes(p.id)?'liked':''}" data-like="${p.id}" aria-label="${tr('favorites')}: ${label(p)}" aria-pressed="${state.likes.includes(p.id)}">${ico('heart')}</button></div>
    <div class="product-info"><span class="product-category">${catName(p.category)}</span><button class="product-name" type="button" data-detail="${p.id}">${label(p)}</button><div class="product-bottom"><div class="product-price">${currency(p.price)}<small>${tr('priceDemo')}</small></div><button class="cart-mini" type="button" data-add="${p.id}" aria-label="${tr('add')}: ${label(p)}">${ico('cart')}</button></div></div></article>
  `).join('');
  el('emptyResults').hidden=filtered.length>0;
}
function refreshCount(){
  el('cartCount').textContent=Object.values(state.cart).reduce((n,v)=>n+(Number(v)||0),0);
  el('favoritesCount').textContent=state.likes.length;
}
let toastHandle;
function toast(message){clearTimeout(toastHandle);el('toast').textContent=message;el('toast').classList.add('visible');toastHandle=setTimeout(()=>el('toast').classList.remove('visible'),2900);}
function addCart(id){const p=getProduct(id);if(!p)return;state.cart[id]=Math.min(99,(Number(state.cart[id])||0)+1);store.save('cart',state.cart);refreshCount();toast(tr('added'));if(state.drawerType==='cart')renderDrawer();}
function changeCart(id,step){const next=(Number(state.cart[id])||0)+step;if(next<1)delete state.cart[id];else state.cart[id]=Math.min(99,next);store.save('cart',state.cart);refreshCount();renderDrawer();}
function toggleLike(id){if(!getProduct(id))return;const i=state.likes.indexOf(id);if(i>=0)state.likes.splice(i,1);else state.likes.push(id);store.save('likes',state.likes);refreshCount();renderProducts();toast(i>=0?tr('unliked'):tr('liked'));if(state.drawerType==='favorites')renderDrawer();}
function openDrawer(type,id){state.drawerType=type;state.drawerProduct=id??null;el('overlay').hidden=false;el('drawer').classList.add('is-open');el('drawer').setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');renderDrawer();el('drawerClose').focus();}
function closeDrawer(){state.drawerType=null;el('overlay').hidden=true;el('drawer').classList.remove('is-open');el('drawer').setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');}
function renderDrawer(){
  const body=el('drawerBody'),bottom=el('drawerBottom');bottom.innerHTML='';
  if(state.drawerType==='cart'){
    el('drawerTitle').textContent=tr('cart');
    const entries=Object.entries(state.cart).filter(([id,q])=>getProduct(id)&&q>0);
    body.innerHTML=entries.length?entries.map(([id,q])=>{
      const p=getProduct(id);
      return `<div class="drawer-item"><img src="assets/${p.image}" alt=""><div class="drawer-item-copy"><strong>${label(p)}</strong><small>${currency(p.price)} × ${q}</small><div class="qty-row"><button data-step="-1" data-id="${id}" aria-label="Μείωση">${ico('minus')}</button><span>${q}</span><button data-step="1" data-id="${id}" aria-label="Αύξηση">${ico('plus')}</button></div></div></div>`;
    }).join(''):`<p class="empty-drawer">${tr('cartEmpty')}</p>`;
    const total=entries.reduce((sum,[id,q])=>sum+getProduct(id).price*q,0);
    bottom.innerHTML=`<div class="drawer-total"><span>${tr('total')}</span><span>${currency(total)}</span></div><button class="drawer-checkout" disabled>${tr('checkout')}</button><p class="drawer-note">${tr('checkoutInfo')}</p>`;
  }else if(state.drawerType==='favorites'){
    el('drawerTitle').textContent=tr('favorites');
    body.innerHTML=state.likes.length?state.likes.map(id=>{const p=getProduct(id);return p?`<div class="drawer-item"><img src="assets/${p.image}" alt=""><div class="drawer-item-copy"><strong>${label(p)}</strong><small>${currency(p.price)}</small><div class="qty-row"><button data-add="${id}" aria-label="${tr('add')}">${ico('cart')}</button><button data-remove-like="${id}" aria-label="${tr('remove')}">${ico('x')}</button></div></div></div>`:'';}).join(''):`<p class="empty-drawer">${tr('favoritesEmpty')}</p>`;
  }else if(state.drawerType==='product'){
    const p=getProduct(state.drawerProduct);if(!p)return;
    el('drawerTitle').textContent=tr('details');body.innerHTML=`<img class="drawer-product-image" src="assets/${p.image}" alt="${label(p)}"><span class="product-category">${catName(p.category)}</span><h3>${label(p)}</h3><p class="drawer-product-description">${p[state.language==='el'?'descriptionEl':'descriptionEn']}</p><p class="drawer-product-price">${currency(p.price)}</p><p class="drawer-note">${tr('checkoutInfo')}</p>`;
    bottom.innerHTML=`<button class="drawer-checkout" data-add="${p.id}">${tr('add')}</button>`;
  }
}
function selectCategory(category){state.category=category;state.favoritesOnly=false;state.query='';el('searchInput').value='';el('mobileSearchInput').value='';renderCategories();renderProducts();el('products').scrollIntoView({behavior:'smooth',block:'start'});}
function search(query){state.query=query;state.category='all';state.favoritesOnly=false;el('searchInput').value=query;el('mobileSearchInput').value=query;renderCategories();renderProducts();el('products').scrollIntoView({behavior:'smooth',block:'start'});}
function assistant(query){
  const q=safeSearch(query);const budgetMatch=q.match(/(?:εως|μεχρι|under|below|up to|<|max)\s*(\d{1,4})|(?:\d{1,4})\s*(?:€|eur|ευρω)/);
  const amount=budgetMatch?(Number(budgetMatch[1]||q.match(/(\d{1,4})/)?.[1])):null;
  let category=null;
  if(/σπιτ|home|house|κουζιν|cook|σκουπ/.test(q))category='home';
  else if(/τεχνο|tech|ακουσ|earbud|watch|ρολοι|headphone/.test(q))category='technology';
  else if(/κατοικ|pet|γατ|σκυλ/.test(q))category='pets';
  else if(/εργαλ|tool|δραπα|drill/.test(q))category='tools';
  else if(/δωρ|gift|present/.test(q))category='all';
  let matches=PRODUCTS.filter(p=>(!category||category==='all'||p.category===category)&&(!amount||p.price<=amount));
  if(!category&&!amount){const qMatches=PRODUCTS.filter(p=>safeSearch(p.el+' '+p.en).includes(q));matches=qMatches;}
  matches=matches.slice(0,3);
  el('assistantReply').textContent=matches.length?tr('assistantMatches')+'\n'+matches.map(p=>'• '+label(p)+' — '+currency(p.price)).join('\n')+'\n'+tr('filterShow'):tr('assistantNoMatch');
  if(matches.length){state.category='all';state.favoritesOnly=false;state.query='';renderCategories();renderProducts();}
}
// Event delegation keeps the prototype dependency-free.
document.addEventListener('click',e=>{
  const categoryButton=e.target.closest('[data-category]');
  if(categoryButton){e.preventDefault();selectCategory(categoryButton.dataset.category);return;}
  const like=e.target.closest('[data-like]');if(like){toggleLike(Number(like.dataset.like));return;}
  const add=e.target.closest('[data-add]');if(add){addCart(add.dataset.add);return;}
  const detail=e.target.closest('[data-detail]');if(detail){openDrawer('product',Number(detail.dataset.detail));return;}
  const step=e.target.closest('[data-step]');if(step){changeCart(step.dataset.id,Number(step.dataset.step));return;}
  const remove=e.target.closest('[data-remove-like]');if(remove){toggleLike(Number(remove.dataset.removeLike));return;}
  const fav=e.target.closest('[data-favorites-only]');if(fav){state.favoritesOnly=!state.favoritesOnly;state.category='all';state.query='';renderCategories();renderProducts();return;}
  const chip=e.target.closest('[data-query-el]');if(chip){const txt=chip.dataset[state.language==='el'?'queryEl':'queryEn'];el('assistantInput').value=txt;assistant(txt);return;}
});
el('favoritesButton').addEventListener('click',()=>openDrawer('favorites'));
el('cartButton').addEventListener('click',()=>openDrawer('cart'));
el('drawerClose').addEventListener('click',closeDrawer);
el('overlay').addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.drawerType)closeDrawer();});
el('searchForm').addEventListener('submit',e=>{e.preventDefault();search(el('searchInput').value.trim());});
el('mobileSearchForm').addEventListener('submit',e=>{e.preventDefault();search(el('mobileSearchInput').value.trim());});
el('sortSelect').addEventListener('change',e=>{state.sort=e.target.value;renderProducts();});
el('languageSelect').addEventListener('change',e=>{state.language=e.target.value;store.save('language',state.language);updateTranslations();});
el('countrySelect').addEventListener('change',e=>{state.country=e.target.value;store.save('country',state.country);el('countryFeedback').textContent=tr('countryFeedback');});
el('assistantForm').addEventListener('submit',e=>{e.preventDefault();const value=el('assistantInput').value.trim();if(value)assistant(value);});
el('countrySelect').value=state.country;
updateTranslations();
