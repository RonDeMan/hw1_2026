import { test, expect } from '@playwright/test';

test.describe('Notes CRUD operations', () => {

  test.beforeEach(async ({ page, request }) => {
    const username = `test_user_${Date.now()}_${Math.random()}`;
    const password = 'password123';
    
    // Register user
    await request.post('http://localhost:3001/users', {
      data: {
        username,
        name: 'Test User',
        password,
        email: 'test@example.com'
      }
    });

    // Log in
    await page.goto('/login');
    await page.locator('[data-testid="login_form_username"]').fill(username);
    await page.locator('[data-testid="login_form_password"]').fill(password);
    await page.locator('[data-testid="login_form_login"]').click();
    
    // Wait until we reach the home page and can see the add note button
    await expect(page.getByRole('button', { name: 'Add New Note' })).toBeVisible();
    
    // Wait for the initial notes fetch to complete to prevent race conditions with optimistic UI updates
    await expect(page.locator('text="Loading notes…"')).not.toBeVisible();
  });

  test('Create a note', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Note' }).click();
    
    const uniqueText = `Test Create Note Content ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(uniqueText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const newNoteLocator = page.locator('.note').filter({ hasText: uniqueText });
    await expect(newNoteLocator).toHaveCount(1);
    
    const newNote = newNoteLocator.first();
    const noteId = await newNote.getAttribute('data-testid');
    if (noteId) {
      await page.locator(`[data-testid="delete-${noteId}"]`).click();
      await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
    }
  });

  test('Read notes', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const tempText = `Temp Read Note ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(tempText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const countLocator = page.locator('.note').filter({ hasText: tempText });
    await expect(countLocator).toHaveCount(1);

    const tempNote = page.locator('.note', { hasText: tempText }).first();
    const noteId = await tempNote.getAttribute('data-testid');
    if (noteId) {
      await page.locator(`[data-testid="delete-${noteId}"]`).click();
      await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
    }
  });

  test('Update a note', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const tempText = `Temp Note For Update ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(tempText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const tempNoteLocator = page.locator('.note').filter({ hasText: tempText });
    await expect(tempNoteLocator).toHaveCount(1);
    
    const tempNote = tempNoteLocator.first();
    const noteId = await tempNote.getAttribute('data-testid');
    if (!noteId || noteId === '0') throw new Error(`Note ID is invalid: ${noteId}`);

    const updatedText = `Updated Note Content ${Date.now()}`;
    await page.locator(`[data-testid="edit-${noteId}"]`).click();
    await page.locator(`[data-testid="text_input-${noteId}"]`).fill(updatedText);
    await page.locator(`[data-testid="text_input_save-${noteId}"]`).click();
    
    const updatedNoteLocator = page.locator('.note').filter({ hasText: updatedText });
    await expect(updatedNoteLocator).toHaveCount(1);
    await expect(page.locator('.notification-area')).toContainText(`Updated note ${noteId}`);

    await page.locator(`[data-testid="delete-${noteId}"]`).click();
    await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
  });

  test('Delete a note', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const deleteText = `Temp Note For Delete ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(deleteText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const tempNoteLocator = page.locator('.note').filter({ hasText: deleteText });
    await expect(tempNoteLocator).toHaveCount(1);
    
    const tempNote = tempNoteLocator.first();
    const noteId = await tempNote.getAttribute('data-testid');
    if (!noteId || noteId === '0') throw new Error(`Note ID is invalid: ${noteId}`);

    await page.locator(`[data-testid="delete-${noteId}"]`).click();
    
    await expect(page.locator('.notification-area')).toContainText(`Deleted note ${noteId}`);
    
    await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
  });

  test('AI assistant flow', async ({ page }) => {
    test.setTimeout(90000); // 90 seconds timeout for AI test

    await page.getByRole('button', { name: 'Add New Note' }).click();

    await page.locator('[data-testid="help_me_write"]').click();
    await page.locator('[data-testid="help_me_write_prompt"]').fill('Say hello!');
    await page.locator('[data-testid="help_me_write_submit"]').click();

    const textarea = page.locator('[data-testid="text_input-0"]');
    await expect(textarea).not.toHaveValue('', { timeout: 60000 });
  });
});
