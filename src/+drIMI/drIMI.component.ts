import { Component, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material';
import { SurveyService } from '../+survey/surveyservice';


import {saveAs} from 'file-saver';

declare var Docxtemplater: any;
declare var JSZip: any;

@Component({
    templateUrl:'drIMI.component.html',
    styles:[`
      .mat-slider-horizontal{
        min-width: 300px;
      }
      p{
        white-space: pre-rap;
        margin-top: -5px;
        font-size: small;
      }
    `],
})
export class ResultDrIMIComponent implements OnInit {
    @Input() data: any; 
    public Results : any;
    public StoredAnswers : any;
    public LastAnswerFP : any;
    public DataForDocx : any;

    constructor(
        private _surveyService: SurveyService,
    ){ }
    
    ngOnInit() {
        if(this.data != null) {
            this.Results = this.data[0];
            this.StoredAnswers = JSON.stringify(this.data[1],null,2);
            this.LastAnswerFP = this.data[2];
            
            var demodata = {
                first_name: 'John',
                last_name: 'Doe',
                phone: '0652455478',
                description: 'New Website',
            }
            this.DataForDocx = Object.assign(this.data[1]);
            //this.DataForDocx(this.StoredAnswers);
            console.log("Data voor de Word document.", this.DataForDocx, this.Results)
        }
    }
    
    makeDocx(){
        var globalFunc = this;
        return new Promise(function(resolve, reject) { 
            resolve( globalFunc._surveyService.loadTemplate('https://www.legallinq.com/templates/IMI_Case_Evaluation_Tool.docx')	); 
        })
            //start building the document
            .then(function(result){ globalFunc.makeDocxManupilation(result);  })
            .catch((error) => { console.log('Generating Word Docx failes, message was: ', error);});
    }
    
    makeDocxManupilation(content:any){
        var zip = new JSZip(content);
        var doc=new Docxtemplater().loadZip(zip)
        doc.setData(this.DataForDocx);
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        try { doc.render() }
        catch (error) {
            var e = { message: error.message, name: error.name,  stack: error.stack, properties: error.properties, }
            console.log(JSON.stringify({error: e}));
            throw error; // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        }

        var out=doc.getZip().generate({
            type:"blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) //Output the document using Data-URI
        saveAs(out, "IMI Case Evaluation Tool - filled.docx");
    }
}