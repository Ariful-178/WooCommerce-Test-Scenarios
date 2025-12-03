import { test as setup, expect } from '@playwright/test';
import { envConfig } from '../env/env.config';
import * as path from 'path';

const authFile = path.join(__dirname, '../../auth/auth.json');

setup('authenticate user', async ({ page }) => {
  const baseURL = envConfig.getBaseURL();
  const username = envConfig.getUsername();
  const password = envConfig.getPassword();

  console.log(`Authenticating user on: ${baseURL}`);

  // Navigate to WooCommerce SSO login page
  await page.goto('https://woocommerce.com/sso');

  // Step 1: Fill in credentials and click Continue
  await page.locator('input[name="email"], input[type="email"], input[id="usernameOrEmail"]').fill(username);
  await page.locator('input[name="password"], input[type="password"], input[id="password"]').fill(password);
  await page.locator('button[type="submit"]:has-text("Continue")').first().click();

  // Step 2: Wait for WordPress.com auth page and click Log In
  await page.waitForLoadState('networkidle');
  await page.locator('button:has-text("Log In")').first().click();

  // Step 3: Wait for redirect to WooCommerce my-dashboard (actual path, not query param)
  await page.waitForURL((url) => {
    return url.hostname.includes('woocommerce.com') && url.pathname.includes('my-dashboard');
  }, { timeout: 30000 });

  // Wait for page DOM to be ready and cookies to be set
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  console.log(`Current URL after login: ${page.url()}`);

  // Save authentication state
  await page.context().storageState({ path: authFile });

  console.log(`Authentication successful. Storage state saved to: ${authFile}`);
});
