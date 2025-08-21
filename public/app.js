const api = '/api/bypass?url=';
const url = document.getElementById('url');
const btn = document.getElementById('btn');
const loader = document.getElementById('loader');
const res = document.getElementById('res');
const dest = document.getElementById('dest');
const go = document.getElementById('go');

btn.onclick = async () => {
  const u = url.value.trim();
  if(!u) return alert('Masukkan URL dulu!');

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
    }else throw new Error(j.error);
  } catch(e) {
    dest.textContent = '❌ ' + e.message;
    res.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
    btn.disabled = false;
  }
};
url.addEventListener('keyup', e => e.key==='Enter' && btn.click());
