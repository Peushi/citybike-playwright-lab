const { test, expect } = require('@playwright/test');

// MISSION 2 — Add a Playwright test that first FAILS because of BUG-101.
// Behavior required: enabling "Available bikes only" hides Riverside Park (0 bikes)
// and shows exactly three station cards. Fix public/app.js only AFTER the test fails.
test('BUG-101: available-only filter excludes zero-bike stations', async ({ page }) => {
  await page.goto('/');

  // First, check that all four stations are displayed
  await expect(page.getByTestId('station-card')).toHaveCount(4);

  // Enable the available bikes filter
  await page.getByRole('checkbox', { name: 'Available bikes only' }).check();

  // Check that only three stations remain
  await expect(page.getByTestId('station-card')).toHaveCount(3);

  // Check that Riverside Park is no longer displayed
  await expect(
    page.getByRole('heading', { name: 'Riverside Park' })
  ).toHaveCount(0);
});
