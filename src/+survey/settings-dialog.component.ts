import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatSelect } from '@angular/material';
import { SurveyService } from './surveyservice';
import {saveAs} from 'file-saver';

@Component({
  selector: 'settings-dialogbox',
  templateUrl: 'settings-dialog.component.html',
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      //text : any, //Injected is data from survey.component.ts
    }, 
    public dialogRef: MatDialogRef<DialogComponent>,
    private _surveyService: SurveyService,
  ) {}
  
      //FPform in controls
      public FPForm: FormGroup;
      public FPFormControl: FormControl;
  
  
  ngOnInit() {
    //FPForms
    this.FPFormControl = new FormControl('', [ Validators.required ]);    //create FormControls
    this.FPForm = new FormGroup({  FPFormControl: this.FPFormControl  });  //create form
  }
  //Fingerprint form in controls, the submit
  FPSubmit(){ this.dialogRef.close(this.FPForm.value['FPFormControl']);  } //close and send data back

  //Load answers to Storage
  AnswersFileHandler($event:any): void {
    //check file format, //eerst kijken of het een csv bestand is om in te laden
    if( $event.target.files[0].name.substring($event.target.files[0].name.length -4) == 'json')
      {
        console.log('ANSWERS FILE HANDLER, json detected, trying to store answers and restart form')
        var file: File = $event.target.files[0];
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => {
          this._surveyService.EraseAllAnswerData(); 
          let jsontext = String(fileReader.result); //het is een string (nl json) maar moet ook gecast worden als string omdat anders JSON.parse niet werkt
          this._surveyService.StoreAnswers( JSON.parse(jsontext)  )
          this.dialogRef.close("StartOfQuestionnaire"); //close dialog and send fingerpint data back
        }; 
    }
  }
  //Save Question Answers to local file, in json
  AnswersSave(){
    let a = JSON.stringify( this._surveyService.GetAnswers() );
    var blob = new Blob([a], {type: "application/json;charset=utf-8"});
    saveAs(blob, "Answers.json");
    this.dialogRef.close('exit'); //close and send data back
  }
  //restart questionnaire, at first question
  restartQ(){
    this._surveyService.EraseAllAnswerData(); //erase answers
    this.dialogRef.close("StartOfQuestionnaire"); //close dialog and send fingerpint data back
  }
  eraseAll(){
    this._surveyService.clearStorage();
    location.reload();
  } //for button erase all

  //activeert wanneer een document is ingeladen
  QuestionsFileHandler($event:any): void {
    //check file format, //eerst kijken of het een csv bestand is om in te laden
    if( $event.target.files[0].name.substring($event.target.files[0].name.length -4) == 'json')
      {
        console.log('QUESTIONS FILE HANDLER, json detected, trying to make form')
        //console.log('readThis geactiveerd');
        var file: File = $event.target.files[0];
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => { 
          this._surveyService.clearStorage();
          let jsontext = String(fileReader.result); //het is een string (nl json) maar moet ook gecast worden als string omdat anders JSON.parse niet werkt
          this._surveyService.StoreQuestionairreAllQsArray(JSON.parse(jsontext));
          this.dialogRef.close("StartOfQuestionnaire"); //close dialog and send fingerpint data back        }; 
      }
    }
  }

}
/** 
 * CUSTOM VALIDATOR TO CHECK IF FINGERPRINT WOULD RESULT TO AN ANSWER
 */
import { Directive, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[FPFormValidator][formControl]', //input field that has the validator
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => FPFormValidator), multi: true }
    ]
})
export class FPFormValidator implements Validator {
    constructor( private _surveyService: SurveyService ){ }

    //validate(c: AbstractControl): { [key: string]: any } {
    validate(c: FormControl) {
        if (c.value.length >= 3){
            // see if value exist in store, otherwise return false
            if(this._surveyService.FormCachedData(String(c.value)) == null){
                return { FPotherValidator: false  } //NOT validated
            }
            else{ return null } //validated!
        }
        else{  return { FPotherValidator: false  }  } //NOT validated
    }
}

