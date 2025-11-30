import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsiveness', () => {
    const pages = [
        '/',
        '/#/about',
        '/#/contact',
        '/#/portfolio'
    ];

    for (const path of pages) {
        test(`Check for horizontal overflow on ${path}`, async ({ page }) => {
            await page.goto(path);

            // Wait for content to load
            await page.waitForLoadState('load');

            // Check for horizontal overflow
            const overflow = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });

            expect(overflow, `Horizontal overflow detected on ${path}`).toBe(false);
        });
    }
});
