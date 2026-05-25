import { test, expect } from '@playwright/test';

test.describe('Notes CRUD operations', () => {

  test('Create a note', async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load notes
    await expect(page.locator('.note').first()).toBeVisible();

    await page.getByRole('button', { name: 'Add New Note' }).click();
    
    const uniqueText = `Test Create Note Content ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(uniqueText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    // Notification check to ensure save completes
    await expect(page.locator('.notification-area')).toContainText('Added note');

    // Find the real note, excluding the temporary creation form (data-testid="0")
    const newNote = page.locator('.note:not([data-testid="0"])', { hasText: uniqueText }).first();
    await expect(newNote).toBeVisible();

    // Cleanup: Delete the note we just created so we don't pollute the database
    const noteId = await newNote.getAttribute('data-testid');
    if (noteId) {
      await page.locator(`[data-testid="delete-${noteId}"]`).click();
      await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
    }
  });

  test('Read notes', async ({ page }) => {
    await page.goto('/');
    // Check that notes are loaded and at least one is visible
    await expect(page.locator('.note').first()).toBeVisible();
    const count = await page.locator('.note').count();
    expect(count).toBeGreaterThan(0);
  });

  test('Update a note', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.note').first()).toBeVisible();

    // Create a temporary note specifically for updating
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const tempText = `Temp Note For Update ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(tempText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    // Wait for save
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const tempNote = page.locator('.note:not([data-testid="0"])', { hasText: tempText }).first();
    await expect(tempNote).toBeVisible();
    const noteId = await tempNote.getAttribute('data-testid');
    if (!noteId || noteId === '0') throw new Error(`Note ID is invalid: ${noteId}`);

    // Update the temporary note
    const updatedText = `Updated Note Content ${Date.now()}`;
    await page.locator(`[data-testid="edit-${noteId}"]`).click();
    await page.locator(`[data-testid="text_input-${noteId}"]`).fill(updatedText);
    await page.locator(`[data-testid="text_input_save-${noteId}"]`).click();
    
    const updatedNote = page.locator('.note:not([data-testid="0"])', { hasText: updatedText }).first();
    await expect(updatedNote).toBeVisible();
    await expect(page.locator('.notification-area')).toContainText(`Updated note ${noteId}`);

    // Cleanup: Delete the updated note
    await page.locator(`[data-testid="delete-${noteId}"]`).click();
    await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
  });

  test('Delete a note', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.note').first()).toBeVisible();

    // Create a temporary note specifically for deleting
    await page.getByRole('button', { name: 'Add New Note' }).click();
    const deleteText = `Temp Note For Delete ${Date.now()}`;
    await page.locator('[data-testid="text_input-0"]').fill(deleteText);
    await page.locator('[data-testid="text_input_save-0"]').click();
    
    // Wait for save
    await expect(page.locator('.notification-area')).toContainText('Added note');

    const tempNote = page.locator('.note:not([data-testid="0"])', { hasText: deleteText }).first();
    await expect(tempNote).toBeVisible();
    const noteId = await tempNote.getAttribute('data-testid');
    if (!noteId || noteId === '0') throw new Error(`Note ID is invalid: ${noteId}`);

    // Delete the temporary note
    await page.locator(`[data-testid="delete-${noteId}"]`).click();
    
    // Check notification
    await expect(page.locator('.notification-area')).toContainText(`Deleted note ${noteId}`);
    
    // Check that the specific note is removed from the DOM
    await expect(page.locator(`[data-testid="${noteId}"]`)).toHaveCount(0);
  });
});
