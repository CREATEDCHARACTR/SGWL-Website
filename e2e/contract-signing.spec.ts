// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Contract Signing Flow', () => {

  // Before each test, navigate to the signer portal with a mock token.
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/sign/mock-token');
  });

  test('should display and accept the E-Sign consent', async ({ page }) => {
    // 1. Verify the consent screen is visible.
    await expect(page.getByRole('heading', { name: 'Electronic Record and Signature Disclosure' })).toBeVisible();
    await expect(page.getByText('By checking the box below, you consent to electronically receive')).toBeVisible();

    // 2. Click the consent checkbox and continue.
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 3. Verify the signing document is now visible.
    await expect(page.getByRole('heading', { name: 'Photography Services Agreement' })).toBeVisible();
  });

  test('should allow a user to draw a signature and complete the contract', async ({ page }) => {
    // Go through consent step
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 1. Verify initial state of the field navigator.
    await expect(page.getByText('0 of 2 required fields completed')).toBeVisible();

    // 2. Click the signature box to open the canvas modal.
    await page.getByText('Click to signature').click();
    await expect(page.getByRole('heading', { name: 'Draw Your Signature' })).toBeVisible();

    // 3. Simulate drawing on the canvas.
    const canvas = page.locator('canvas');
    await canvas.dragTo(canvas, {
        sourcePosition: { x: 50, y: 50 },
        targetPosition: { x: 150, y: 100 },
    });
     await canvas.dragTo(canvas, {
        sourcePosition: { x: 150, y: 100 },
        targetPosition: { x: 250, y: 50 },
    });


    // 4. Apply the signature.
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByRole('heading', { name: 'Draw Your Signature' })).not.toBeVisible();
    await expect(page.locator('img[alt="Signature"]')).toHaveCount(2); // One for provider, one for client

    // 5. Check the confirmation checkbox.
    await page.getByLabel('I agree').check();
    
    // 6. Verify the navigator is complete and shows "Finish".
    await expect(page.getByText('2 of 2 required fields completed')).toBeVisible();
    const finishButton = page.getByRole('button', { name: 'Finish' });
    await expect(finishButton).toBeEnabled();

    // 7. Finish signing.
    await finishButton.click();

    // 8. Verify the completion screen is displayed.
    await expect(page.getByRole('heading', { name: 'Contract Completed!' })).toBeVisible();

    // 9. Verify the Download PDF button is present on the completion screen.
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
  });
});