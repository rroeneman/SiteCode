
import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Component } from '@angular/compiler/src/core';
import { SurveyComponent } from './survey.component';

/**
 * ALL LISTS FOR EXPORT
 */
let providersList:any = [];
let ComponentForResult:any = []; //the actual component, for import in dc.survey.component and declaration

/**
 * HELPERS
 * Injectables need to be exported class
 * Injectable should be listed in Providers of this AppRoutingModule
 */
import { Script } from './scriptloader';
@Injectable() export class ScriptLoadResolver implements Resolve<Promise<any>>{ constructor(private script : Script) {} 
resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): any { return this.script.load(...route.data.scripts) //the three dots are to copy the data as array instead of only referencing this route object
  .then(() => {console.log("External javascripts have been loaded"); return true;} )  
  .catch(err => {console.error("Google script loading failed", err); return false;}); }}

import { SurveyService } from './surveyservice';
@Injectable() export class SurveyDataLoadResolver implements Resolve<Promise<any>>{ constructor(private _surveyService: SurveyService,) {} 
  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): any { return this._surveyService.LoadAllQuestionData(route.data.url) 
    .then(() => {return true;} ) 
    .catch((err:any) => {console.error("Questionnaire data loading failed", err); return false;});
  }}

/**
 * drMETHODS app, uses SCRIPT + SCRIPTLOADERRESOLVER
 */
import { DRMethodsModule } from '../+drmethods';
import { ResultDrmethodsComponent } from '../+drmethods/drmethods.result.component'; 
ComponentForResult.push(ResultDrmethodsComponent);

import { BasicResultComponent } from './survey.component';
ComponentForResult.push(BasicResultComponent); 


import {DRIMIModule } from '../+drIMI';
import {ResultDrIMIComponent } from '../+drIMI/drIMI.component';
ComponentForResult.push(ResultDrIMIComponent);


import { DsOfflineModule } from '../+dsOffline';
import { ResultDsOfflineComponent } from '../+dsOffline/dsOffline.component';
ComponentForResult.push(ResultDsOfflineComponent);


let routesTest: Routes = [
  {path: '', redirectTo: '/404', pathMatch: 'full'} ,
  
  //DRMETHODS 
  { path: 'drmethods', component: SurveyComponent,
    data: {
      url:'https://www.legallinq.com/Qs/drMethodSelection/',
      scripts:["googlechart"],
      resultComponent:ResultDrmethodsComponent,
      Title:'Dispute resolution methods - Selection tool',
      Description: `This is a prototype tool to show the very basics of how a selection for a method to resolve 
                    disputes could look like. The tool in its current form does not provide legal advice.`
    },
      //canActivate: [AuthGuard],
    resolve: { 
      SurveyDataLoadResolver, 
      ScriptLoadResolver 
    } 
  },

  // IMI 
  { path: 'drimi', component: SurveyComponent,
    data: {
      url:'https://www.legallinq.com/Qs/drIMI/', 
      resultComponent:ResultDrIMIComponent,
      scripts: ["docxtemplater","jszip"],
      Title:'IMI Ole list - in interactive form',
      Description: `The IMI published a questionnaire that can be easily filled with this interactive tool.`
    },
    resolve: { 
      SurveyDataLoadResolver,
      ScriptLoadResolver
    } 
  },

    // OFFLINE
  { path: 'ebmt90210', component: SurveyComponent,
    data: {
      url:'https://www.legallinq.com/Qs/EBMT/', 
      resultComponent:ResultDsOfflineComponent,
      scripts: ["docxtemplater","jszip"],
      Title:'Offline Decision Support',
      Description: `A basic prototype tool for offline decision support structure.`
    },
    resolve: { 
      //SurveyDataLocal,
      SurveyDataLoadResolver,
      ScriptLoadResolver
    } 
  },

  { path: 'contracting', component: SurveyComponent,
  data: {
    url:'https://www.legallinq.com/Qs/GeneralContract/', 
    resultComponent:BasicResultComponent,
    scripts: ["docxtemplater","jszip"],
    Title:'Contract selector',
    Description: `A basic prototype for contract selection decision support.`
  },
  resolve: { 
    //SurveyDataLocal,
    SurveyDataLoadResolver,
    ScriptLoadResolver
  } 
},
];

/**
 * DO THE EXPORTS
 */
@NgModule({
  imports: [RouterModule.forChild(routesTest)],
  // declarations: [BasicResultComponent],
  declarations: [BasicResultComponent ],
  providers: [SurveyDataLoadResolver, Script, ScriptLoadResolver, SurveyService],
  entryComponents: [BasicResultComponent],
  exports: [RouterModule, 
            DRMethodsModule, 
            DRIMIModule,
            DsOfflineModule,
          ],
})
export class AppRoutingModule { }
//export let routingProviders = providersList;
//export let routingModules = Modules;
export let resultComponent = ComponentForResult; //for dc.survey.component.ts