import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SharedFormService } from './sharedForm.service';
//import { MatButton, MatCheckbox, MatDialog, MatIconBase, MatOption, MatProgressBar, MatSlider, MatSlideToggle, MatFormField, MatFormFieldControl, MatSelect, MatInput, MatIcon, MatRadioButton, MatProgressSpinner, MatList, MatTooltip } from '@angular/material';
import { MatProgressSpinner } from '@angular/material';
import { isObject } from 'angular7-json-schema-form';
/**
 * Shared Form
 * <sharedForm-component [formdataToDisplay]="formdata"></sharedForm-component>
 */
@Component({
  selector: 'sharedForm-component',
  //styles:[``],
  templateUrl:'sharedForm.component.html',
})
export class SharedFormComponent implements OnInit {
  constructor( private _service: SharedFormService ) {}
  
  //Input from parent, needs to reset otherwise the Ts set/get will not work when getting the same type of object
  @Input() set formdataToDisplay(formdataToDisplay: any) {
    //console.log("INPUT FORM", formdataToDisplay)
    if (formdataToDisplay == 'resetValue' ) { /*console.log("SharedFormData resetted");*/ }
    else if (formdataToDisplay == null || formdataToDisplay == undefined){ /*console.error("Empty formdata send to SharedForm component");*/ }
    else if(typeof formdataToDisplay == "object" && formdataToDisplay.constructor.name == "EventEmitter"){ /*console.log("RECEIVED in Sharedform: EventEmitter");*/ }
    else {this.setFormData(formdataToDisplay); }
  }
  //TODO: bij questionaires met 2 vragen is de "previousQuestion" "StartOfQuestionnaire". Maar die wordt speciaal behandeld en gaat bij inladen van formulier niet eerst een vraag vooruit. Dus dan begin je niet bij de laatste vraag....

  //Output emitter for parent to change the result page, use like this.changeFingerprintKey.emit(this.currentFingerprintKey)
  @Output() changeFingerprintKey = new EventEmitter<any>();
  @Output() showResult = new EventEmitter<boolean>();
  @Output() previousQuestion = new EventEmitter<any>();
  @Output() progressIndicator = new EventEmitter<number>();
  
  //json schema
  public schemaUrl:any;
  public schema:any;
  public form:any;
  public data:any = {};
  public submitFunction: Function;
  public onChangesFunction : Function;
  public isValid : boolean = false;
  
  //other data
  public currentClassName : any;
  public currentFingerprintKey : any;
  public FPKey : any;
  
  //display controls
  public NoDataSelectedWarning : boolean; //safety for when form is empty
  public showspinner:boolean = false;
    
  ngOnInit() {
    //initialize, however when form is loaded (through input), stay silent
    if(this.form == undefined){
        this.previousQuestion.emit("StartOfQuestionnaire"); //for back-button
        this.progressIndicator.emit(0); //progress slider
        this.setFormData("StartOfQuestionnaire"); //all data should be fully loaded through router at this point
    }
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
      this._service.StoreAnswers(formdata)
  }
  Qget(Key:any = null){ return this._service.GetAnswers(Key); }
 
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
      this.currentFingerprintKey = this._service.NextQuestionId(formdata); 
      //sent new fingerprint to result page voor displaying updated data
      this.changeFingerprintKey.emit(this.currentFingerprintKey);
      
      var form:any;
      form = this._service.FormCachedData(this.currentFingerprintKey);
      //console.log("Formdata input: ", formdata);
      //console.log("Next RecordId: ", this.currentFingerprintKey);
      //console.log("Form data: ", form);
      //console.log("Results: ", this._service.ResultCachedLatest());

      //if no more Questions, show results only
      if(form == null) { 
          this.iterateArray(); //do iteration to fill last question of form with data (for backbutton), erased by submit
          this.progressIndicator.emit(100);
          //this.previousQuestion.emit(this.currentFingerprintKey);
          console.log("EINDE FORM FP IS: ", this.currentFingerprintKey)
          this.showResult.emit(true); //set current key as previous to allow the back button to go to last question
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
      //this.previousQuestion.emit(null);
      //new form data 
      form = JSON.parse(form);
      this.schema = form.schema;
      this.form = form.form;
      //(re-)set submit and onchange to standard value, possibly to be changed by form data on iteration
      this.submitFunction = new Function("answers", "this.setFormData(answers);");
      this.onChangesFunction = new Function();
      //build form data from forminput, look for onSubmit and onChanges functions in json.        
      this.iterateArray();
      //set showResult for display
      this.showResult.emit(false);
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
      if(data.hasOwnProperty("progressIndicator") && data["type"] == "submit"){this.progressIndicator.emit( this.calcProgress(data["progressIndicator"]) ) };
      //fetch previous question filename
      if(data.hasOwnProperty("previousQuestion") && data["type"] == "submit"){this.previousQuestion.emit( data["previousQuestion"] ) };
      //single & array fields, three functions - ClassName, Fingerprint, Insert stored data into form
      if(data.hasOwnProperty("key") && data.hasOwnProperty("ClassName")){
          this.currentClassName = String( data["ClassName"] );
          this.currentFingerprintKey = data["key"]
          //fetch stored data, for back button and resume questionnaire
          let answer = this._service.GetAnswers( this.currentClassName ); 
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
      let fieldValue = this._service.GetAnswers(String(key));
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

  //isValid(event:any){console.log("isValid boolean: ",event);}
  validationErrors(event:any){
      //if(!this.isValid){ }
      //console.log("ValidationError: ",event,this.isValid);
  }

}