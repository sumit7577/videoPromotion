import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { VideoEditComponent } from './features/video-edit/video-edit.component';
import { VideoUploadComponent } from './features/video-upload/video-upload.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: "", component: VideoUploadComponent, canActivate: [AuthGuard] },
  { path: "edit", component: VideoEditComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
