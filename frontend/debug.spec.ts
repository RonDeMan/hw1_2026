import { test, expect } from '@playwright/test';

test('debug add note', async ({ page, request }) => {
  const username = `test_user_debug_${Date.now()}`;
  const password = 'password123';
  await request.post('http://localhost:3001/users', { data: { username, name: 'Test User', password, email: 'test@example.com' }});
  
  await page.goto('/login');
  await page.locator('[data-testid="login_form_username"]').fill(username);
  await page.locator('[data-testid="login_form_password"]').fill(password);
  await page.locator('[data-testid="login_form_login"]').click();
  
  await expect(page.getByRole('button', { name: 'Add New Note' })).toBeVisible();
  
  await page.getByRole('button', { name: 'Add New Note' }).click();
  const uniqueText = `Test Create Note Content ${Date.now()}`;
  await page.locator('[data-testid="text_input-0"]').fill(uniqueText);
  await page.locator('[data-testid="text_input_save-0"]').click();
  
  await expect(page.locator('.notification-area')).toContainText('Added note');
  
  const html = await page.content();
  console.log("HTML:", html.substring(html.indexOf('<main'), html.indexOf('</main>') + 7));
});