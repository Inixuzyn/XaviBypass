import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
  if (!url) return res.status(400).json({ error: 'URL wajib diisi' });

  const browser = await puppeteer.launch({
    args: [...chromium.args, '--disable-dev-shm-usage', '--no-sandbox'],
    executablePath: await chromium.executablePath(), // tanpa parameter tambahan
    headless: 'shell',
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 18000 });
    const dest = await page.evaluate(() => document.location.href);
    res.json({ destination: dest });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await browser.close();
  }
}
