import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

//Component stuff
import { ResultformPrototypesComponent } from './formPrototypes.result.component';
import { EntryformPrototypesComponent } from './formPrototypes.entry.component'; //voor Shared Form: de component waarin alles samenkomt

//Imports from sharedmodule, inclusief veel angular/material modules!!
import { SharedFormModule } from '../+sharedForm/sharedForm.module';
import { SharedFormRawResultsComponent } from '../+sharedForm/sharedForm.rawResults.component';
import { ScriptLoadResolver } from '../+sharedForm/sharedForm.router.service';
import { FormDataLoadResolver } from '../+sharedForm/sharedForm.router.service';

import { RouterModule, Routes } from '@angular/router'; 
let appRoutes: Routes = [
  { path: '',  redirectTo: '/404', pathMatch: 'full',}, //alleen partnerschap
  { 
  path: 'RvdRzelftest', component: EntryformPrototypesComponent,
  data: {
    url:'https://www.legallinq.com/Qs/QRvdRzelftest/', //voor Shared Form: geef url naar datajson
    //scripts:["googlechart"], //voor Shared Form: laadt scripts in
    //resultComponent:SharedFormRawResultsComponent, //ruwe resultaten voor testen: stuur result component via de router data
    resultComponent:ResultformPrototypesComponent, //voor Shared Form: stuur result component via de router data
  },
  //canActivate: [AuthGuard], 
  resolve: { FormDataLoadResolver,
            // ScriptLoadResolver 
            } //voor Shared Form: laadt formdata in localstorage, en laad scripts (Google charts, etc)
  },
  { path: 'drp', loadChildren: '../+drp#DRPModule' },
];

@NgModule({ 
  declarations: [ ResultformPrototypesComponent,
                  EntryformPrototypesComponent, //voor Shared Form en antwoord
                  ], 
  imports: [  CommonModule,
              FlexLayoutModule,
              MatButtonModule,
              RouterModule.forChild(appRoutes),
              SharedFormModule, SharedFormModule.forRoot(), //voor Shared Form en antwoord
            ],
  providers:[],
  entryComponents: [ResultformPrototypesComponent],
  exports:[ ResultformPrototypesComponent],
})
export class formPrototypesModule {
}