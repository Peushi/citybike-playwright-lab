const { test, expect } = require('@playwright/test');

// MISSION 3 — Add two realistic tests:
// (a) invalid email gives visible error without a POST to /api/reservations
// (b) a successful reservation; intercept/mock POST /api/reservations and assert
//     the JSON request payload and success message.

test('invalid email blocks reservation', async ({ page }) => {
  let reservationRequests = 0;

  await page.route('**/api/reservations', async (route) => {
    reservationRequests++;
    await route.continue();
  });

  await page.goto('/');

  await page.getByRole('button', { name: 'Reserve at Central Square' }).click();

  await page.locator('#email').fill('invalid-email');
  await page.locator('#confirm').click();

  await expect(page.locator('#email-error')).toBeVisible();
  expect(reservationRequests).toBe(0);
});


test('reservation sends correct payload and confirms booking', async ({ page }) => {
  let requestBody;

  await page.route('**/api/reservations', async (route) => {
    requestBody = route.request().postDataJSON();

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        reservationId: 'CB-DEMO-777'
      })
    });
  });

  await page.goto('/');

  await page.getByRole('button', { name: 'Reserve at Central Square' }).click();

  await page.locator('#email').fill('student@example.com');
  await page.locator('#confirm').click();

  await expect(page.locator('#result')).toContainText('CB-DEMO-777');

  expect(requestBody).toEqual({
    stationId: 'central',
    email: 'student@example.com'
  });
});
