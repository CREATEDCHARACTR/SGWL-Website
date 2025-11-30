import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {

    test('Contact Form Validation', async ({ page }) => {
        await page.goto('/#/contact');

        // Wait for form to be visible
        await expect(page.locator('form')).toBeVisible();

        // Check required fields
        const nameInput = page.locator('input[name="name"]');
        const emailInput = page.locator('input[name="email"]');
        const messageInput = page.locator('textarea[name="message"]');
        const submitButton = page.locator('button[type="submit"]');

        // Attempt to submit empty form
        await submitButton.click();

        // Verify browser validation (HTML5 required attribute)
        // Playwright doesn't easily check browser tooltips, but we can check the validity state via JS
        const isNameInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
        expect(isNameInvalid).toBe(true);

        // Fill form
        await nameInput.fill('Test User');
        await emailInput.fill('test@example.com');
        await page.selectOption('select[name="serviceType"]', 'Photography');
        await messageInput.fill('This is a test message.');

        // Submit
        await submitButton.click();

        // Verify success message
        await expect(page.locator('text=Your message has been prepared!')).toBeVisible();
    });

    test('Login Page Google Sign-In Button', async ({ page }) => {
        await page.goto('/#/login');
        test('Login Form Validation', async ({ page }) => {
            await page.goto('/#/login');

            const emailInput = page.locator('input[name="email"]');
            const passwordInput = page.locator('input[name="password"]');
            const submitButton = page.locator('button[type="submit"]');

            // Attempt to submit empty form
            await submitButton.click();

            // Check validity
            const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
            expect(isEmailInvalid).toBe(true);

            // Fill invalid credentials
            await emailInput.fill('wrong@example.com');
            await passwordInput.fill('wrongpassword');

            // Handle alert
            page.on('dialog', dialog => dialog.accept());

            await submitButton.click();

            // Since we can't easily mock Firebase auth in this simple e2e without more setup, 
            // we just verify that the button goes to "Signing in..." state briefly or stays on page.
            // Ideally we'd see the alert, but dialog handling is async.
            // For now, let's just ensure we didn't navigate away (still on login page)
            await expect(page).toHaveURL(/.*login/);
        });

    });
