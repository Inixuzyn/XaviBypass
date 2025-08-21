import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
  if (!url) return res.status(400).json({ error: 'URL wajib diisi' });

  console.log('[DEBUG] bypass url:', url);

    const browser = await puppeteer.launch({
    args: [...chromium.args, '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(), // <-- tambah await
    headless: chromium.headless,
  });


  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 18000 });
    const dest = await page.evaluate(() => document.location.href);
    console.log('[DEBUG] final url:', dest);
    res.json({ destination: dest });
  } catch (e) {
    console.error('[ERROR]', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    await browser.close();
  }
}
