import { CanDeactivateFn } from '@angular/router';
import { ProfilePage } from '../pages/profile-page/profile-page';

export const unsavedChangesGuard: CanDeactivateFn<ProfilePage> = (component) => {
  if (!component.hasUnsavedChanges()) return true;
  return window.confirm('You have unsaved changes. Leave this page without saving?');
};
