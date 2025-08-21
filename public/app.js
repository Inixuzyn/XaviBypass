const api = '/api/bypass?url=';
const url = document.getElementById('url');
const btn = document.getElementById('btn');
const loader = document.getElementById('loader');
const res = document.getElementById('res');
const dest = document.getElementById('dest');
const go = document.getElementById('go');

function toast(msg, err = false){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  t.style = `position:fixed;top:1rem;right:1rem;padding:.8rem 1.2rem;border-radius:8px;color:#fff;background:${err?'var(--err)':'#00b894'}`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

btn.onclick = async () => {
  const u = url.value.trim();
  if(!u) return toast('URL wajib diisi!',true);

  btn.disabled = true;
  loader.classList.remove('hidden');
  res.classList.add('hidden');

  try {
    const r = await fetch(api + encodeURIComponent(u));
    const j = await r.json();
    if(j.destination){
      dest.textContent = j.destination;
      go.href = j.destination;
      res.classList.remove('hidden');
    }else throw new Error(j.error || 'Unknown error');
  } catch(e) {
    toast('❌ ' + e.message,true);
    console.error(e);
  } finally {
    loader.classList.add('hidden');
    btn.disabled = false;
  }
};
url.addEventListener('keyup', e => e.key==='Enter' && btn.click());
