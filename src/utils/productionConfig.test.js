import { expect, test } from "vitest";
import { inspectFrontendProduction } from "../../scripts/checkProduction.mjs";
const valid = {VITE_API_URL: "https://backend.up.railway.app/api", VITE_SITE_URL: "https://yayasan.test", VITE_DEMO_MODE: "false"};
test("release configuration requires public HTTPS URLs and excludes secrets from VITE variables", () => {
  expect(inspectFrontendProduction(valid).errors).toEqual([]);
  for (const override of [{VITE_API_URL: "http://localhost:3000/api"}, {VITE_API_URL: "https://backend.test"}, {VITE_SITE_URL: "https://site.test/reset"}, {VITE_DEMO_MODE: "true"}, {VITE_RESEND_API_KEY: "test-only"}, {VITE_SITE_URL: "https://your-verified-domain.example"}]) {
    expect(inspectFrontendProduction({...valid, ...override}).errors.length).toBeGreaterThan(0);
  }
});
