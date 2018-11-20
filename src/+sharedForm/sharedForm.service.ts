import {Injectable} from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { HttpClient } from '@angular/common/http';
import { formatFormData } from 'angular7-json-schema-form';
import 'rxjs/add/operator/toPromise';
var path = require('path');

@Injectable()
export class SharedFormService {
	constructor (
		private localStorageService: LocalStorageService,
		private http: HttpClient,
    ) { }
	
	/**
	 * GENERAL STORAGE FUNCTIONS
	 */
	storeData(key:string, data:any){ return this.localStorageService.set(key, data); }
	clearStorage(){ return this.localStorageService.clearAll(); } //Clear whole local storage
	
	/**
	 *
	 *  
	 * SERVICES FOR RUNNING QUESTIONNAIRE
	 * 
	 */

	NextQuestionId(formdata:any){ 
		//als er formdata is, dan een post plaatsen
		if(typeof formdata == "object"){ 
			//Generate List of answers, needed as keys to fetch the data
			var ListOfAnswers = Object.keys(formdata);
			//sequence voor arrays
			console.log("HEBBES", formdata[ListOfAnswers[0]][0])
			let recordId;
			if(ListOfAnswers.length == 1 && typeof formdata[ListOfAnswers[0]] == "object"){	
				//Nu zitten we dus in de array van antwoorden
				//selecteer het eerste antwoord om volgende vraag te bepalen (soms is laatste antwoord een rest categorie)
				recordId = formdata[ListOfAnswers[0]][0];
			}
			else{
				//STANDARD, use last answer of list
				recordId = formdata[ ListOfAnswers[ListOfAnswers.length-1] ];
				//set the new results
			}
			this.ResultSetCachedLatest(recordId);
			return recordId;
		}
		//if no object, formdata must be the next record name
		else{
			this.ResultSetCachedLatest(formdata);
			return formdata; 
		}
	}
	//get form question data
	FormCachedData(recordId:any){ return this.localStorageService.get(recordId); }
	//Set generic name item in storage for latest results
	ResultSetCachedLatest(recordId:any){
		//Start of questionnaire, return
		if(recordId == "StartOfQuestionnaire"){ this.storeData("CurrentSurveyResult", this.GetResultById(recordId)); return}

		//NEXT QUESTIONS
		var OldResults = this.ResultCachedLatest();
		var NewResults = this.GetResultById(recordId);

		if(NewResults == "[]"){ this.storeData("CurrentSurveyResult", "NO RESULTS (excluding last answers results would be :" +OldResults) }
		else{ this.storeData("CurrentSurveyResult", NewResults) }
	}
	//ResultCachedLatest(ResultName:any){	return this.localStorageService.get("Result"+ResultName);	}
	ResultCachedLatest(){ return this.localStorageService.get("CurrentSurveyResult");	}
	GetResultById(key:any){return this.localStorageService.get("Result"+key);	}

	LoadAllQuestionData(url:any):any{
		var globalFunc = this;
		return new Promise(function(resolve, reject) { 
				//if url is not yet loaded, erase all current questions and then continue to loading requested question/answer data
				if (globalFunc.setUrl(url)) resolve( globalFunc.FetchRemoteQs()	);  
				else reject('Data of URL was already loaded, all data loading aborted.');})
			//store question data
			.then(function(result){  globalFunc.StoreQuestionairreAllQsArray(result);})
			.then(function(){
				return new Promise(function(resolve, reject) { resolve( globalFunc.FetchRemoteResults() )})
				.then(function(resultData:any){	globalFunc.StoreResults(resultData)	})
			})
			.catch((error) => { console.log('For dataload message was: ', error);});
	}
	/**
	 * 
	 * 
	 * SERVICES TO HANDLE ANSWERS PROVIDED, for making reports of provided answers (open text etc)
	 */
	StoreAnswers(answers:object){
		//catch non-objects, rest of functions are not prepared for this scenario
		if(typeof answers != 'object') {console.error("Try to store answers, not an object: ", answers); return;}
		//make iteratable list		
		var ObjList = Object.keys(answers);
		//catch situations were no data is sent
		if(ObjList.length == 0) { console.error("No answers to store while answers were expected (StoreAnswers at SharedFormServices), data received was", answers);}
		//iterate and store
		for (let i = 0; ObjList.length > i; i ++) {
			this.storeData("Answers"+ObjList[i],answers[ObjList[i]]); //store data
			this.SetAnswersList("Answers"+String(ObjList[i])); //make answerlist to know what is stored (a  'get all data' function)
		}
	}
	SetAnswersList(AnswerKey:string){
		if(this.localStorageService.get("QuestionnaireAnswersListArray") == null){
			//initiate Array
			var KeyList:Array<String> = [AnswerKey];
		}
		else{
			//add to existing array
			var KeyList:Array<String> = this.localStorageService.get("QuestionnaireAnswersListArray");
			KeyList.push(AnswerKey);	
		}
		this.storeData("QuestionnaireAnswersListArray", KeyList); //store data
	}
	GetAnswers(key:string = null){
		var AnswersList = {};
		//fetch all answers stored
		if(key == null){
			var KeyList:Array<any> = this.localStorageService.get("QuestionnaireAnswersListArray");
			if(KeyList == null) return AnswersList; //no data in storage yet
			for (let i = 0; KeyList.length > i; i ++) {
				//add to AnswersList (remove "Answers" prefix)
				AnswersList[ KeyList[i].substring(7) ] = this.localStorageService.get(KeyList[i]);
			}
		}
		//for a single element
		else{  AnswersList[ key ] = this.localStorageService.get("Answers"+key); }
		return AnswersList;
	}
	EraseAllAnswerData(){
		var KeyList:Array<any> = this.localStorageService.get("QuestionnaireAnswersListArray");
		if(KeyList == null) return; //for empty lists
		for (let i = 0; KeyList.length > i; i ++) {
			this.localStorageService.remove(KeyList[i]);//remove
		}
		this.localStorageService.remove("QuestionnaireAnswersListArray");
	}
	/**
	 * 
	 * 
	 * LOAD QUESTIONAIRRE DATA
	 *  
	 */
	private RASPURL:string;
	setUrl(url:any){
		//do not load data offline, that is done at the app module
		if(navigator.userAgent.includes("Electron")) return false;
		//check url when ONLINE
		this.RASPURL = String(url);
		var CurrentUrl:string = this.localStorageService.get("RemoteSurveyAddressAndFolder");
		if(CurrentUrl == null || CurrentUrl != url){ 
			this.clearStorage(); //erase all answers and questions
			this.storeData("RemoteSurveyAddressAndFolder", url); //store Url
			return true;
		}
		return false;
	}
	//Get full questionairre questions + results
	//FetchRemoteQs(){ return this.http.get(this.RASPURL + "QsAggregated.json" +"?makeUniqueCall="+Date.now()).toPromise() }
	FetchRemoteQs(){ return this.http.get(this.RASPURL + "QsAggregated.json").toPromise() }
	FetchRemoteResults(){ return this.http.get(this.RASPURL + "HashResultCombi.json" +"?makeUniqueCall="+Date.now()).toPromise() }

	/**
	 * 
	 * STORE QUESTIONS AND RESULTS
	 * @param DataObj 
	 */
	StoreQuestionairreAllQsArray(DataObj:object){
		//find all keys, which will become file names
		var ListOfQuestionHashes = Object.keys(DataObj);

		var i:any;
		for (i = 0; i < ListOfQuestionHashes.length; i++) {
			let name =ListOfQuestionHashes[i]; //file names, these are the hash keys
			let value = DataObj[ListOfQuestionHashes[i]]; //the actual json for the form schema
			this.storeData(name, value);
		}
		console.log("Data loaded into local storage",DataObj);
		return true; //send true back to activate re-loading of page
	}
	StoreResults(DataObj:object){
		//find all keys, which will become file names
		var ListOfQuestionHashes = Object.keys(DataObj);

		var i:any;
		for (i = 0; i < ListOfQuestionHashes.length; i++) {
			let name =ListOfQuestionHashes[i]; //file names, these are the hash keys
			let value = DataObj[ListOfQuestionHashes[i]]; //the actual json for the form schema
			this.storeData("Result"+name, value);
		}
		console.log("Answers Data loaded into local storage");
		return true; //send true back to activate re-loading of page
	}

	//DEZE REQUIRE CRASHED HELE MODULE, IETS OP VINDEN, IS ALLEEN VOOR LOADTEMPLATES
	//var readFilePromise = require('fs-readfile-promise');
	/** 
	 * 
	 * LOAD WORD DOCUMENTS / TEMPLATES
	 *         
	 */
	loadTemplate(templateName:any){ 
		var glb = this;
		if(navigator.userAgent.includes("Electron")){
			var p = path.join('assets','ds', templateName);
			//HOE TE KOMEN TOT EEN ARRAYBUFFER


//READ FILE PROMISE PROBLEEM TODO

			//			return readFilePromise(p,'utf8').buffer;
			return null;
		}
		else{
			let url:any = 'https://www.legallinq.nl/templates/'+templateName;
			return this.http.get(url +"?makeUniqueCall="+Date.now(), {
				responseType: "arraybuffer"
			}).toPromise() 
		}
	}
}

