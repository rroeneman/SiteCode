import { Component, OnInit, Input } from '@angular/core';
import { JsonSchemaFormComponent } from 'angular7-json-schema-form';
import { SurveyService } from './surveyservice';

//Theming
import { MatButton, MatCheckbox, MatDialog, MatIconBase, MatOption, MatProgressBar, MatSlider, MatSlideToggle, MatFormField, MatFormFieldControl, MatSelect, MatInput, MatIcon, MatRadioButton, MatProgressSpinner, MatList, MatTooltip } from '@angular/material';
import { MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelContent } from '@angular/material/expansion';
import { DialogComponent } from './settings-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

//Routing
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { read } from 'fs';
import { Body } from '@angular/http/src/body';
import { error } from 'util';

@Component({
    selector: 'survey-app',
    templateUrl: 'survey.component.html',
    styles:[`
        #survey-main{ 
            min-height:calc(100vh - 181px);
        }
        #survey-inner{ 
            max-width:960px;
            width:90%;
            padding-top:5vh;
        }
    `],
})

export class SurveyComponent implements OnInit  {
    constructor(
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _surveyService: SurveyService,
        private router: Router,
        public dialog: MatDialog,
        private sanitizer: DomSanitizer,
    ){}

    public panelOpenState:boolean;
    //json schema
    public schemaUrl:any;
    public schema:any;
    public form:any;
    public data:any = {};
    public submitFunction: Function;
    public onChangesFunction : Function;
    public isValid : boolean = false;
    //other data
    public titlefield: any;
    public descriptionfield: any;
    public progressIndicator : number = 0;
    public currentFingerprintKey : any;
    public currentClassName : any;
    public FPKey : any;
    public previousQuestion : any;
    public NoDataSelectedWarning : boolean;
    //display controls
    public showspinner:boolean = false;
    public showQuestions:boolean = false;
    public showResult:boolean = false;
    


    ngOnInit() {
        //Title and description
        this.titlefield = this._activatedRoute.snapshot.data.Title;
        this.descriptionfield = this._activatedRoute.snapshot.data.Description;
        //clear answer storage on start of questionnaire
        this._surveyService.EraseAllAnswerData();
        this.setFormData("StartOfQuestionnaire"); //all data should be fully loaded through router at this point
    }
    /**
    * Q functions (questionairre functions)
    *  Qnext, the file name of next question is sent
    *  Qsave, save data from form to local storage under their formfield  name (= OWLClass shortname).
    *  Qget, get data from storage, if Key is empty get all data in an Object
    * @param formdata 
    */
    Qnext(Hash:any){ 
        if(this.NoDataSelectedWarning) return; //safety for when form is empty
        this.setFormData(Hash); 
    }
    Qsave(formdata:any){
        //set warning no data to false, unless resetted hereunder
        this.NoDataSelectedWarning = false;
        //empty formdata object, no choices were made (check isObject, othewise stops at first question)
        if(formdata == undefined) {this.NoDataSelectedWarning = true; return;}
        if(typeof formdata == "object" && Object.keys(formdata).length == 0) {this.NoDataSelectedWarning = true; return;}
        //one open field or array, will need to add the ClassName for storage
        if(typeof formdata == "string" || formdata instanceof Array){ formdata = {[this.currentClassName]:formdata};  }
        //do the save action
        this._surveyService.StoreAnswers(formdata)
    }
    Qget(Key:any = null){ return this._surveyService.GetAnswers(Key); }
    //Buttons in Description field of Panel, need to stop executing collapse/open function of panel, with stopPropagation
    backToQuestions(event: Event) {  event.stopPropagation();  this.showQuestions = true;  }
    backOneQuestion(event: Event) { event.stopPropagation(); this.setFormData(this.previousQuestion);}

    //MAIN FUNCTION
    setFormData(formdata:any){
        //set warning no data to false, unless resetted hereunder
        this.NoDataSelectedWarning = false;
        //empty formdata object, no choices were made (check isObject, othewise stops at first question)
        if(typeof formdata == "object" && Object.keys(formdata).length == 0) {this.NoDataSelectedWarning = true; console.log("No data selected, data from form was: ", formdata); return;}
        //show spinner
        this.showspinner = true;
        //scroll to top of div
        function scrollToHash(hashName = "jsonformdiv") { location.hash = "#" + hashName; } 
        //seek next record ID for finding results (also new results will be set in service module)
        this.currentFingerprintKey = this._surveyService.NextQuestionId(formdata); 
        
        var form:any;
        form = this._surveyService.FormCachedData(this.currentFingerprintKey);
        //console.log("Formdata input: ", formdata);
        //console.log("Next RecordId: ", this.currentFingerprintKey);
        //console.log("Form data: ", form);
        //console.log("Results: ", this._surveyService.ResultCachedLatest());

        //if no more Questions, show results only
        if(form == null) { 
            this.iterateArray(); //do iteration to fill last question of form with data (for backbutton), erased by submit
            this.progressIndicator = 100;
            this.showQuestions = false; this.showResult = true; //show results
        } 
        //if there are more questions continue questionnaire
        else{ this.buildForm(form) }
        this.showspinner = false;
    }
    
    buildForm(form:any){
        //erase/reset form default data
        this.data = {};
        //reset currentFingerprintKey
        this.currentFingerprintKey = false;
        //reset currentClassName, to be sure a new one is inserted
        this.currentClassName = null;
        //set previous to false, to remove back button unless next form initialises it again
        this.previousQuestion = false;
        //new form data 
        form = JSON.parse(form);
        this.schema = form.schema;
        this.form = form.form;
        //(re-)set submit and onchange to standard value, possibly to be changed by form data on iteration
        this.submitFunction = new Function("answers", "this.setFormData(answers);");
        this.onChangesFunction = new Function();
        //build form data from forminput, look for onSubmit and onChanges functions in json.        
        this.iterateArray();
        //set showQuestions for display
        this.showQuestions = true;
    }

    iterateArray(ArrayDataLocation:any = ""){
        if (ArrayDataLocation == ""){ var data = this.form;}
        else{ var data = this.form+ArrayDataLocation; }
        for (let i = 0; data.length > i; i ++) {
            if(typeof data[i] === "object") { this.iterateObject(ArrayDataLocation+"["+i+"]"); }
            else if(data[i].isArray){ this.iterateArray(ArrayDataLocation+"["+i+"]"); } //assume array
            else if(typeof data[i] !== "string"){console.error("UNEXPECTED DATA-TYPE FOR (ARRAY): ", data[i]);}
        }
    }
    
    iterateObject(ObjectDataLocation:any){
        var data = eval("this.form"+ObjectDataLocation);
        //THE MAGIC : filter out objects containing an onClick element and initialise html form element with that
        if(data.hasOwnProperty("onClick") && data["type"] == "submit"){this.submitFunction = new Function("answers", data["onClick"]);  }
        //filter out objects containing an onChange element (usually same element as submit)
//TODO MAKE BUTTON GREY, THEN AUTO JUMP IS POSSIBLE        //if(data.hasOwnProperty("onChanges") && data["type"] == "submit"){this.onChangesFunction = new Function("answers", "if(Object.keys(answers).length>0) this.Qnext(answers);"); };
        //fetch progress indicator
        if(data.hasOwnProperty("progressIndicator") && data["type"] == "submit"){this.progressIndicator = this.calcProgress(data["progressIndicator"]) };
        //fetch previous question filename
        if(data.hasOwnProperty("previousQuestion") && data["type"] == "submit"){this.previousQuestion = data["previousQuestion"] };
        //single & array fields, three functions - ClassName, Fingerprint, Insert stored data into form
        if(data.hasOwnProperty("key") && data.hasOwnProperty("ClassName")){
            this.currentClassName = String( data["ClassName"] );
            this.currentFingerprintKey = data["key"]
            //fetch stored data, for back button and resume questionnaire
            let answer = this._surveyService.GetAnswers( this.currentClassName ); 
            if(answer[this.currentClassName] != null) this.data[data["key"]] = answer[this.currentClassName]; //use fingerprint(=key) as key of the object, and fetch answer with the Classname
        }
        //group fields, one function: Insert stored data into form
        else if(data.hasOwnProperty("key")) { this.insertStoredData_group(ObjectDataLocation); }
        
        //check for other array's or objects
        var ObjList = Object.keys(data);
        for (let i = 0; ObjList.length > i; i ++) {
            let key = ObjList[i];
            if(typeof data[key] === "object") { this.iterateObject(ObjectDataLocation+"[\""+key+"\"]"); }
            else if(data[key].isArray){ this.iterateArray(ObjectDataLocation+"[\""+key+"\"]"); } //assume array
            //catch function, if no string (delt with above) or boolean (not relevant)
            else if(typeof data[key] !== "string" && typeof data[key] != "boolean" && typeof data[key] != "number")  {
                console.error("WRONG DATA TYPE FOR (OBJECT): ", key, data[key], typeof data[key]);
            }
        }
    }
    //helper: calculate progress and last question
    calcProgress(input:any){
        if(input == null) console.error("Progress data is incorrect, data in model is: ", input);
        let inputTOarray = input.split("/");
        let current:number = Number(inputTOarray[0]);
        let total:number = Number(inputTOarray[1]);
        
        if(typeof current != 'number' || typeof total != 'number' ) return null;
        //return percentage of questions done
        if (current == 1){ return 0; }
        else { return Math.round((current-1)/total*100);}        
    }
    

    //Look up whether data is stored, and if so set as default data in the form
    //used for Previous and Resume questionnaire functions
    insertStoredData_group(ObjectDataLocation:any){
        var data = eval("this.form"+ObjectDataLocation);
        var keyArray = data["key"].split(".");
        var key = keyArray[keyArray.length-1]; //last array item is the real name as stored
        let fieldValue = this._surveyService.GetAnswers(String(key));
        if(fieldValue[key] != null){
            //console.log("FIELD DATA IN STORAGE: ",fieldValue);
            //eval("this.form"+ObjectDataLocation)["value"] = fieldValue[key];
            if (keyArray.length == 2){ 
                if(this.data[keyArray[0]] == null) this.data[keyArray[0]] ={};
                this.data[keyArray[0]][keyArray[1]] = fieldValue[key];
            }
            else if (keyArray.length == 3){ 
                if(this.data[keyArray[0]] == null) this.data[keyArray[0]] ={};
                if(this.data[keyArray[0]][keyArray[1]] == null) this.data[keyArray[0]][keyArray[1]] ={};
                this.data[keyArray[0]][keyArray[1]][keyArray[2]] = fieldValue[key] 
            }
            else { console.error("QUESTIONNAIRE AS MORE LAYERS THEN EXPECTED, see function *inserStoredData*")}
        }
    }

   
    //Open popup window en stuur object er naar toe
    openDialog() {
        //let description = "een tekst";
        //initiate dialogbox and send data
        let dialogRef = this.dialog.open(DialogComponent, {
        width: '324px',
        data: {
        //    text: description,
        }
        } );
        //result back
        dialogRef.afterClosed().subscribe(result => {
            if(result !='exit'){this.setFormData(result); this.showQuestions = true; }
        });
  }

    //isValid(event:any){console.log("isValid boolean: ",event);}
    validationErrors(event:any){
        //if(!this.isValid){ }
        //console.log("ValidationError: ",event,this.isValid);
    }
    
}

/**
 * BASIS RESULT MODULE
 */

@Component({
    selector: 'dashboard',
    template: `
    <h1>RESULT PAGE BASIS</h1>
    <p>Please find raw system results below:</p>
    <h3>Results:</h3>
    <pre>{{Results}}</pre>
    <h3>Stored answers:</h3>
    <pre>{{StoredAnswers}}</pre>
    <h3>Last answer FingerPrint:</h3>
    <pre>{{LastAnswerFP}}</pre>
    <h3>Data assembled for Word doc:</h3>
    <pre>{{DataForDocx}}</pre>


    `,
})
export class BasicResultComponent implements OnInit  {
    @Input() data: any; 
    public Results : any;
    public StoredAnswers : any;
    public LastAnswerFP : any;
    public DataForDocx :any;

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
            this.DataForDocx = JSON.stringify(Object.assign(this.data[1]));
            //this.DataForDocx(this.StoredAnswers);
            console.log("Data voor de Word document.", this.DataForDocx, this.Results)
        }
    }

}


