import { test, expect } from '@playwright/test'

test.describe('Notes pagination app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders notes list and pagination controls', async ({ page }) => {
    await expect(page.locator('.note')).toHaveCount(10)

    await expect(page.locator('button[name="first"]')).toBeVisible()
    await expect(page.locator('button[name="previous"]')).toBeVisible()
    await expect(page.locator('button[name="next"]')).toBeVisible()
    await expect(page.locator('button[name="last"]')).toBeVisible()

    await expect(page.locator('button[name="page-1"]').first()).toBeDisabled()
    await expect(page.locator('button[name="page-2"]').first()).toBeVisible()
  })

  test('navigates pages and updates active state', async ({ page }) => {
    const next = page.locator('button[name="next"]')
    await next.click()

    await expect(page.locator('button[name="page-2"]').first()).toBeDisabled()
    await expect(page.locator('button[name="page-1"]').first()).not.toBeDisabled()

    const last = page.locator('button[name="last"]')
    await last.click()

    await expect(page.locator('button[name="page-10"]').first()).toBeDisabled()
  })

  test('displays note card with id and content structure', async ({ page }) => {
    const firstNote = page.locator('.note').first()
    const id = await firstNote.getAttribute('id')

    expect(id).toBeTruthy()
    await expect(firstNote.locator('h2')).toBeVisible()
    await expect(firstNote.locator('small')).toContainText('By')
  })
})
