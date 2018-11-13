import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

//Component stuff
import { ResultDsOfflineComponent } from './dsOffline.component';

@NgModule({ 
  declarations: [ ResultDsOfflineComponent],
  imports: [  CommonModule,
              FlexLayoutModule,
              MatButtonModule,
            ],
  providers:[],
  entryComponents: [ResultDsOfflineComponent],
  exports:[ ResultDsOfflineComponent],
})
export class DsOfflineModule {
}