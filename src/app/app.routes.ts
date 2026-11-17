import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { HomePage } from './pages/home-page/home-page';
import { DirectoryPage } from './pages/directory-page/directory-page';
import { StaffPage } from './pages/staff-page/staff-page';
import { StudentDetailPage } from './pages/student-detail-page/student-detail-page';
import { GalleryPage } from './pages/gallery-page/gallery-page';
import { SavedPage } from './pages/saved-page/saved-page';
import { LoginPage } from './pages/login-page/login-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'GIU Yearbook · Class of 2028' },
  { path: 'students', component: DirectoryPage, title: 'Students · GIU Yearbook' },
  { path: 'students/:id', component: StudentDetailPage, title: 'Student · GIU Yearbook' },
  { path: 'staff', component: StaffPage, title: 'Teachers & Staff · GIU Yearbook' },
  { path: 'gallery', component: GalleryPage, title: 'Gallery · GIU Yearbook' },
  { path: 'saved', component: SavedPage, title: 'Saved stories · GIU Yearbook' },
  { path: 'login', component: LoginPage, title: 'Student login · GIU Yearbook' },
  { path: 'profile', component: ProfilePage, canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard], title: 'My profile · GIU Yearbook' },
  { path: '**', component: NotFoundPage, title: 'Page not found · GIU Yearbook' },
];
