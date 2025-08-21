import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
  if (!url) return res.status(400).json({ error: 'URL wajib diisi' });

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      // ⬇️ gunakan chrome-headless-shell (sudah include libnss3)
      executablePath: await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-headless-shell-119.0.0-linux64.zip'
      ),
      headless: 'shell',          // headless-shell mode
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 18000 });
    const dest = await page.evaluate(() => document.location.href);
    res.json({ destination: dest });
  } catch (e) {
    console.error('[ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
}
