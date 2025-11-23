import { expect } from '@playwright/test'

import { sidebarSignin } from './common'
import { test } from './helpers'

test('shows support link', async ({ page, sidebar }) => {
    await sidebarSignin(page, sidebar)

    // Check it's in settings quickpick

    const statusBarButton = page.getByRole('button', { name: 'cody-logo-heavy, Cody Settings' })
    await statusBarButton.click()

    const input = page.getByPlaceholder('Choose an option')
    await input.fill('support')

    const supportItem = page.getByLabel('question  Cody Support')
    expect(supportItem).toBeVisible()
})
