import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DRPMOCKDATA } from './drpBaseData';
import { DRPData } from './drpdata';

@Injectable() 
export class DRPService {
	constructor (
        //API https://github.com/grevory/angular-local-storage
		private localStorageService: LocalStorageService,
		//public stored_data: DRPData[],
    ) { }
    
	getBaseData(key:string) {
		let stored_data = this.localStorageService.get(key);
		//geen stored data dan standaard static data
		let dataToSend = DRPMOCKDATA;
		if (stored_data){
			for (var key in dataToSend) {
   				dataToSend[key] = stored_data[key]
			}
		}
		return Promise.resolve(dataToSend);
	}

	getIndividualData(id: number) {
    return Promise.resolve(DRPMOCKDATA)
      .then(DRPdata => DRPdata.filter(h => h.id === id)[0]);
	}
	storeToPersist(key:string, drpvalues: any){
		//TODO: maybe filter only values, but lot of trouble for not much fun
		return this.localStorageService.set(key, drpvalues);
	}
	resetPersist(){
		this.localStorageService.clearAll();
	}

	//tab status on DRP mainpage
	getTabStatus(page:string){ return this.localStorageService.get (page)	}
	setTabStatus(page:string, no:number){ return this.localStorageService.set(page, no) }

	getSuveyJson(id: number) {
		let surveyJSON;
		console.log('Survey ID requested: ' +id);
		if (id === 0) return surveyJSON = {pages:[{name:"page1",elements:[{type:"panel",name:"panel1",elements:[{type:"radiogroup",choices:["item1","item2","item3"],name:"question1"}],title:"wt is het"}]}]};

	}
}