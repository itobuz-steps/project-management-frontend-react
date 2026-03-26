import { expect, test } from '@playwright/test';
import { EditProfilePage } from '../pages/EditProfilePage';
import { mockProfileApis } from '../utils/mockApi';

test.describe('Edit Profile Module', () => {
  // helper: simulate logged-in state
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'token');
    });
  });

  // TC_033 - Valid Profile Update
  test('TC_033 - Valid Profile Update', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.updateUsername('NewUser');
    await profile.uploadImage('tests/assets/sample.png');
    await profile.submit();

    await profile.expectSuccessMessage('Profile updated successfully!');
  });

  // TC_034 - Username Only
  test('TC_034 - Update Username Only', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.updateUsername('OnlyName');
    await profile.submit();

    await profile.expectSuccessMessage('Profile updated successfully!');
  });

  // TC_035 - Image Only
  test('TC_035 - Update Image Only', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.uploadImage('tests/assets/sample.png');
    await profile.submit();

    await profile.expectSuccessMessage('Profile updated successfully!');
  });

  // TC_036 - Empty Username
  test('TC_036 - Empty Username', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);
    await profile.goto();

    await profile.updateUsername('');
    await profile.submit();

    await profile.expectErrorMessage('Username is invalid.');
  });

  // TC_037 - Invalid Image Format
  test('TC_037 - Invalid Image Format', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);
    await profile.goto();

    await profile.uploadImage('tests/assets/sample.txt');

    // No error expected (UI allows only images)
    await profile.expectPreviewChanged();
  });

  // TC_039 - Image Preview
  test('TC_039 - Profile Image Preview', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);
    await profile.goto();

    await profile.uploadImage('tests/assets/sample.png');

    await profile.expectPreviewChanged();
  });

  // TC_040 - Unauthorized
  test('TC_040 - Unauthorized Access', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('access_token');
    });

    await page.goto('/edit-profile');

    await expect(page).toHaveURL(/login/);
  });

  // TC_041 - Replace Old Image
  test('TC_041 - Replace Old Image', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.uploadImage('tests/assets/sample.png');
    await profile.submit();

    await profile.expectSuccessMessage('Profile updated successfully!');
  });

  // TC_042 - Notification Toggle
  test('TC_042 - Update Notification Preferences', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.togglePush();

    await profile.expectSuccessMessage('Notification preference updated');
  });

  // TC_045 - Username Persistence
  test('TC_045 - Username Persistence', async ({ page }) => {
    const profile = new EditProfilePage(page);

    await mockProfileApis(page);

    await profile.goto();

    await profile.updateUsername('PersistUser');
    await Promise.all([
      page.waitForResponse('**/auth/profile'), // wait for PATCH
      profile.submit(),
    ]);

    await page.reload();

    await profile.expectUsernameValue('PersistUser');
  });
});
