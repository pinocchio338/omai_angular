import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { LoaderComponent } from './loader/loader.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AlertComponent } from './alert/alert.component';
import { PhoneMaskDirective } from './phone-mask.directive';
import { AlphabetOnlyDirective } from './alphabet-only.directive';
import { RcaComponent } from '../rca/rca/rca.component';
import { UseruploadComponent } from './userupload/userupload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ServerErrorPopupComponent } from './server-error-popup/server-error-popup.component';
import { ImagecropperComponent } from './imagecropper/imagecropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
@NgModule({
  declarations: [
    LoaderComponent,
    RcaComponent,
    ToolbarComponent,
    AlertComponent,
    PhoneMaskDirective,
    AlphabetOnlyDirective,
    UseruploadComponent,
    DateAgoPipe,
    ServerErrorPopupComponent,
    ImagecropperComponent,
    ChangepasswordComponent,
  ],
  imports: [
    CommonModule,
    MaterialmoduleModule,
    FormsModule, ReactiveFormsModule,
    ImageCropperModule
  ],
  exports: [
    RcaComponent,
    LoaderComponent,
    ToolbarComponent,
    PhoneMaskDirective,
    AlphabetOnlyDirective,
    ServerErrorPopupComponent
  ]
})
export class SharedModule { }
