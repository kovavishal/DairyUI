import {NgModule} from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import{MatProgressBarModule} from'@angular/material/progress-bar';
import{MatInputModule}from'@angular/material/input';

@NgModule({
  exports: [
    CdkTableModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    
  ]
})
export class MaterialModule {}