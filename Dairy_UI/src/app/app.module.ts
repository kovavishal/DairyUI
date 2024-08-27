import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { UserComponent } from './modules/user/user.component';
import { AppComponent } from './app.component';

import { AppOverlayModule } from './overlay/overlay.module';
import { ProgressSpinnerModule } from './progress-spinner/progress-spinner.module';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    AppOverlayModule,
    ProgressSpinnerModule
  ],
  declarations: [AppComponent,
    UserComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
