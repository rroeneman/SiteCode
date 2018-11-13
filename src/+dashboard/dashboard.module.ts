import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';

//theming
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button'
import {MatGridListModule} from '@angular/material/grid-list';

//Dashboard
import { ADSExplainedComponent, DashboardComponent, DRMPrototypesComponent, GeneralPurposeComponent } from './dashboard.component';
import { LocalStorageModule } from 'angular-2-local-storage';

//Routing
import { RouterModule, Routes } from '@angular/router';

let appRoutes: Routes = [
  { path: '', component: DashboardComponent },
    //{ path: 'testdata', component: SurveyComponentTestdata },
  ];

@NgModule({ 
  declarations: [ ADSExplainedComponent, DashboardComponent, DRMPrototypesComponent, GeneralPurposeComponent],
  imports: [  CommonModule,
              MatExpansionModule,
              MatFormFieldModule, 
              MatButtonModule,
              MatGridListModule,
              FlexLayoutModule,
              LocalStorageModule.withConfig({
                prefix: 'llqDashboard',
                storageType: 'localStorage'
              }),
              RouterModule.forChild(appRoutes)
            ],
  providers:[],
  entryComponents: [],
})
export class DashboardModule {
}