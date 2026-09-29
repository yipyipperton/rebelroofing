const header=document.querySelector('.site-header');
const progress=document.querySelector('.scroll-progress');
let ticking=false;
function updateScroll(){const distance=document.documentElement.scrollHeight-innerHeight;progress.style.width=(distance>0?Math.min(100,scrollY/distance*100):0)+'%';header.classList.toggle('scrolled',scrollY>20);ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();
const menuButton=document.querySelector('.menu-toggle');const mobileNav=document.querySelector('.mobile-nav');
let menuScrollPosition=0;
function closeMenu(){if(mobileNav.open)mobileNav.close();}
function restoreMenuPage(){
 document.body.style.position='';document.body.style.top='';document.body.style.width='';document.body.style.overflow='';
 document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,menuScrollPosition);document.documentElement.style.scrollBehavior='';
 menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');
}
function openMenu(){
 menuScrollPosition=window.scrollY;mobileNav.showModal();
 document.body.style.position='fixed';document.body.style.top=`-${menuScrollPosition}px`;document.body.style.width='100%';document.body.style.overflow='hidden';
 menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close navigation');
}
menuButton.addEventListener('click',()=>mobileNav.open?closeMenu():openMenu());
mobileNav.querySelector('.menu-close').addEventListener('click',closeMenu);
mobileNav.addEventListener('close',restoreMenuPage);
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
matchMedia('(min-width: 801px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
dropdowns.forEach(drop=>drop.addEventListener('toggle',()=>{if(drop.open)dropdowns.forEach(other=>{if(other!==drop)other.open=false;});}));
addEventListener('click',event=>{dropdowns.forEach(drop=>{if(!drop.contains(event.target))drop.open=false;});if(!header.contains(event.target))closeMenu();});
addEventListener('keydown',event=>{if(event.key==='Escape'){const hadMenu=mobileNav.open;closeMenu();dropdowns.forEach(drop=>drop.open=false);if(hadMenu)menuButton.focus();}});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}});},{threshold:.07});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}

const filters=[...document.querySelectorAll('[data-filter]')];const galleryItems=[...document.querySelectorAll('.gallery-item')];
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(other=>{const selected=button===other;other.classList.toggle('active',selected);other.setAttribute('aria-pressed',String(selected));});let visible=0;galleryItems.forEach(item=>{item.hidden=button.dataset.filter!=='all'&&button.dataset.filter!==item.dataset.category;if(!item.hidden)visible++;});document.querySelector('#gallery-count').textContent=visible+' photo'+(visible===1?'':'s');}));
const lightbox=document.querySelector('.lightbox');if(lightbox){galleryItems.forEach(item=>item.addEventListener('click',()=>{const image=lightbox.querySelector('img');image.src=item.dataset.image;image.alt=item.querySelector('img').alt;lightbox.querySelector('p').textContent=item.dataset.caption;lightbox.showModal();}));lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',event=>{if(event.target===lightbox){const rect=lightbox.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)lightbox.close();}});}
const currentPath=location.pathname.replace(/\/$/,'')||'/';document.querySelectorAll('.desktop-nav a,.mobile-nav a').forEach(a=>{if((new URL(a.href).pathname.replace(/\/$/,'')||'/')===currentPath){a.setAttribute('aria-current','page');a.closest('.nav-dropdown')?.classList.add('current-section');}});
document.querySelectorAll('[data-roof-funnel]').forEach(form=>{
 const steps=[...form.querySelectorAll('.funnel-step')],back=form.querySelector('.funnel-back'),next=form.querySelector('.funnel-next'),error=form.querySelector('.funnel-error'),progress=form.querySelector('.funnel-progress'),counter=form.querySelector('.funnel-counter');let step=0;
 const labels={service:'Roofing need',property_type:'Property',timeline:'Timeline',financing:'Financing interest',full_name:'Name',phone:'Phone',address:'Property address',notes:'Additional details'};
 function review(){const list=form.querySelector('.funnel-review');list.replaceChildren();const data=new FormData(form);Object.entries(labels).forEach(([key,label])=>{const value=String(data.get(key)||'').trim();if(!value)return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;list.append(dt,dd);});}
 function focusQuestion(target){target.focus({preventScroll:true});if(form.getBoundingClientRect().top<90)form.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 function render(focus=true){steps.forEach((el,i)=>el.hidden=i!==step);back.hidden=step===0;next.textContent=step===5?'Finish Demo':'Continue';counter.textContent=`Step ${step+1} of 6`;progress.setAttribute('aria-valuenow',String(step+1));progress.firstElementChild.style.width=((step+1)/6*100)+'%';error.textContent='';if(step===5)review();if(focus)focusQuestion(steps[step].querySelector('legend'));}
 function validate(){if(step<4){if(!steps[step].querySelector('input:checked')){error.textContent='Choose an option to continue.';steps[step].querySelector('input').focus();return false;}}
 if(step===4){for(const input of steps[step].querySelectorAll('[required]')){if(!input.value.trim()){error.textContent='Please complete your name, phone number, and property address.';input.focus();return false;}}const phone=form.elements.phone;if(phone.value.replace(/\D/g,'').length<10){error.textContent='Enter a phone number with at least 10 digits.';phone.focus();return false;}}
 return true;}
 form.addEventListener('submit',event=>{event.preventDefault();if(!validate())return;if(step<5){step++;render();}else{steps.forEach(el=>el.hidden=true);form.querySelector('.funnel-actions').hidden=true;form.querySelector('.funnel-demo').hidden=true;error.textContent='';counter.textContent='Demo complete';const complete=form.querySelector('.funnel-complete');complete.hidden=false;focusQuestion(complete.querySelector('h3'));}});
 back.addEventListener('click',()=>{if(step>0){step--;render();}});
 form.querySelector('.funnel-restart').addEventListener('click',()=>{form.reset();step=0;form.querySelector('.funnel-complete').hidden=true;form.querySelector('.funnel-actions').hidden=false;form.querySelector('.funnel-demo').hidden=false;form.querySelector('.funnel-urgent').hidden=true;render();});
 form.addEventListener('change',()=>{error.textContent='';form.querySelector('.funnel-urgent').hidden=form.elements.timeline.value!=='As soon as possible';});render(false);
});
