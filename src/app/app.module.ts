import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VideoEditComponent } from './features/video-edit/video-edit.component';
import { VideoUploadComponent } from './features/video-upload/video-upload.component';
import { TagModule } from './shared/components/tag/tag.module';
import { TagEditorModule } from './shared/components/tag-editor/tag-editor.module';
import { LoginComponent } from './features/login/login.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from './shared/components/loader/loader.module';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { IconSelectorModule } from './shared/components/icon-selector/icon-selector.module';
import { DragModule } from './shared/drag/drag.module';
import { ModalModule } from './_modal';
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AppComponent,
    VideoEditComponent,
    VideoUploadComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DragModule,
    TagModule,
    TagEditorModule,
    FormsModule,
    LoaderModule,
    ModalModule,
    IconSelectorModule,
    DragDropModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
