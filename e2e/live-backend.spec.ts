import { randomBytes } from 'node:crypto'
import { expect, test } from '@playwright/test'

// Explicit opt-in: requires the real backend, MySQL and Redis. Creates one ordinary user.
// Use a disposable database or remove only LIVE_TEST_ACCOUNT after the run.
test('real backend: list, registration, browser login, reload and logout', async ({ page }, testInfo) => {
  test.skip(process.env.RUN_LIVE_E2E !== 'true', 'Real backend validation is opt-in')
  const account = process.env.LIVE_TEST_ACCOUNT
  expect(account, 'Set a unique LIVE_TEST_ACCOUNT; never reuse a business account').toMatch(
    /^chapter6check[a-z0-9]+$/,
  )
  const password = randomBytes(18).toString('hex')

  const anonymous = await page.request.get('/api/user/get/login')
  expect((await anonymous.json()).code).toBe(40100)
  const list = await page.request.post('/api/picture/list/page/vo', {
    data: { current: 1, pageSize: 12 },
  })
  const result = await list.json()
  expect(result.code).toBe(0)
  expect(result.data.records.length).toBeLessThanOrEqual(12)
  const repeat = await page.request.post('/api/picture/list/page/vo', {
    data: { current: 1, pageSize: 12 },
  })
  expect((await repeat.json()).data).toEqual(result.data)
  const invalid = await page.request.post('/api/picture/list/page/vo', {
    data: { pageSize: 0 },
  })
  expect((await invalid.json()).code).toBe(40000)

  const registration = await page.request.post('/api/user/register', {
    data: { userAccount: account, userPassword: password, checkPassword: password },
  })
  const registered = await registration.json()
  expect(registered.code).toBe(0)
  await testInfo.attach('created-test-account', {
    body: JSON.stringify({ account, id: registered.data, publicTotal: result.data.total }),
    contentType: 'application/json',
  })

  try {
    await page.goto('/user/login')
    await page.getByPlaceholder('请输入账号').fill(account!)
    await page.getByPlaceholder('请输入密码').fill(password)
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('#globalHeader .user-name')).toBeVisible()
    const loggedIn = await page.request.get('/api/user/get/login')
    expect((await loggedIn.json()).data.id).toBe(registered.data)
    expect((await page.context().cookies()).some((cookie) => cookie.name === 'JSESSIONID')).toBe(true)

    await page.reload()
    await expect(page.locator('#globalHeader .user-name')).toBeVisible()
    const own = await page.request.post('/api/picture/my/list/page/vo', {
      data: { current: 1, pageSize: 12 },
    })
    const ownResult = await own.json()
    expect(ownResult.code).toBe(0)
    expect(Number(ownResult.data.total)).toBe(0)

    await page.locator('#globalHeader .user-info').hover()
    await page.getByText('退出登录', { exact: true }).click()
    await expect(page).toHaveURL('/user/login')
    const loggedOut = await page.request.get('/api/user/get/login')
    expect((await loggedOut.json()).code).toBe(40100)
  } finally {
    // Invalidate the test session even if a browser assertion failed. DB removal is operator-owned.
    await page.request.post('/api/user/logout')
  }
})
