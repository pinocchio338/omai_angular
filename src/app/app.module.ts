import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialmoduleModule } from './materialmodule/materialmodule.module';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from './shared/shared.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { DashboardsComponent } from './dashboards/dashboards/dashboards.component';
// import { ToolbarComponent } from './shared/toolbar/toolbar.component';
// import { LoaderComponent } from './shared/loader/loader.component';
@NgModule({
  declarations: [
    AppComponent,
    // DashboardsComponent,
    // ToolbarComponent,
    // LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialmoduleModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardsModule,
    ImageCropperModule
  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
