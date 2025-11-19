import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://100.108.12.61:3000');
  await page.getByRole('link', { name: 'Visit Us' }).click();
  await page.getByLabel('Primary').getByRole('link', { name: 'About Us' }).click();
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await page.getByRole('link', { name: '(573) 677-6418', exact: true }).click();
  await page.getByRole('button', { name: 'Where is Route 66 Hemp' }).click();
  await page.getByRole('button', { name: 'What are your store hours in' }).click();
  await page.getByRole('button', { name: 'Do you serve customers from' }).click();
});