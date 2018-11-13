import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';

//theming
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

//Component stuff
import { ResultDrmethodsComponent, FPotherValidator } from './drmethods.component';
import { GoogleChartDirective } from './angular2-google-chart.directive';

@NgModule({ 
  declarations: [ ResultDrmethodsComponent, FPotherValidator, GoogleChartDirective],
  imports: [  CommonModule,
              MatFormFieldModule, 
              MatButtonModule,
              FlexLayoutModule,
              FormsModule,
              ReactiveFormsModule,
              MatSliderModule,
              MatInputModule,
            ],
  providers:[],
  entryComponents: [ResultDrmethodsComponent],
  exports:[ ResultDrmethodsComponent],
})
export class DRMethodsModule {
}