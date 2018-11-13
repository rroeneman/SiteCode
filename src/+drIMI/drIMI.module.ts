import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

//Component stuff
import { ResultDrIMIComponent } from './drIMI.component';

@NgModule({ 
  declarations: [ ResultDrIMIComponent],
  imports: [  CommonModule,
              FlexLayoutModule,
              MatButtonModule,
            ],
  providers:[],
  entryComponents: [ResultDrIMIComponent],
  exports:[ ResultDrIMIComponent],
})
export class DRIMIModule {
}