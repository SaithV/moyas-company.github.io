// Moyas Company interactive script
// ================= Helpers =================
const qs = (s,o=document)=>o.querySelector(s);
const qsa = (s,o=document)=>[...o.querySelectorAll(s)];

// ================= Mobile Nav Toggle =================
const navToggle = qs('.nav__toggle');
const navList = qs('.nav__list');
let navOverlay = qs('.nav__overlay');
if(!navOverlay){
  navOverlay = document.createElement('div');
  navOverlay.className = 'nav__overlay';
  document.body.appendChild(navOverlay);
}
function setNav(open){
  navList.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  navToggle.classList.toggle('active', open);
  document.body.classList.toggle('nav-open', open);
  navOverlay.classList.toggle('show', open);
}
navToggle?.addEventListener('click', () => setNav(!navList.classList.contains('open')));
navOverlay.addEventListener('click', ()=> setNav(false));
document.addEventListener('keyup', e=> { if(e.key==='Escape') setNav(false); });
qsa('.nav__list a').forEach(a => a.addEventListener('click', ()=>{ if(window.innerWidth < 880) setNav(false); }));

// ================= Year =================
qs('#year').textContent = new Date().getFullYear();

// ================= Scroll Animations =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
},{ rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
qsa('[data-animate]').forEach(el=> observer.observe(el));

// ================= Stats Counter =================
function animateCount(el) {
  const final = +el.dataset.count;
  const dur = 1800; const start = performance.now();
  function frame(t){
    const p = Math.min(1,(t-start)/dur);
    const eased = 1 - Math.pow(1-p,3);
    el.textContent = Math.round(final * eased);
    if(p<1) requestAnimationFrame(frame); else el.textContent = final;
  }
  requestAnimationFrame(frame);
}
const statNums = qsa('.stat__num');
const statObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ animateCount(e.target); statObserver.unobserve(e.target); }
  });
},{ threshold:.6 });
statNums.forEach(n=>statObserver.observe(n));

// ================= Product Filter =================
const chips = qsa('.chip');
const products = qsa('.product-card');
chips.forEach(chip => chip.addEventListener('click', ()=>{
  chips.forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  const cat = chip.dataset.filter;
  products.forEach(p=>{
    const show = cat==='all' || p.dataset.cat===cat;
    p.style.display = show ? '' : 'none';
  });
}));

// ================= Inquire Buttons =================
qsa('[data-action="inquire"]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const item = btn.dataset.item;
    const url = `https://wa.me/526531202968?text=${encodeURIComponent('Hola! Me interesa ' + item)}`;
    window.open(url,'_blank','noopener');
  });
});

// (Cursor personalizado removido a petición)

// ================= Smooth anchor offset =================
function offsetScroll(e){
  const id = this.getAttribute('href');
  if(!id.startsWith('#')) return;
  const target = qs(id);
  if(target){
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top:y, behavior:'smooth'});
  }
}
qsa('a[href^="#"]').forEach(a=> a.addEventListener('click', offsetScroll));

// ================= Performance: reduce motion respect =================
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  qsa('*').forEach(el=> el.style.animationDuration = '0s');
}

// ================= Minor Easter Egg =================
console.log('%cMoyas Company','background:linear-gradient(90deg,#3b82f6,#6366f1,#ec4899);font-size:16px;color:#fff;padding:6px 12px;border-radius:6px;');
