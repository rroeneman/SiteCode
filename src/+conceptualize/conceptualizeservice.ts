import {Injectable} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class ConceptualizeService {
	public RASPURL:string = "http://localhost:3000/api/test";
	public raspdata:any;

	constructor (
        //API https://github.com/grevory/angular-local-storage
		private localStorageService: LocalStorageService,
		private http: HttpClient,
    ) { }
	//data opslaan
	storeTextPersistent(conceptualizevalues: any){
		return this.localStorageService.set('conceptualizeText', conceptualizevalues);
	}
	storeDocName(docname:any){
		return this.localStorageService.set('conceptualizeDocName', docname);
	}
	storeType(contractType:any){
		return this.localStorageService.set('conceptualizeType', contractType);
	}
	storeCSV(csv:any){
		return this.localStorageService.set('csv', csv);
	}
	//data opvragen
	getText() {
		let text = this.localStorageService.get('conceptualizeText');
		if (text) return text; 
		return 'No text stored locally';
	}
	getCSV (){
		let text = this.localStorageService.get('csv');
		if (text) return text; 
		return 'No csv stored locally';
	}

	//erase localstorage entry
	removeItem(){
		this.localStorageService.remove('conceptualizeText');
		this.localStorageService.remove('conceptualizeDocName');
		this.localStorageService.remove('conceptualizeType');		
	}
		
	//store concepts for local usage
	storeConcepts(){
		// Make the HTTP request:
		this.http.get('http://www.legallinq.nl/CONTRACTdbAPI1406.php/concepts').subscribe(data => {
			// Read the result field from the JSON response.
			var conceptsFullArray:Array<string> = [];
			var conceptsFlatArray:Array<string> = [];
			Object.keys(data).forEach(function(key,index) {
				//fill the full array
				conceptsFullArray[key] = new Array<string>(3); //maak de tweede dimensie
				conceptsFullArray[key]['id'] = data[key]['id'];
				conceptsFullArray[key]['concept'] = data[key]['concept'];
				conceptsFullArray[key]['comment'] = data[key]['commment'];
				//fill the flat array
				conceptsFlatArray[data[key]['id']] = data[key]['concept'];
			})
			this.localStorageService.set('conceptsFullArray', conceptsFullArray);
			this.localStorageService.set('conceptsFlatArray', conceptsFlatArray);
			return true;			
		});
	}
	//get all the concepts into an array (id / concept)
	getConceptsFullArray(){ return this.localStorageService.get('conceptsFullArray'); }
	//concepts as an one dimensional array with concepts only
	getConceptsFlatArray(){return this.localStorageService.get('conceptsFlatArray');}
	
	//retrieve all paragraphs and make array of solely id and hash
	storeParaHash(){
		this.http.get('http://www.legallinq.nl/CONTRACTdbAPI1406.php/paragraphs').subscribe(data => {
			// Read the result field from the JSON response.
			var paraHashArray:Array<number> = [];
			Object.keys(data).forEach(function(key,index) {
				//build array, key is de id and element the hash
				paraHashArray[data[key]['id']] = Number(data[key]['hash']);
			})
			this.localStorageService.set('paraHashArray', paraHashArray);
			return true;			
		});
	}
	//get all the concepts into an array (id / concept)
	getparaHashArray(){ return this.localStorageService.get('paraHashArray'); }

	//Classified docs Store and Retrieve
	storeClassifiedDocs(classified:Array<any>){this.localStorageService.set('classifiedDoc', classified);}
	getClassifiedDocs(){return this.localStorageService.get('classifiedDoc');}

	//split text into array of paragraphs and store in central value
	textToArray(text: any) {
		//console.log('EditRaw: ');
		//console.log(text);
		var oneDimensionalArray = text.split("\n\n")
		//filter out empty array elements
		oneDimensionalArray = oneDimensionalArray.filter(function(value:any) { if (value) return value;});
		//remove white space at beginning and end of the paragraph
		oneDimensionalArray.forEach(function(value:any, i:number) { oneDimensionalArray[i] = value.trim();});
		//return array
		return oneDimensionalArray;
	}
	//convert one dimensional array to two dimensional array
	oneToTwoArrayDimensions(oneDimensionalArray: any) {
		let a = oneDimensionalArray.length;
		var twoDimensionalArray = new Array(a); //array met juiste lengte
		for (var i = 0; i < oneDimensionalArray.length; i++) {
			twoDimensionalArray[i] = new Array(2);
			twoDimensionalArray[i][0] = oneDimensionalArray[i];
			twoDimensionalArray[i][1] = '--';
			//check string length, als te lang dan melden in tabel
			if (oneDimensionalArray[i].length > 1024) twoDimensionalArray[i][1] = oneDimensionalArray[i].length;
		}
		//console.log('NewArray: ');
		//console.log(twoDimensionalArray);
		return twoDimensionalArray;
	}
	//generate hash from text
	djb2Hash(text:any) {
		//TODO, use a better hashcode, need to transform whole database with new hash, if we do
		var seed:any = 140614061406;
			for (var counter = 0, len = text.length; counter < len; counter++) {
				seed ^= (seed << 5);
				seed ^= text.charCodeAt(counter);
			}
		// We discard the sign-bit for compatibility with the DB implementation
		// and "always positive integers"
		return seed & ~(1 << 31);
	}
	
	//create array for LinkTable and docId
	private docId : any;
	
	//send NEW data to database, paragraph function is started when Title succesfully inserted into DB
	insertIntoDatabase(){
		//fetch the document name and use to see if database connection is alive
		let docname:any = this.localStorageService.get('conceptualizeDocName');
		let typename:any = this.localStorageService.get('conceptualizeType');
		let docnamejson = '{"title":"'+docname+'", "type":"'+typename+'"}';
		// Make the HTTP request:
		this.http.post('http://www.legallinq.nl/CONTRACTdbAPI1406.php/documents/1', docnamejson)
			.subscribe(
				result => {this.docId = result; this.paragraphDataPost() },
				err => { console.error('DocumentsPost: Something went wrong!');  }
			);
	}
	//send paragraph table, after title  has been send succesfully
	paragraphDataPost(){
		//prepare text
		var text = this.getText();
		var textarray = this.textToArray(text);
		//iterate over paragraphs to insert them one by one into Db
		for (var i = 0, len = textarray.length; i < len; i++) {
			textarray[i] = textarray[i].replace(/\n/g,"  "); //remove returns, put 2 spaces so I can find returns if needed.
			//TODO, make a good hash, this is prone to collition
			let hash = this.djb2Hash(textarray[i]); //console.log(hash);
			//build the json, row name : row value
			let paraJson = '{"value":"'+textarray[i]+'","hash":"'+hash+'"}';
			//send
			this.http.post('http://www.legallinq.nl/CONTRACTdbAPI1406.php/paragraphs/1', paraJson)
			//read results and enter into linktable array	
			.subscribe(	result => { this.linkDataPost(result);  } );
		}
	}
	//send linkdata table, after paragraph has been send succesfully
	linkDataPost(paragraphId:any){
		//build the json, row name : row value
		let paraJson = '{"paragraphId":"'+paragraphId+'","documentId":"'+this.docId+'"}';
		//send
		this.http.post('http://www.legallinq.nl/CONTRACTdbAPI1406.php/linktable/1', paraJson)
			//read results and enter into linktable array	
			.subscribe( result => { console.log('Para stored, Id: ' +paragraphId);  return true;},	);
		return
	}
	/**
	 * 
	 * Update in a sequence
	 * @param updateData:Array of paragraphs
	 * @param updateRecord:Array is single paragraph, whereby [0]=text, [1]concept, [2]paragraphId, [3]concept ids (one or more)
	 * @param LinkData:Object is select from Linktable on paragraph ID (special function in php api.)
	 *  
	 */
	//start seperate process for each paragraph to update
	updateLinkTable(updateData:Array<any>){
		console.log(updateData);
		for (var i = 0, len = updateData.length; i < len; i++) {
			this.updateLinkTableSelect(updateData[i]);
		}
	}
	//request Linktable data
	updateLinkTableSelect(updateRecord:Array<any>){
		//console.log('Select linktable data, paraID: ' +updateRecord[2])
		this.http.get('http://www.legallinq.nl/CONTRACTdbAPI1406.php/linktable/'+updateRecord[2])
		//read results and enter into linktable array	
			.subscribe(LinkData => { 
				if(LinkData[0] == undefined){console.error('NO data in Linktable for:');console.error(updateRecord); }
				else{this.updateLinkTableDoExistCheck(LinkData,updateRecord);}
			},
		);
		return Object; //this will be an empty object
	}
	//Do check on number of concepts, delete if to many, create if the few. Finally check if concepts all exists otherwise update all
	updateLinkTableDoExistCheck(LinkData:Object,updateRecord:Array<any>){
		//TWO STAGES, first check number of concepts and correct if need be, then check/register concept
		let updateConceptIds:Array<any>=updateRecord[3].toString().split(',');
		//check for matching length of records
		if (Object.keys(LinkData).length > updateConceptIds.length){
			//delete one record and when return 'true' do sequence again (always multidimensional Linkdata, because with one record nothing will need to be removed)
			this.updateLinkTableDelete(Number(LinkData[0]['id']),updateRecord);
		}
		else if (Object.keys(LinkData).length < updateConceptIds.length){
			//add one record in Db and do sequence again
			this.updateLinkTablePost(LinkData[0]['paragraphId'],LinkData[0]['documentId'],updateRecord);
		} 
		else{
			//DO check if no updates are necessary (if one update is needed all is updated, is less programming...)
			for(var key in LinkData) {if (LinkData.hasOwnProperty(key)) {
				if(updateConceptIds.indexOf(LinkData[key]['conceptId']) == -1){ 
					console.log('Concept UPDATE initiated paraId '+LinkData[0]['paragraphId']+ ' with ' + Object.keys(LinkData).length + ' concept: ' + updateRecord[1]);  
					this.updateLinkTableUpdate(updateRecord,LinkData);
					break; //break is needed, otherwise you might be send more then once to update table
				}
			}}
			console.log(`NO update needed for paragrahId ${LinkData[0]['paragraphId']}`)
		}
	}
	//update van de DB
	updateLinkTableUpdate(updateRecord:Array<any>,LinkData:Object){
		//Make array of concept id's
		let updateConceptIds:Array<any>=updateRecord[3].toString().split(',');
		//with number of paragraph records in DB same as number of concepts, we can safely do an update
		for (var i = 0, len = updateConceptIds.length; i < len; i++) {
			//build the json, row name : row value
			let paraJson = '{"conceptId":' +updateConceptIds[i]+ '}';
			//make separate variable from paraID otherwise it is lost in result reporting
			let paraId = updateRecord[2];
			let linktableId = LinkData[i]['id']; //length of concepts array's and Linkdata objects is the same
			//send to update specific Linktable by ID
			console.log('Send prepared, \nLinktable id: ' +linktableId+ '\nparaId: ' +paraId+ '\nparaJson:' +paraJson)
			this.http.put('http://www.legallinq.nl/CONTRACTdbAPI1406.php/linktable/'+linktableId, paraJson)
				.subscribe( result => { console.log('Concept stored, ParaId: ' +paraId+ ' LinktableID ' +linktableId);  }, );
		}
	}
	//in case of too many paragraph records in linktable (for instance a concept was removed) delete one
	updateLinkTableDelete(linkTableId:Number, updateRecord:Array<any>){
		console.log('Delete requested for LinkData id: ' +linkTableId);
		this.http.delete('http://www.legallinq.nl/CONTRACTdbAPI1406.php/linktable/'+linkTableId)
			.subscribe(result => { console.log('Record deleted from Linktable, id: '+linkTableId ); this.updateLinkTableSelect(updateRecord); }, );
	}
	//insert additional paragarph entries in LinkTable for multiple concepts
	updateLinkTablePost(paragraphId:any, docId:number, updateRecord:Array<any>){
		//build the json, row name : row value
		let paraJson = '{"paragraphId":"'+paragraphId+'","documentId":"'+docId+'"}';
		//send
		this.http.post('http://www.legallinq.nl/CONTRACTdbAPI1406.php/linktable/1', paraJson)
			//read results and enter into linktable array	
			.subscribe(result => { console.log('New Linktable ID is: '+result ); this.updateLinkTableSelect(updateRecord); },);
	}

	/**
	 * CONCEPTUALIZING THE PARAGRAPHS
	 * 
	 */
	classify(){
		//prepare text
		var text = this.getText();
		var textarray:Array<string> = this.textToArray(text);
		//remove returns, put 2 spaces so I can find returns if needed.
		for (var i = 0, len = textarray.length; i < len; i++) {textarray[0] = textarray[0].replace(/\n/g,"  "); }
		//direct resultaat opslaan
		if(this.classifyPost( textarray )) return true;

	}
	//request all classifications at once and return all at once
	classifyPost( textarray:Array<string> ) {
		let postRequests:any = [];
		var url = 'http://www.legallinq.nl/CONTRACTwatsonApi1406.php';
		//fill the postRequests array with all the requests
		for (var i = 0, len = textarray.length; i < len; i++) {	 
			let textJson = '{"text":"'+textarray[i]+'"}';
			postRequests[i] = this.http.post(url, textJson) ;  	
		}
		//send
		return forkJoin(postRequests).subscribe(results => {console.log(results); return this.storeClassifiedDocs(results);},
		);
	  }

	/**
	 * TEST SERVER ON RASBERRY PI
	 * 
	 */
	


	//send linkdata table, after paragraph has been send succesfully
	//error reporting is done through the interceptor, subscription is in the component.
	//we bring this here to have central URL management and as all other http calls are done here
	TESTRASB(){ return this.http.get(this.RASPURL)}
}