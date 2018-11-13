import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

//Component stuff
import { KbOverviewComponent, KbPagesComponent } from './kb.component';
import { KBDataComponent, KBMainComponent, KBDirective } from './kb.dynamic.stories';
import { KennisbankService } from './kb.service';

//Routing
import { RouterModule, Routes, Resolve, ActivatedRouteSnapshot } from '@angular/router';


@Injectable() export class JSONloadResolver implements Resolve<Promise<any>>{ constructor(private _kbService: KennisbankService,) {} 
  resolve( route: ActivatedRouteSnapshot ): any { return this._kbService.LoadJsonById(route.params["id"]) 
    .then(() => {console.log("Remote textdata loaded"); return true;} ) 
    .catch((err:any) => {console.error("JSON data loading failed", err, route.params["id"]); return false;});
  }}

let appRoutes: Routes = [
  
  { path: '', component: KbOverviewComponent, pathMatch: 'full',}, //alleen partnerschap
  { path: ':id', component: KbPagesComponent,  resolve: { JSONloadResolver } },
];

@NgModule({ 
  declarations: [  KBMainComponent, KBDirective, KBDataComponent, KbOverviewComponent, KbPagesComponent ],
  imports: [  CommonModule,
              FlexLayoutModule,
              MatButtonModule,
              RouterModule.forChild(appRoutes),
            ],
  providers:[KennisbankService, JSONloadResolver],
  entryComponents: [ KBMainComponent, KBDataComponent ],
})
export class KennisbankModule {}