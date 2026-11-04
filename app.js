const tabs=[['home','главная'],['catalog','каталог'],['cart','корзина'],['gift','вкусомания'],['profile','профиль']];document.querySelector('.tabs').innerHTML=tabs.map(([icon,label],i)=>`<button class="${i===0?'active':''}" data-tab="${icon}" aria-label="${label}"><img src="assets/${icon}.svg" alt=""><span>${label}</span></button>`).join('');const dialog=document.querySelector('dialog');function open(title,body){dialog.classList.remove('account-sheet');dialog.querySelector('h2').textContent=title;dialog.querySelector('.dialog-body').innerHTML=body;dialog.showModal()}document.querySelector('.close').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog&&e.clientY<dialog.getBoundingClientRect().top)dialog.close()};document.querySelector('.address-text').onclick=()=>{open('Выберите адрес доставки','<button data-address="Строгинский бульвар, 15">Дом · Строгинский бульвар, 15</button><button data-address="Союзная улица, 28">Работа · Союзная улица, 28</button>');dialog.querySelectorAll('[data-address]').forEach(b=>b.onclick=()=>{selectedAddress=b.dataset.address;sessionStorage.setItem('av-address',selectedAddress);document.querySelector('.address-text strong').firstChild.textContent=selectedAddress+' ';dialog.close()})};document.querySelectorAll('.switch button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.switch button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});document.querySelector('.signin').onclick=()=>open('Войдите в аккаунт','<p>Покажем акции и предложения «Вкусомании».</p><label>Номер телефона<input type="tel" placeholder="+7" style="display:block;padding:12px;margin:12px 0;width:100%"></label>');document.querySelectorAll('.tile,.promo').forEach(b=>b.onclick=()=>open(b.innerText.replaceAll('\n',' '),'<p>Предложение выбрано. Подробный экран добавим на следующем этапе прототипа.</p>'));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{if(b.dataset.tab==='home'){window.scrollTo({top:0,behavior:'smooth'});return}open(b.innerText,b.dataset.tab==='cart'?'<p>В корзине пока пусто</p>':'<p>Этот экран будет добавлен на следующем этапе.</p>')});document.querySelector('.popular button').onclick=()=>open('Популярно сейчас','<p>Список товаров добавим со следующим экраном.</p>');document.querySelector('.search input').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())open('Поиск: '+e.target.value,'<p>Результаты поиска подключим на следующем этапе.</p>')});
// Prototype-only authentication: no SMS or personal data is sent.
let signedIn=sessionStorage.getItem('av-signed-in')==='yes';
const signin=document.querySelector('.signin');
function renderAccount(){
 document.querySelector('.app').classList.toggle('signed-in',signedIn);
 let card=document.querySelector('.account-card');signin.hidden=signedIn;signin.style.display=signedIn?'none':'';
 const address=document.querySelector('.address-text');
 address.querySelector('strong').firstChild.textContent=(sessionStorage.getItem('av-address')||(signedIn?'Комсомольский п-т, 45':'Укажите адрес доставки'))+' ';
 address.querySelector('small').textContent=signedIn?'Выберите время доставки':'Доставка от 30 минут';
 if(signedIn&&!card){
 card=document.createElement('button');card.className='account-card';card.setAttribute('aria-label','Карта Вкусомании');
 const bars=[[29,4.014],[35.02,8.029],[45.06,4.014],[51.08,6.022],[59.11,2.007],[65.13,8.029],[77.17,4.014],[83.2,6.022],[91.22,2.007],[101.26,2.007],[107.28,6.022],[115.31,4.014],[123.34,2.007],[127.36,6.022],[137.39,2.007],[147.43,2.007],[151.44,4.014],[161.48,2.007],[167.5,2.007],[175.53,4.014],[181.55,8.029],[191.59,4.014],[201.62,2.007],[207.64,2.007],[217.68,4.014],[223.7,6.022],[231.73,2.007],[237.75,8.029],[247.79,4.014],[253.81,6.022],[261.84,4.014],[267.86,6.022],[277.9,2.007],[283.92,8.029],[293.96,4.014],[299.98,6.022]];
 card.innerHTML='<span class="loyalty-header"><strong>◉ вкусомания</strong><span>Дегустатор</span></span><span class="loyalty-barcode">'+bars.map(([x,w])=>'<i style="left:'+x+'px;width:'+w+'px"></i>').join('')+'<img src="assets/chevron.svg" alt=""></span><span class="loyalty-bottom"><span>50 <b>б</b></span><span>Купоны <b>+1</b></span></span>';
 signin.after(card);card.onclick=()=>openAccount();
 }
 if(!signedIn&&card)card.remove();
}
function openAccount(){open('Мой профиль','<p class="account-status">Вы вошли в аккаунт</p><div class="account-phone"><span>Телефон</span><strong>+7 (900) 000-00-00</strong></div><button class="auth-logout">Выйти из аккаунта</button>');dialog.classList.add('account-sheet');dialog.setAttribute('aria-label','Мой профиль');dialog.tabIndex=-1;dialog.focus({preventScroll:true});dialog.querySelector('.auth-logout').onclick=()=>{signedIn=false;sessionStorage.removeItem('av-signed-in');renderAccount();dialog.close()};}
function openAuth(){if(document.querySelector('.auth-screen'))return;const screen=document.createElement('section');screen.className='auth-screen';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Авторизация');const status=document.querySelector('.status').cloneNode(true);screen.append(status);screen.insertAdjacentHTML('beforeend','<header class="auth-heading"><button class="auth-back" aria-label="Вернуться без входа">←</button><h1>Авторизация</h1></header><form class="auth-panel"><h2>Код из СМС</h2><p class="auth-phone">Номер телефона +7 (900) 000-00-00</p><div class="otp-wrap"><div class="otp-dots" aria-hidden="true"><span>●</span><span>●</span><span>●</span><span>●</span></div><input id="otp" class="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]{4}" aria-describedby="code-help" aria-label="Код из SMS"></div><div class="auth-help" id="code-help">Это прототип<br>Для входа введите любые 4 цифры</div><div class="auth-error" role="status"></div><button class="auth-submit" disabled>Войти</button></form>');document.querySelector('.app').append(screen);const input=screen.querySelector('input'),submit=screen.querySelector('.auth-submit');screen.querySelector('.auth-back').onclick=()=>{screen.remove();signin.focus()};input.oninput=()=>{input.value=input.value.replace(/\D/g,'').slice(0,4);submit.disabled=input.value.length!==4;screen.querySelectorAll('.otp-dots span').forEach((dot,i)=>{dot.classList.toggle('filled',i<input.value.length)})};screen.querySelector('form').onsubmit=e=>{e.preventDefault();if(input.value.length!==4)return;signedIn=true;selectedDeliveryTime='';unavailableDeliveryTime='';sessionStorage.removeItem('av-delivery-time');selectedAddress='Комсомольский п-т, 45';sessionStorage.setItem('av-address',selectedAddress);sessionStorage.setItem('av-signed-in','yes');screen.remove();renderAccount();document.querySelector('.account-card').focus()};const nativeKeyboard = Boolean(navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
input.setAttribute('inputmode',nativeKeyboard?'numeric':'none');
const keyboard=document.createElement('div');keyboard.className='numeric-keyboard';keyboard.setAttribute('role','group');keyboard.setAttribute('aria-label','Цифровая клавиатура');
const letters=['','А Б В Г','Д Е Ж З','И Й К Л','М Н О П','Р С Т У','Ф Х Ц Ч','Ш Щ Ъ Ы','Ь Э Ю Я'];
keyboard.innerHTML=Array.from({length:9},(_,i)=>'<button type="button" data-digit="'+(i+1)+'" aria-label="'+(i+1)+'"><span>'+(i+1)+'</span><small>'+letters[i]+'</small></button>').join('')+'<span></span><button type="button" data-digit="0" aria-label="0"><span>0</span></button><button type="button" class="key-delete" aria-label="Удалить цифру">⌫</button><div class="keyboard-indicator"></div>';
if(!nativeKeyboard)screen.append(keyboard);keyboard.addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault()});keyboard.querySelectorAll('[data-digit]').forEach(b=>b.onclick=()=>{input.value=(input.value+b.dataset.digit).slice(0,4);input.dispatchEvent(new Event('input'));input.focus()});keyboard.querySelector('.key-delete').onclick=()=>{input.value=input.value.slice(0,-1);input.dispatchEvent(new Event('input'));input.focus()};input.focus();}
signin.onclick=openAuth;document.querySelector('[data-tab="profile"]').onclick=()=>signedIn?openAccount():openAuth();renderAccount();
const products=[{id:'pancakes',title:'Блинчики с яблоками, «Уже готово», 3 шт., Россия',weight:'240 г',rating:4,price:323},{id:'banana',title:'Банан, «Просто Азбука»',weight:'150 г',rating:3,price:79,badge:'азбучный хит'},{id:'bacon',title:'Бекон Премиум из мраморной говядины, «Таурус»',weight:'200 г',rating:3,price:418,badge:'фермерский продукт'}];
let selectedAddress=sessionStorage.getItem('av-address')||'';
let selectedDeliveryTime=sessionStorage.getItem('av-delivery-time')||'';
let addressPromptTimer=null;
let pendingStockChanges=[];
let unavailableDeliveryTime='';
products.push({id:'banana-bunch',title:'Бананы',weight:'1 кг',rating:2,price:278});
const cartQuantities={};const favorites=new Set();
const carousel=document.createElement('section');carousel.className='product-carousel';carousel.setAttribute('aria-label','Популярные товары');carousel.setAttribute('tabindex','0');document.querySelector('.popular').after(carousel);
function renderProducts(){const scroll=carousel.scrollLeft;carousel.innerHTML=products.filter(p=>p.id!=='banana-bunch').map(productCardMarkup).join('');carousel.scrollLeft=scroll;document.querySelector('.cart-count')?.remove();const count=Object.values(cartQuantities).reduce((a,b)=>a+b,0);const total=products.reduce((sum,p)=>sum+p.price*(cartQuantities[p.id]||0),0);const cartTab=document.querySelector('[data-tab="cart"]');cartTab.querySelector('span:not(.cart-count)').textContent=count?new Intl.NumberFormat('ru-RU').format(total)+' ₽':'корзина';cartTab.setAttribute('aria-label',count?'Корзина: '+count+' шт, '+total+' рублей':'корзина');if(count)cartTab.insertAdjacentHTML('beforeend',`<span class="cart-count">${count}</span>`);renderSearchResults();}
carousel.onclick=e=>{const article=e.target.closest('[data-product]');if(!article)return;const id=article.dataset.product;const control=e.target.closest('[data-change]');if(control){if(Number(control.dataset.change)>0&&!signedIn&&!selectedAddress){navigator.vibrate?.([40,30,40]);article.classList.remove('shake');void article.offsetWidth;article.classList.add('shake');if(!addressPromptTimer)addressPromptTimer=setTimeout(()=>{addressPromptTimer=null;openAddressMap()},3000);return;}cartQuantities[id]=Math.min(isStroginAddress()&&['pancakes','banana','banana-bunch'].includes(id)?1:id==='pancakes'?5:Infinity,Math.max(0,(cartQuantities[id]||0)+Number(control.dataset.change)));renderProducts()}const fav=e.target.closest('.product-favorite');if(fav){favorites.has(id)?favorites.delete(id):favorites.add(id);fav.setAttribute('aria-pressed',favorites.has(id))}};
carousel.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>0)return;if(e.shiftKey){e.preventDefault();carousel.scrollLeft+=e.deltaY}},{passive:false});
carousel.onkeydown=e=>{if(e.target!==carousel)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();carousel.scrollBy({left:e.key==='ArrowRight'?199:-199,behavior:'smooth'})}};
document.querySelector('[data-tab="cart"]').onclick=()=>{const items=products.filter(p=>cartQuantities[p.id]);open('Корзина',items.length?items.map(p=>`<p>${p.title}<br>${cartQuantities[p.id]} шт · ${p.price*cartQuantities[p.id]} ₽</p>`).join(''):'<p>В корзине пока пусто</p>')};renderProducts();

function openAddressMap(){
 if(document.querySelector('.address-map'))return;
 const screen=document.createElement('section');screen.className='address-map';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Выбор адреса доставки');
 screen.innerHTML='<div class="map-top"><button class="map-back" aria-label="Назад">‹</button><div class="map-modes"><button class="selected">Доставка</button><button>Самовывоз</button></div></div><div class="map-pin"><i></i></div><div class="map-bottom"><label><img src="assets/search.svg" alt=""><input aria-label="Адрес доставки" value="Комсомольский проспект, 45"></label><button class="map-confirm">Доставить сюда</button><div class="map-home-indicator"></div></div>';
 screen.querySelector('input').value=selectedAddress||'Комсомольский проспект, 45';
 const addressInput=screen.querySelector('input');
 const alternativeAddress=/строгинск/i.test(selectedAddress)?'Комсомольский п-т, 45':'Строгинский б-р, 15';
 addressInput.addEventListener('click',()=>{addressInput.value=alternativeAddress},{once:true});
 addressInput.insertAdjacentHTML('afterend','<button type="button" class="map-clear-address" aria-label="Очистить адрес">×</button>');
 screen.querySelector('.map-clear-address').onclick=()=>{addressInput.value='';addressInput.focus()};
 document.querySelector('.app').append(screen);
 const close=()=>screen.remove();screen.querySelector('.map-back').onclick=close;
 screen.querySelectorAll('.map-modes button').forEach(b=>b.onclick=()=>{screen.querySelectorAll('.map-modes button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');screen.querySelector('.map-confirm').textContent=b.textContent==='Доставка'?'Доставить сюда':'Забрать здесь'});
 screen.querySelector('.map-confirm').onclick=()=>{const value=screen.querySelector('input').value.trim();if(!value){screen.querySelector('input').focus();return;}close();applyDeliveryAddress(value)};
}
if(selectedAddress&&!signedIn){document.querySelector('.address-text strong').firstChild.textContent=selectedAddress+' ';document.querySelector('.address-text small').textContent='Выберите время доставки';}
const previousAddressClick=document.querySelector('.address-text').onclick;
document.querySelector('.address-text').onclick=()=>{
 if(!signedIn){if(addressPromptTimer){clearTimeout(addressPromptTimer);addressPromptTimer=null;}openAddressMap();}
 else previousAddressClick();
};
function openAddressSheet({remindAboutTime=false}={}){
 if(document.querySelector('.address-sheet-overlay'))return;
 const overlay=document.createElement('div');overlay.className='address-sheet-overlay';
 overlay.innerHTML='<section class="address-sheet" role="dialog" aria-modal="true" aria-label="Адрес и время доставки"><header class="address-sheet-header"><div class="sheet-handle"></div><div class="sheet-modes"><button class="selected">Доставка</button><button>Самовывоз</button></div></header><button class="sheet-address-row"><span>Строгинский бульвар, 15</span><img src="assets/chevron.svg" alt=""></button><button class="sheet-time-row"><strong>Выберите время доставки</strong><img src="assets/chevron.svg" alt=""></button><div class="sheet-indicator"></div></section>';
 const previousFocus=document.activeElement,previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 let timeReminder=null;
 const remind=()=>{navigator.vibrate?.([40,30,40]);const row=overlay.querySelector('.sheet-time-row');row.classList.remove('time-reminder-shake');void row.offsetWidth;row.classList.add('time-reminder-shake')};
 const close=(force=false)=>{if(remindAboutTime&&!selectedDeliveryTime&&force!==true){remind();return;}clearInterval(timeReminder);overlay.remove();document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',key);previousFocus?.focus()};const key=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',key);
 overlay.dismiss=close;overlay.onclick=e=>{if(e.target===overlay)close()};overlay.querySelector('.sheet-handle').onclick=close;
 overlay.querySelectorAll('.sheet-modes button').forEach(b=>b.onclick=()=>{overlay.querySelectorAll('.sheet-modes button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});
 overlay.querySelector('.sheet-address-row span').textContent=document.querySelector('.address-text strong').textContent.trim();
 overlay.querySelector('.sheet-time-row strong').textContent=selectedDeliveryTime||'Выберите время доставки';
 if(unavailableDeliveryTime){const message=document.createElement('p');message.className='delivery-time-error';message.setAttribute('role','status');message.textContent='По этому адресу выбранное время недоступно: '+unavailableDeliveryTime+'. Выберите другое время.';overlay.querySelector('.address-sheet').append(message);overlay.querySelector('.address-sheet').classList.add('has-time-error')}
 overlay.querySelector('.sheet-address-row').onclick=()=>{close(true);openAddressMap()};
 overlay.querySelector('.sheet-time-row').onclick=()=>{close(true);openTimePicker({returnToAddress:remindAboutTime})};
 document.querySelector('.app').append(overlay);const sheet=overlay.querySelector('.address-sheet');sheet.tabIndex=-1;sheet.focus({preventScroll:true});
 if(remindAboutTime&&!selectedDeliveryTime)timeReminder=setInterval(()=>{if(overlay.isConnected&&!selectedDeliveryTime)remind()},3000);
}
document.querySelector('.address-text').onclick=()=>{if(addressPromptTimer){clearTimeout(addressPromptTimer);addressPromptTimer=null;}if(signedIn||selectedAddress)openAddressSheet();else openAddressMap()};

function openTimePicker({returnToAddress=false}={}){
 if(document.querySelector('.time-overlay'))return;
 const overlay=document.createElement('div');overlay.className='time-overlay';
 overlay.innerHTML='<section class="time-sheet" role="dialog" aria-modal="true" aria-label="Дата и время доставки"><header><div class="sheet-handle"></div><button class="time-back" aria-label="Назад">←</button><h2>Дата и время доставки</h2></header><div class="time-terms"><span class="time-clock">◴</span><span>Заказ от 500 ₽<small>Бесплатная доставка от 4999 ₽</small></span></div><div class="time-availability"><span>Доступно 13 500 товаров</span></div><div class="time-selection"><div class="time-wheels"><div class="day-options"></div><div class="slot-options"></div></div><button class="time-confirm">Сегодня, за 50 минут</button></div><div class="sheet-indicator"></div></section>';
 let day=selectedDeliveryTime?selectedDeliveryTime.split(', ')[0]:'Сегодня',slot=selectedDeliveryTime?selectedDeliveryTime.split(', ').slice(1).join(', '):'за 50 минут';
 const days=['Сегодня','Завтра',...Array.from({length:3},(_,i)=>{const d=new Date(2026,10,5+i);return new Intl.DateTimeFormat('ru-RU',{weekday:'short',day:'numeric',month:'long'}).format(d)})];
 overlay.querySelector('.day-options').innerHTML=days.map((d,i)=>'<button class="'+(d===day?'selected':'')+'">'+d+'</button>').join('');
 const slots=()=>{const values=deliverySlots(day);if(!values.includes(slot))slot=values[0];overlay.querySelector('.slot-options').innerHTML=values.map(t=>'<button class="'+(t===slot?'selected':'')+'">'+t+'</button>').join('');overlay.querySelectorAll('.slot-options button').forEach(b=>b.onclick=()=>{slot=b.textContent;slots();update()})};
 const update=()=>overlay.querySelector('.time-confirm').textContent=day+', '+slot;
 overlay.querySelectorAll('.day-options button').forEach(b=>b.onclick=()=>{day=b.textContent;overlay.querySelectorAll('.day-options button').forEach(x=>x.classList.toggle('selected',x===b));slots();update()});slots();update();
 const previous=document.body.style.overflow;document.body.style.overflow='hidden';const close=()=>{overlay.remove();document.body.style.overflow=previous;document.removeEventListener('keydown',escape);if(returnToAddress&&!selectedDeliveryTime)openAddressSheet({remindAboutTime:true})};const escape=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',escape);overlay.onclick=e=>{if(e.target===overlay)close()};overlay.querySelector('.time-back').onclick=close;
 overlay.querySelector('.time-confirm').onclick=()=>{selectedDeliveryTime=day+', '+slot;unavailableDeliveryTime='';sessionStorage.setItem('av-delivery-time',selectedDeliveryTime);document.querySelector('.address-text small').textContent=selectedDeliveryTime;close();if(pendingStockChanges.length){const changed=pendingStockChanges;pendingStockChanges=[];showStockChangeNotice(changed)}};document.querySelector('.app').append(overlay);
}
if(selectedDeliveryTime)document.querySelector('.address-text small').textContent=selectedDeliveryTime;

// Demo availability: Strogin does not offer today's 21:00–23:00 interval.
function deliverySlots(day){return day==='Сегодня'?(isStroginAddress()?['за 50 минут']:['за 50 минут','21:00 – 23:00']):['09:00 – 11:00','11:00 – 13:00','13:00 – 15:00']}
function validateDeliveryTime(){if(!selectedDeliveryTime)return;const [day,...parts]=selectedDeliveryTime.split(', ');if(!deliverySlots(day).includes(parts.join(', '))){unavailableDeliveryTime=selectedDeliveryTime;selectedDeliveryTime='';sessionStorage.removeItem('av-delivery-time')}else unavailableDeliveryTime=''}
function isStroginAddress(){return /строгинск/i.test(selectedAddress)}
function applyDeliveryAddress(value){
 selectedAddress=/строгинск/i.test(value)?'Строгинский б-р, 15':/комсомольск/i.test(value)?'Комсомольский п-т, 45':value;
 sessionStorage.setItem('av-address',selectedAddress);
 validateDeliveryTime();
 document.querySelector('.address-text strong').firstChild.textContent=selectedAddress+' ';
 document.querySelector('.address-text small').textContent=selectedDeliveryTime||'Выберите время доставки';
 const reduced=isStroginAddress()?['pancakes','banana','banana-bunch'].filter(id=>(cartQuantities[id]||0)>1):[];
 reduced.forEach(id=>cartQuantities[id]=1);
 renderProducts();
 pendingStockChanges=reduced;
 if(selectedDeliveryTime&&reduced.length){pendingStockChanges=[];showStockChangeNotice(reduced)}else openAddressSheet({remindAboutTime:!selectedDeliveryTime});
}
function showStockChangeNotice(reduced){
 openAddressSheet();
 const overlay=document.querySelector('.address-sheet-overlay');
 const notice=document.createElement('div');notice.className='stock-notice stock-notice-enter';notice.setAttribute('role','status');
 notice.innerHTML='<span class="stock-alert" aria-hidden="true"><img src="assets/alert-triangle.svg" alt=""></span><span>Доступны не все товары из корзины</span><button aria-label="Закрыть уведомление">×</button>';
 overlay.append(notice);
 notice.querySelector('button').onclick=()=>{overlay.dismiss();showStockSpotlight(reduced)};
 setTimeout(()=>{if(!overlay.isConnected)return;overlay.dismiss();showStockSpotlight(reduced)},1400);
}
function showStockSpotlight(ids){
 const [id,...remaining]=ids;
 const card=document.querySelector(`.search-grid [data-product="${id}"]`)||carousel.querySelector(`[data-product="${id}"]`);
 if(!card){if(remaining.length)showStockSpotlight(remaining);return;}
 // Preserve the horizontal scroll position when highlighting changed products.
 const target=card.getBoundingClientRect().top+window.scrollY;
 window.scrollTo({top:Math.max(0,target-Math.min(300,window.innerHeight*.4)),behavior:'instant'});
 const overlay=document.createElement('div');overlay.className='stock-spotlight';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',id==='banana'?'По новому адресу доступен 1 банан':'По новому адресу доступна одна упаковка блинов');
 const clone=card.cloneNode(true),r=card.getBoundingClientRect(),appRect=document.querySelector('.app').getBoundingClientRect();
 clone.classList.add('stock-highlight');clone.style.cssText=`position:absolute;left:${r.left-appRect.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
 clone.querySelectorAll('button').forEach(b=>b.tabIndex=-1);
 overlay.innerHTML='<button class="spotlight-close" aria-label="Закрыть подсказку">×</button><div class="stock-notice"><span class="stock-alert" aria-hidden="true"><img src="assets/alert-triangle.svg" alt=""></span><span>По новому адресу доступен 1 товар</span><span aria-hidden="true">×</span></div>';
 overlay.querySelector('.stock-notice').style.top=Math.max(70,r.top-52)+'px';
 overlay.append(clone);
 const arrow=document.createElement('img');arrow.src='assets/stock-arrow.svg';arrow.alt='';arrow.className='stock-spotlight-arrow';arrow.style.left=(r.left-appRect.left+217)+'px';arrow.style.top=(r.top+4)+'px';overlay.append(arrow);
 const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 const dismiss=()=>{overlay.remove();document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',escape);if(remaining.length)showStockSpotlight(remaining)};
 const escape=e=>{if(e.key==='Escape')dismiss()};document.addEventListener('keydown',escape);
 overlay.onclick=dismiss;document.querySelector('.app').append(overlay);overlay.querySelector('.spotlight-close').focus({preventScroll:true});
}

function productCardMarkup(p){const q=cartQuantities[p.id]||0;return `<article class="product-card" data-product="${p.id}"><div class="product-photo ${p.id}">${p.id==='bacon'?'<div class="bacon-crop"><img src="assets/bacon.png" alt="Бекон"></div>':`<img src="assets/${p.id}.png" alt="${p.title.replaceAll('"','&quot;')}">`}</div><div class="product-meta"><span>${p.weight}</span><span class="product-rating"><img src="assets/rating.svg" alt="Рейтинг">${p.rating}</span></div><h3 class="product-title">${p.title}</h3><div class="product-price">${p.price}<sup>00 ₽</sup></div><div class="product-control">${q?`<button data-change="-1" aria-label="Уменьшить количество"><img src="assets/minus.svg" alt=""></button><span class="quantity-label">${q} шт</span><button data-change="1" aria-label="Увеличить количество"><img src="assets/plus.svg" alt=""></button>`:'<button data-change="1">В корзину</button>'}</div>${p.badge?`<span class="product-badge ${p.id==='bacon'?'farm':''}">${p.badge}</span>`:''}<button class="product-favorite" aria-label="В избранное" aria-pressed="${favorites.has(p.id)}"><img src="assets/favorite.svg" alt=""></button></article>`}

function openSearch(query=''){
 if(document.querySelector('.search-screen'))return;
 const screen=document.createElement('section');screen.className='search-screen';screen.setAttribute('aria-label','Поиск товаров');
 screen.innerHTML='<div class="search-top"></div><header class="search-heading"><button class="search-back" aria-label="Назад"><img src="assets/back.svg" alt=""></button><label class="search"><img src="assets/search.svg" alt=""><input placeholder="Найти в Азбуке" aria-label="Поиск в каталоге"><button class="search-clear" aria-label="Очистить поиск"><img src="assets/search-clear.svg" alt=""></button></label></header><div class="search-tools"><button class="search-filter"><img src="assets/filters.svg" alt="">Фильтры</button><button class="search-sort"><img src="assets/filters.svg" alt="">Фильтры</button></div><div class="search-chips"></div><div class="search-results"><h2 aria-live="polite"></h2><div class="search-grid"></div></div>';
 screen.querySelector('.search-top').append(document.querySelector('.status').cloneNode(true));
 document.querySelector('.app').append(screen);
 const input=screen.querySelector('input');input.value=query;
 screen.querySelector('.search-back').onclick=closeSearch;
 screen.querySelector('.search-clear').onclick=()=>{input.value='';renderSearchResults();input.focus()};input.oninput=renderSearchResults;
 input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();input.blur()}};
 screen.querySelector('.search-grid').onclick=carousel.onclick;
 // Filters are an explicit prototype stub rather than pretending to filter.
 screen.querySelectorAll('.search-tools button').forEach(button=>button.onclick=()=>open('Фильтры','<p>В этом прототипе доступен поиск по названию товара</p>'));
 document.querySelector('[data-tab="home"] img').src='assets/home-outline.svg';document.querySelector('[data-tab="catalog"] img').src='assets/catalog-active.svg';document.querySelector('[data-tab="home"]').classList.remove('active');document.querySelector('[data-tab="catalog"]').classList.add('active');
 attachSearchKeyboard(screen,input);renderSearchResults();input.focus({preventScroll:true});
}
function closeSearch(){document.querySelector('.app').classList.remove('search-keyboard-open');document.querySelector('[data-tab="home"] img').src='assets/home.svg';document.querySelector('[data-tab="catalog"] img').src='assets/catalog.svg';document.querySelector('.search-screen')?.remove();document.querySelector('[data-tab="catalog"]').classList.remove('active');document.querySelector('[data-tab="home"]').classList.add('active')}
function renderSearchResults(){
 const screen=document.querySelector('.search-screen');if(!screen)return;
 const query=screen.querySelector('input').value.trim().toLocaleLowerCase('ru');
 const matches=query?products.filter(p=>p.title.toLocaleLowerCase('ru').includes(query)):[];
 matches.sort((a,b)=>(a.id==='banana-bunch'?-1:b.id==='banana-bunch'?1:0));
 screen.querySelector('.search-results h2').textContent=query?'Найдено: '+matches.length:'Введите название товара';
 screen.querySelector('.search-grid').innerHTML=matches.map(productCardMarkup).join('');
 const chips=query.includes('бан')?['банановый','торт','Эквадор','мини','снеки']:query.includes('блин')?['блинчики','с яблоками']:[];
 screen.querySelector('.search-chips').innerHTML=chips.map(t=>'<button>'+t+'</button>').join('');
 screen.querySelectorAll('.search-chips button').forEach(b=>b.onclick=()=>{screen.querySelector('input').value=b.textContent;renderSearchResults()});
}
document.querySelector('.search input').addEventListener('focus',()=>openSearch());
document.querySelector('[data-tab="home"]').onclick=()=>{closeSearch();window.scrollTo({top:0,behavior:'smooth'})};
document.querySelector('[data-tab="catalog"]').onclick=()=>openSearch();

function attachSearchKeyboard(screen,input){
 const nativeKeyboard=Boolean(navigator.userAgentData?.mobile||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1));
 if(nativeKeyboard){input.inputMode='search';return;}
 input.inputMode='none';
 const keyboard=document.createElement('div');keyboard.className='search-keyboard';keyboard.setAttribute('role','group');keyboard.setAttribute('aria-label','Клавиатура поиска');
 let latin=false,upper=false;
 const draw=()=>{const rows=latin?['qwertyuiop','asdfghjkl','zxcvbnm']:['йцукенгшщзх','фывапролджэ','ячсмитьбю'];keyboard.innerHTML=rows.map((row,i)=>'<div class="letter-row">'+(i===2?'<button data-key="shift" class="keyboard-action" aria-label="Сменить регистр">⇧</button>':'')+[...row].map(c=>'<button data-letter="'+c+'">'+(upper?c.toUpperCase():c)+'</button>').join('')+(i===2?'<button data-key="delete" class="keyboard-action" aria-label="Удалить символ">⌫</button>':'')+'</div>').join('')+'<div class="letter-row keyboard-bottom"><button data-key="language" class="keyboard-action">'+(latin?'АБВ':'ABC')+'</button><button data-letter=" " class="keyboard-space">Пробел</button><button data-key="search" class="keyboard-search">Найти</button></div><div class="keyboard-indicator"></div>'};
 draw();screen.append(keyboard);
 const show=()=>{screen.classList.add('has-search-keyboard');document.querySelector('.app').classList.add('search-keyboard-open')};
 const hide=()=>{screen.classList.remove('has-search-keyboard');document.querySelector('.app').classList.remove('search-keyboard-open')};
 input.addEventListener('focus',show);input.addEventListener('blur',hide);
 keyboard.addEventListener('pointerdown',e=>e.preventDefault());
 keyboard.onclick=e=>{const button=e.target.closest('button');if(!button)return;const key=button.dataset.key;if(key==='search'){input.blur();hide();return;}if(key==='language'){latin=!latin;draw();return;}if(key==='shift'){upper=!upper;draw();return;}
 let start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
 if(key==='delete'){if(start===end)start=Math.max(0,start-1);input.setRangeText('',start,end,'end')}else{const letter=upper?button.dataset.letter.toUpperCase():button.dataset.letter;input.setRangeText(letter,start,end,'end');if(upper){upper=false;draw()}}
 input.dispatchEvent(new Event('input',{bubbles:true}));input.focus({preventScroll:true});};
}
