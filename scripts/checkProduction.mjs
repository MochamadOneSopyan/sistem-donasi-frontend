import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

export function inspectFrontendProduction(env) {
  const errors = [];
  for (const [key, api] of [['VITE_API_URL', true], ['VITE_SITE_URL', false]]) {
    try {
      const url = new URL(env[key]);
      if (url.protocol !== 'https:' || /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(url.hostname) || /\.example$/.test(url.hostname) || url.username || url.password || url.search || url.hash) throw new Error();
      if (api ? !url.pathname.endsWith('/api') : url.pathname !== '/') throw new Error();
    } catch { errors.push(`${key} wajib URL HTTPS produksi ${api ? 'berakhiran /api' : 'tanpa path'}, bukan localhost atau placeholder.`); }
  }
  if (env.VITE_DEMO_MODE !== 'false') errors.push('VITE_DEMO_MODE harus false untuk rilis produksi.');
  for (const key of Object.keys(env)) {
    if (/^VITE_.*(?:SECRET|PASSWORD|SMTP_PASS|RESEND_API_KEY|CLOUDINARY_API_KEY|DATABASE_URL)/i.test(key)) errors.push(`${key} berisi nama konfigurasi rahasia; pindahkan ke backend.`);
  }
  return {status: errors.length ? 'blocked' : 'configuration-passed', errors, productionVerified: false};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = inspectFrontendProduction(loadEnv('production', process.cwd(), 'VITE_'));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.errors.length) process.exitCode = 1;
}
