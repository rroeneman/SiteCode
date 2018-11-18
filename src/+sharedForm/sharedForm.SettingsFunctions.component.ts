/**
 * Formulier met allemaal settings for the forms, implement in a dialog like this:
 *  
    <!-- Settings button --> 
    <button fxShow fxHide.lt-sm at-mini-fab color="primary" mat-button (click)="popupSettingFunctions()"><mat-icon>settings</mat-icon></button>
    <a fxHide fxShow.lt-sm (click)="popupSettingFunctions()"><mat-icon>settings</mat-icon></a>

 */

import { Component, Inject, OnInit, Optional, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButton, MatDialogActions, MatDialog, MatDialogRef, MatIcon, MatInput, MatSelect } from '@angular/material';
import { SharedFormService } from './sharedForm.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'sharedFormSettingsButton',
  template: `
    <!-- Settings button --> 
    <button mat-mini-fab fxShow fxHide.lt-sm  color="primary" (click)="popupSettingFunctions()"><mat-icon>settings</mat-icon></button>
    <a fxHide fxShow.lt-sm (click)="popupSettingFunctions()"><mat-icon>settings</mat-icon></a>
  `,
})
export class SharedFormSettingsButtonComponent {
  constructor(public dialog: MatDialog) {}
  @Output() formdataNew = new EventEmitter<any>();

  //Open popup window voor settings, met mogelijkheid data in een object mee te sturen en data retour te krijgen
  popupSettingFunctions() {
    //let description = "een tekst";
    //initiate dialogbox and send data
    let dialogRef = this.dialog.open(SharedFormSettingsComponent, {
        width: '324px',
        data: { 
          //text: description,  
        }
    } );
    //result back
    dialogRef.afterClosed().subscribe(result => {
        if(result && result !='exit'){    this.formdataNew.emit(result);  }
    });
  }
}




@Component({
  selector: 'sharedFormSettingsFunctions',
  templateUrl: 'sharedForm.SettingsFunctions.component.html',
})
export class SharedFormSettingsComponent implements OnInit {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {
      //text : any, //Injected is data from survey.component.ts
    }, 
    public dialogRef: MatDialogRef<SharedFormSettingsComponent>,
    private _service: SharedFormService,
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
        var file: File = $event.target.files[0];
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => {
          console.log('ANSWERS FILE HANDLER, json detected and loaded, now erasing current answer data en replacing with loaded answer data')
          this._service.EraseAllAnswerData(); 
          let jsontext = String(fileReader.result); //het is een string (nl json) maar moet ook gecast worden als string omdat anders JSON.parse niet werkt
          this._service.StoreAnswers( JSON.parse(jsontext)  )
          this.dialogRef.close("StartOfQuestionnaire"); //close dialog and send fingerpint data back
        }; 
    }
  }
  //Save Question Answers to local file, in json
  AnswersSave(){
    let a = JSON.stringify( this._service.GetAnswers() );
    var blob = new Blob([a], {type: "application/json;charset=utf-8"});
    saveAs(blob, "Answers.json");
    this.dialogRef.close('exit'); //close and send data back
  }
  //restart questionnaire, at first question
  restartQ(){
    this._service.EraseAllAnswerData(); //erase answers
    this.dialogRef.close("StartOfQuestionnaire"); //close dialog and send fingerpint data back
  }
  eraseAll(){
    this._service.clearStorage();
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
          this._service.clearStorage();
          let jsontext = String(fileReader.result); //het is een string (nl json) maar moet ook gecast worden als string omdat anders JSON.parse niet werkt
          this._service.StoreQuestionairreAllQsArray(JSON.parse(jsontext));
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
    selector: '[SharedFormSettingsFormValidator][formControl]', //input field that has the validator
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => SharedFormSettingsFormValidator), multi: true }
    ]
})
export class SharedFormSettingsFormValidator implements Validator {
    constructor( private _service: SharedFormService ){ }

    //validate(c: AbstractControl): { [key: string]: any } {
    validate(c: FormControl) {
        if (c.value.length >= 3){
            // see if value exist in store, otherwise return false
            if(this._service.FormCachedData(String(c.value)) == null){
                return { FPotherValidator: false  } //NOT validated
            }
            else{ return null } //validated!
        }
        else{  return { FPotherValidator: false  }  } //NOT validated
    }
}

