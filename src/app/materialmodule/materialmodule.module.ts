import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatTableModule} from '@angular/material/table';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
const MaterialConponents = [
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSelectModule,
  MatGridListModule,
  MatCardModule,
  MatIconModule,
  MatRadioModule,
  MatButtonModule,
  MatDividerModule,
  MatDialogModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatTableModule,
  MatTableExporterModule,
  DragDropModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  PdfViewerModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRippleModule,
  MatPaginatorModule,
  FormsModule,
  MatSnackBarModule,
  MatSlideToggleModule
]

@NgModule({
  declarations: [],
  imports: [
    MaterialConponents,
    CommonModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  exports:[MaterialConponents]
})
export class MaterialmoduleModule { }
