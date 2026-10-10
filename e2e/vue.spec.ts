import { test, expect } from '@playwright/test'

test('renders the public picture home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('gjx云图库')).toBeVisible()
  await expect(page.getByPlaceholder('搜索图片')).toBeVisible()
})
