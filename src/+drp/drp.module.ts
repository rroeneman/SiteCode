import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'; 

//theming
import { MatDialogModule, MatTabsModule, MatInputModule, MatFormFieldModule, MatSliderModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs'; //gesture support
import {GoogleChartDirective} from './angular2-google-chart.directive';

// App is our top level component
import { DRPComponent } from './drp.component';
import { DialogComponent } from './drp-dialog.component'
import { DCMainComponent, DCDirective, DCDataComponent, DynamicContentService } from './dc.drp-graphs.component';
import { DRPService } from './drpservice';
import { Script } from './drp-scriptloader';
import { LocalStorageModule } from 'angular-2-local-storage';

//Routing
import { RouterModule, Routes } from '@angular/router';
let appRoutes: Routes = [{ path: '', component: DRPComponent}];

@NgModule({
  declarations: [ DRPComponent,
                  DialogComponent,
                  GoogleChartDirective,
                  DCMainComponent,
                  DCDataComponent,
                  DCDirective
                  ],
  imports: [ CommonModule,
             HttpModule,
             MatDialogModule, MatTabsModule,MatInputModule, MatFormFieldModule, MatSliderModule, MatButtonModule, MatSelectModule, MatIconModule,
             FlexLayoutModule,
             FormsModule,
             LocalStorageModule.withConfig({
                prefix: 'llqdrp',
                storageType: 'localStorage'
              }),
             RouterModule.forChild(appRoutes)
             ],
  providers:[ DRPService, DynamicContentService, Script],
  entryComponents: [ DialogComponent, DCMainComponent, DCDataComponent ],
})
export class DRPModule {
}