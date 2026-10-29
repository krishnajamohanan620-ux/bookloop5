const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mem={};
function load(k,d){try{const v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(e){}return mem[k]!==undefined?mem[k]:d}
function save(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

const COURSES=['CSE','ECE','EEE','ME','CE','Other'],CNAME={ME:'Mechanical',CE:'Civil'};
const CONDS=['Like New','Good','Fair'],TYPES=['Sale','Rental','Exchange'],SEMS=[1,2,3,4,5,6,7,8];
const SEED=[
 {id:1,title:'Java: The Complete Reference',author:'Herbert Schildt',course:'CSE',semester:3,college:'Campus Demo College',price:350,bookCondition:'Good',listingType:'Sale',sellerContact:'demo-cse@example.com'},
 {id:2,title:'Operating System Concepts',author:'Silberschatz, Galvin and Gagne',course:'CSE',semester:4,college:'Campus Demo College',price:420,bookCondition:'Like New',listingType:'Sale',sellerContact:'demo-cse@example.com'},
 {id:3,title:'Engineering Mathematics',author:'B. S. Grewal',course:'ECE',semester:2,college:'Campus Demo College',price:250,bookCondition:'Fair',listingType:'Rental',sellerContact:'demo-ece@example.com'},
 {id:4,title:'Data Structures Using C',author:'Reema Thareja',course:'CSE',semester:3,college:'Campus Demo College',price:0,bookCondition:'Good',listingType:'Exchange',sellerContact:'demo-cse@example.com'}];
let books=load('bl_books',SEED),reqs=load('bl_reqs',[]),cart=load('bl_cart',[]);
let f={title:'',course:'',sem:''};
let tt;
function toast(m,bad){const t=$('#toast');t.textContent=m;t.className='show'+(bad?' bad':'');clearTimeout(tt);tt=setTimeout(()=>t.className='',2600)}
const price=b=>b.listingType==='Exchange'?'Exchange':'₹'+Number(b.price).toFixed(2);
const go=h=>{if(location.hash==='#'+h)render();else location.hash=h};

function nav(r){
  const l=[['books','Explore books'],['sell','Sell a book'],['need-book','Need a book?'],['requests','Requests'],['cart','Selected books']];
  $('#nav').innerHTML=l.map(([h,t])=>`<a href="#${h}" class="${r===h?'on':''}">${t}${h==='cart'&&cart.length?`<span class="badge">${cart.length}</span>`:''}</a>`).join('');
}

/* form helpers */
const inp=(n,v,ph,t='text',x='')=>`<input name="${n}" type="${t}" value="${esc(v[n]??'')}" placeholder="${ph}" ${x}>`;
const sel=(n,v,o,ph)=>`<select name="${n}"><option value="">${ph}</option>${o.map(x=>{const[a,b]=Array.isArray(x)?x:[x,x];return`<option value="${a}"${String(v[n])===String(a)?' selected':''}>${b}</option>`}).join('')}</select>`;
const fld=(n,l,e,h,c='')=>`<label class="${c}">${l} *${h}<small class="err">${e[n]?esc(e[n]):''}</small></label>`;
const courseOpts=COURSES.map(c=>[c,CNAME[c]||c]);

/* views */
function vBooks(){
  const t=f.title.trim().toLowerCase();
  const list=books.filter(b=>b.title.toLowerCase().includes(t)&&(!f.course||b.course===f.course)&&(!f.sem||b.semester==f.sem)).sort((a,b)=>b.id-a.id);
  return`<section class="hero"><div>
   <p class="eyebrow">YOUR CAMPUS. YOUR BOOK COMMUNITY.</p>
   <h1>Good books deserve<br><span>a second chapter.</span></h1>
   <p class="muted">Buy, sell, rent or exchange academic books with students in your campus community.</p>
   <div class="row"><a class="btn" href="#books" id="explore">Explore books</a><a class="btn light" href="#sell">List a book +</a></div>
   <div class="stats"><span>♻ Save money</span><span>📚 Reuse books</span><span>🎓 Help students</span></div></div>
   <div class="art"><div class="stack"><div class="b c0">LEARN<br>EVERY DAY</div><div class="b c1">IDEAS<br>IN MOTION</div><div class="b c2">YOUR NEXT<br>CHAPTER</div></div></div></section>
  <section id="book-list">
   <div class="sh"><div><p class="eyebrow">THE CAMPUS SHELF</p><h2>Find your next book</h2><p class="muted small">Affordable reads, shared by students like you.</p></div><a href="#sell" style="color:var(--brand-d);font-weight:600">Have a book to share? →</a></div>
   <form class="search" id="sf">
    <input name="title" placeholder="Search by book title..." value="${esc(f.title)}">
    <select name="course"><option value="">All courses</option>${courseOpts.map(([a,b])=>`<option value="${a}"${f.course===a?' selected':''}>${b}</option>`).join('')}</select>
    <select name="sem"><option value="">All semesters</option>${SEMS.map(s=>`<option value="${s}"${f.sem==s?' selected':''}>Semester ${s}</option>`).join('')}</select>
    <button class="btn" type="submit">Search</button></form>
   ${list.length?`<div class="grid">${list.map((b,i)=>`<article class="card"><div class="cover c${i%4}"><span class="tag">${esc(b.listingType.toUpperCase())}</span><div class="ct">${esc(b.title)}</div><div class="ca">${esc(b.author)}</div></div>
    <div class="info"><div class="meta"><span>${esc(b.course)}</span><span>Semester ${b.semester}</span></div><h3>${esc(b.title)}</h3>
    <p class="muted small">${esc(b.author)}</p><p class="muted small">${esc(b.college)} · ${esc(b.bookCondition)}</p>
    <div class="bottom"><strong>${price(b)}</strong><button class="ib${cart.includes(b.id)?' in':''}" data-add="${b.id}" title="Add to selected books">${cart.includes(b.id)?'✓':'＋'}</button></div></div></article>`).join('')}</div>`
   :`<div class="empty"><div class="ic">📚</div><h3>No books found yet</h3><p class="muted">Try another search, or be the first to list a book.</p><a class="btn" href="#sell">List a book</a></div>`}
  </section>
  <section class="banner"><div><p class="eyebrow" style="color:var(--brand)">CAN’T FIND WHAT YOU NEED?</p><h2>Your next textbook might be on someone else’s shelf.</h2><p class="small" style="opacity:.8">Tell the community what you are looking for.</p></div><a class="btn" href="#need-book">Request a book →</a></section>`;
}
function vSell(v={},e={}){
  return`<a class="back" href="#books">← Back to books</a><p class="eyebrow">GIVE YOUR BOOK A NEW HOME</p><h1>List a book</h1><p class="muted">Fill in the details so another student can find it.</p>
  <form class="form" id="sellf" novalidate><div class="fg">
  ${fld('title','Book title',e,inp('title',v,'e.g. Java: The Complete Reference'),'full')}
  ${fld('author','Author',e,inp('author',v,'Author name'))}
  ${fld('course','Course',e,sel('course',v,courseOpts,'Choose course'))}
  ${fld('semester','Semester',e,sel('semester',v,SEMS,'Choose semester'))}
  ${fld('college','College',e,inp('college',v,'Your college name'))}
  ${fld('price','Price in ₹',e,inp('price',v,'e.g. 250 (0 for exchange)','number','min="0" step="0.01"'))}
  ${fld('bookCondition','Book condition',e,sel('bookCondition',v,CONDS,'Choose condition'))}
  ${fld('listingType','Listing type',e,sel('listingType',v,TYPES,'Choose listing type'))}
  ${fld('sellerContact','Seller contact',e,inp('sellerContact',v,'College email or contact number'),'full')}
  </div><p class="note">For this college demo, use test contact details rather than publishing anyone’s private number.</p>
  <button class="btn wide" type="submit">Publish book listing →</button></form>`;
}
function vNeed(v={},e={}){
  return`<a class="back" href="#books">← Back to books</a><p class="eyebrow">THE COMMUNITY CAN HELP</p><h1>Need a book?</h1><p class="muted">Tell us which book you are searching for.</p>
  <form class="form" id="needf" novalidate><div class="fg">
  ${fld('title','Book title',e,inp('title',v,'Enter the title you need'),'full')}
  ${fld('course','Course',e,sel('course',v,courseOpts,'Choose course'))}
  ${fld('semester','Semester',e,sel('semester',v,SEMS,'Choose semester'))}
  ${fld('college','College',e,inp('college',v,'Your college name'),'full')}
  ${fld('contact','Your contact',e,inp('contact',v,'College email or contact number'),'full')}
  </div><button class="btn wide" type="submit">Submit book request →</button></form>`;
}
function vCart(){
  const items=cart.map(id=>books.find(b=>b.id===id)).filter(Boolean);
  return`<a class="back" href="#books">← Continue exploring</a><p class="eyebrow">YOUR SHORTLIST</p><h1>Selected books</h1><p class="muted">Keep track of books you want to ask about.</p>
  ${items.length?items.map(b=>`<article class="item"><div class="ic">📘</div><div class="d"><h3>${esc(b.title)}</h3><p class="muted small">${esc(b.author)} · ${esc(b.college)}</p><p class="muted small">${esc(b.listingType)} · ${esc(b.bookCondition)}</p><p class="small"><strong>Contact seller:</strong> ${esc(b.sellerContact)}</p></div><strong>${price(b)}</strong><button class="rm" data-rm="${b.id}">Remove</button></article>`).join('')+`<div class="demo"><strong>Demo note:</strong> This is a shortlist only. Contact the seller directly to discuss availability. No payment is collected by this website.</div>`
  :`<div class="empty"><div class="ic">🛒</div><h3>No selected books yet</h3><p class="muted">Add books from the home page to see them here.</p><a class="btn" href="#books">Explore books</a></div>`}`;
}
function vReqs(){
  return`<a class="back" href="#books">← Back to books</a><p class="eyebrow">THE COMMUNITY WISHLIST</p><h1>Book requests</h1><p class="muted">Have one of these? Contact the student directly.</p>
  ${reqs.length?[...reqs].reverse().map(r=>`<article class="item"><div class="ic">🔎</div><div class="d"><h3>${esc(r.title)}</h3><p class="muted small">${esc(r.course)} · Semester ${r.semester} · ${esc(r.college)}</p><p class="small"><strong>Contact:</strong> ${esc(r.contact)}</p></div></article>`).join('')
  :`<div class="empty"><div class="ic">📭</div><h3>No requests yet</h3><p class="muted">Be the first to ask for a book.</p><a class="btn" href="#need-book">Request a book</a></div>`}`;
}

/* validation */
function check(d,rules){const e={};for(const[k,l,max]of rules){const v=(d[k]||'').trim();if(!v)e[k]='Please enter '+l+'.';else if(max&&v.length>max)e[k]='Too long (max '+max+').'}return e}
function semOk(d,e){if(!e.semester){const s=+d.semester;if(!(s>=1&&s<=8))e.semester='Semester must be 1 to 8.'}}
function formData(form){const o={};new FormData(form).forEach((v,k)=>o[k]=String(v));return o}

function onSell(form){
  const d=formData(form);
  const e=check(d,[['title','the book title',150],['author','the author',120],['course','the course'],['semester','the semester'],['college','your college',150],['price','a price. Use 0 for an exchange listing'],['bookCondition','the book condition'],['listingType','a listing type'],['sellerContact','seller contact details',120]]);
  semOk(d,e);
  if(!e.course&&!COURSES.includes(d.course))e.course='Invalid course.';
  if(!e.bookCondition&&!CONDS.includes(d.bookCondition))e.bookCondition='Invalid book condition.';
  if(!e.listingType&&!TYPES.includes(d.listingType))e.listingType='Invalid listing type.';
  let p=parseFloat(d.price);
  if(!e.price){if(isNaN(p)||p<0)e.price='Price cannot be negative.';else if(p>100000)e.price='Price is too high.';
    else if(d.listingType!=='Exchange'&&!e.listingType&&p<=0)e.price='Sale and rental listings need a price above 0.'}
  if(Object.keys(e).length){$('#app').innerHTML=vSell(d,e);bind();return}
  if(d.listingType==='Exchange')p=0;
  const id=books.reduce((m,b)=>Math.max(m,b.id),0)+1;
  books.push({id,title:d.title.trim(),author:d.author.trim(),course:d.course,semester:+d.semester,college:d.college.trim(),price:p,bookCondition:d.bookCondition,listingType:d.listingType,sellerContact:d.sellerContact.trim()});
  save('bl_books',books);toast('Your book listing was published!');f={title:'',course:'',sem:''};go('books');
}
function onNeed(form){
  const d=formData(form);
  const e=check(d,[['title','the book title',150],['course','your course',100],['semester','the semester'],['college','your college',150],['contact','your contact details',120]]);
  semOk(d,e);
  if(Object.keys(e).length){$('#app').innerHTML=vNeed(d,e);bind();return}
  reqs.push({title:d.title.trim(),course:d.course.trim(),semester:+d.semester,college:d.college.trim(),contact:d.contact.trim()});
  save('bl_reqs',reqs);toast('Your book request was saved. Sellers can see it on the Requests page.');$('#app').innerHTML=vNeed();bind();
}

/* wiring */
function bind(){
  const app=$('#app');
  const sf=$('#sf');if(sf)sf.onsubmit=ev=>{ev.preventDefault();const d=formData(sf);f={title:d.title,course:d.course,sem:d.sem};render()};
  const ex=$('#explore');if(ex)ex.onclick=ev=>{ev.preventDefault();$('#book-list').scrollIntoView({behavior:'smooth'})};
  const sl=$('#sellf');if(sl)sl.onsubmit=ev=>{ev.preventDefault();onSell(sl)};
  const nf=$('#needf');if(nf)nf.onsubmit=ev=>{ev.preventDefault();onNeed(nf)};
  app.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
    const id=+b.dataset.add;
    if(cart.includes(id)){toast('Already in your selected books.');return}
    cart.push(id);save('bl_cart',cart);b.classList.add('in');b.textContent='✓';nav('books');toast('Book added to your selected books.')});
  app.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i!==+b.dataset.rm);save('bl_cart',cart);render()});
}
function render(){
  const r=location.hash.slice(1)||'books';
  const views={books:vBooks,sell:()=>vSell(),'need-book':()=>vNeed(),cart:vCart,requests:vReqs};
  const route=views[r]?r:'books';
  $('#app').innerHTML=views[route]();
  nav(route);bind();
  if(!(route==='books'&&f.title+f.course+f.sem!==''))window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);
render();
