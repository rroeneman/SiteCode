/**
 * 
 * LOSSE SERVICES VOOR VEILIG DATA LOADING, ZOU WELLICHT OOK IN CENTRAL SERVICE KUNNEN WORDEN GEINTEGREERD
 * 
 * Aanroepen als volgt:
 * 
 * 
 * wordt gebruikt bij Routing, om zeker te stellen dat data is geladen VOORDAT er wordt gerouterered
 * Injectable should be listed in Providers vd Module, dus in de speciale externe output providers
 */
import {Injectable} from '@angular/core';
import { Routes, RouterModule, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Script } from './sharedForm.scriptload.service';
@Injectable() export class ScriptLoadResolver implements Resolve<Promise<any>>{ constructor(private script : Script) {} 
resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): any { return this.script.load(...route.data.scripts) //the three dots are to copy the data as array instead of only referencing this route object
  .then(() => {console.log("External javascripts have been loaded"); return true;} )  
  .catch(err => {console.error("Google script loading failed", err); return false;}); 
}}

import { SharedFormService } from './sharedForm.service';
@Injectable() export class FormDataLoadResolver implements Resolve<Promise<any>>{ constructor(private _service: SharedFormService,) {} 
  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): any { return this._service.LoadAllQuestionData(route.data.url) 
    .then(() => {return true;} ) 
    .catch((err:any) => {console.error("Questionnaire data loading failed", err); return false;});
}}