import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';

//theming; FORMFIELDS, SLIDER, ETC. KOMT VIA SharedFormModule binnen!!
import { FlexLayoutModule } from '@angular/flex-layout';

//Component stuff
import { ResultDrmethodsComponent, FPotherValidator } from './drmethods.result.component';
import { EntryDrmethodsComponent } from './drmethods.entry.component'; //voor Shared Form: de component waarin alles samenkomt
import { GoogleChartDirective } from './angular2-google-chart.directive';

//Imports from sharedmodule, inclusief veel angular/material modules!!
import { SharedFormModule } from '../+sharedForm/sharedForm.module';
import { SharedFormRawResultsComponent } from '../+sharedForm/sharedForm.rawResults.component';
import { ScriptLoadResolver } from '../+sharedForm/sharedForm.router.service';
import { FormDataLoadResolver } from '../+sharedForm/sharedForm.router.service';

import { RouterModule, Routes } from '@angular/router'; 
let appRoutes: Routes = [{ 
  path: '', component: EntryDrmethodsComponent,
  data: {
    url:'https://www.legallinq.com/Qs/drMethodSelection/', //voor Shared Form: geef url naar datajson
    scripts:["googlechart"], //voor Shared Form: laadt scripts in
    //resultComponent:SharedFormRawResultsComponent, //ruwe resultaten voor testen: stuur result component via de router data
    resultComponent:ResultDrmethodsComponent, //voor Shared Form: stuur result component via de router data
  },
  //canActivate: [AuthGuard], 
  resolve: { FormDataLoadResolver, ScriptLoadResolver } //voor Shared Form: laadt formdata in localstorage, en laad scripts (Google charts, etc)
}];

@NgModule({ 
  declarations: [ ResultDrmethodsComponent, FPotherValidator, GoogleChartDirective, 
                  EntryDrmethodsComponent, //voor Shared Form en antwoord
                ], 
  imports: [  CommonModule,
              FlexLayoutModule,
              RouterModule.forChild(appRoutes),
              SharedFormModule, SharedFormModule.forRoot(), //voor Shared Form en antwoord
            ],
  providers:[],
  entryComponents: [ResultDrmethodsComponent],
})
export class DRMethodsModule {}