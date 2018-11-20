import { Component, Input, OnInit } from '@angular/core';

//Inladen JSON
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Component({
    //templateUrl:'formPrototypes.component.html',
    template: `<div [innerHTML]="HTMLcontent"></div>`,
    styles:[``],
})
export class ResultformPrototypesComponent implements OnInit {
    @Input() data: any; 
    public Results : any;
    public StoredAnswers : any;
    public LastAnswerFP : any;
    public HTMLcontent: any = "Uw gegevens worden verwerkt, een ogenblik geduld alstublieft...";

    constructor( private http: HttpClient ){ }
    
    ngOnInit() {
        if(this.data != null) {
            this.Results = this.data[0];
            this.StoredAnswers = JSON.stringify(this.data[1],null,2);
            this.LastAnswerFP = this.data[2];
            
            console.log("Result Component Input data, Result | StoredAnswers : ", this.Results, this.StoredAnswers)

            if(this.Results=="[MediationOtherFactors]" ){this.LoadJsonById("voorMediationKandidaten");}
            else{this.LoadJsonById("geenMediation");}
        }
    }
    LoadJsonById(JsonFileName:any){
        var globalFunc = this;
		return new Promise(function(resolve, reject) { resolve( globalFunc.FetchRemoteJSON(JsonFileName)	); })
			//display data
			.then(function(result){ console.log("JSON data", result); globalFunc.HTMLcontent=result['content']; /*globalFunc.storeData(JsonFileName, result);*/})
			.catch((error) => { console.error('For dataload message was: ', error);});
	}
	// HTTP FUNCTIONS FETCH DATA
    FetchRemoteJSON(JsonFileName:any){ return this.http.get("https://www.legallinq.com/Qs/RvdRzelftest/" + JsonFileName + ".json"  +"?makeUniqueCall="+Date.now()).toPromise() }
}
