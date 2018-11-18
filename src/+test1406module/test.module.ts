import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

//Component stuff
import { TestFirstComponent, TestSecondaryComponent } from './test.component';
import { Test1406Service } from './test.service';

//Routing
import { RouterModule, Routes, Resolve, ActivatedRouteSnapshot } from '@angular/router';

//TE TESTEN DELEN
import { MaterialDesignFrameworkModule } from 'angular7-json-schema-form';


@Injectable() export class JSONloadResolver implements Resolve<Promise<any>>{ constructor(private _kbService: Test1406Service,) {} 
  resolve( route: ActivatedRouteSnapshot ): any { return this._kbService.LoadJsonById(route.params["id"]) 
    .then(() => {console.log("Remote textdata loaded"); return true;} ) 
    .catch((err:any) => {console.error("JSON data loading failed", err, route.params["id"]); return false;});
  }}

let appRoutes: Routes = [
  
  { path: '', component: TestFirstComponent, pathMatch: 'full',}, //alleen partnerschap
  { path: ':id', component: TestSecondaryComponent,  resolve: { JSONloadResolver } },
];

@NgModule({ 
  declarations: [  TestFirstComponent, TestSecondaryComponent ],
  imports: [  CommonModule,
              FlexLayoutModule,
              MatButtonModule,
              RouterModule.forChild(appRoutes),
              // https://www.npmjs.com/package/angular7-json-schema-form
              MaterialDesignFrameworkModule,  //JsonSchemaFormModule.forRoot(MaterialDesignFrameworkModule),
            ],
  providers:[Test1406Service, JSONloadResolver],
  entryComponents: [],
})
export class Test1406Module {}