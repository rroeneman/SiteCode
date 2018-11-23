import {Injectable} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
 
@Injectable()
export class KennisbankService {
	constructor (
		private localStorageService: LocalStorageService,
		private http: HttpClient,
	) { }
	private RASPURL:string = 'https://www.legallinq.com/Qs/nlJSON/'; 
	
	/**
	 * PUBLIC FUNCTIONS
	 * Id (laatste deel van de url) = JsonFileName
	 */
	LoadJsonById(JsonFileName:any){
		JsonFileName = JsonFileName.toLowerCase(); //filename always lowercase, URL may be in part with upper case
		var globalFunc = this;
		return new Promise(function(resolve, reject) { 
				//if url is not yet loaded, erase all current questions and then continue to loading requested question/answer data
				if (globalFunc.check(JsonFileName)) resolve( globalFunc.FetchRemoteQs(JsonFileName)	);  
				else reject('Data of URL was already loaded, all data loading aborted.');})
			//store question data
			.then(function(result){ globalFunc.storeData(JsonFileName, result);})
			.catch((error) => { console.log('For dataload message was: ', error);});
	}

	/**
	 * HELPER FUNCTIONS
	 */
	check(JsonFileName:any){
		//do not load data offline, that is done at the app module
		if(navigator.userAgent.includes("Electron")) return false;
		//TODO: mag niet teveel opslaan, dus iets van cachen inregelen? Of wordt al gecahced door browser?
		var KeyList:any = this.localStorageService.get(JsonFileName);
		if(KeyList == null) return true; //for empty lists
		return false;
	}

	/**
	 * HELPER FUNCTIONS STORAGE
	 */
	storeData(key:string, data:any){ return this.localStorageService.set(key, data); }
	clearStorage(){ return this.localStorageService.clearAll(); } //Clear whole local storage
	removeItem(JsonFileName:any){return this.localStorageService.remove(JsonFileName);}
	retrieveItem(JsonFileName:any){return this.localStorageService.get(JsonFileName);}

	/**
	 * 
	 * HTTP FUNCTIONS FETCH DATA
	 * 
	 */
	FetchRemoteQs(JsonFileName:any){ return this.http.get(this.RASPURL + JsonFileName + ".json"  +"?makeUniqueCall="+Date.now()).toPromise() }

}