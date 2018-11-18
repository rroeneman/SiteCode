import { Component } from '@angular/core';

@Component({
  templateUrl:'drIMI.entry.component.html',
  styleUrls:['drIMI.entry.component.css'],
})
export class EntrydrIMIComponent {
  //data FROM SharedFormComponent  
  public currentFingerprintKey:any;
  public previousQuestionFingerprint: any;
  public progressIndicator: number = 0;
  public showResult:boolean = false;
  //data SEND TO SharedFormComponent  
  public formdataToSharedForm:any = null;
  //other values
  public backButtonActive:boolean = false;

 //update current fingerprint
  FingerprintKeyChange(fingerprint:any){ this.currentFingerprintKey = fingerprint; }
  //Put form data received to the SharedForm, to be handled directly as formdata
  handleFormdataNew(formdata:any){ this.formdataToSharedForm = formdata;  }
  //SharedForm signals all questions are asked and answered and ready to show result
  showResultsActivedBySharedForm(show:boolean){this.showResult = show;}
  //Set the previous question fingerprint variable, for back button
  setPreviousQuestionFingerprint(fp:any){ this.previousQuestionFingerprint=fp; }
  //Set the progressindicator variable, to show progress in questions
  setProgressIndicator(i:number){
    //timeout needed for back button, because of this: https://blog.angular-university.io/angular-debugging/
    let global = this;  setTimeout(function(){ 
      global.progressIndicator = i; 
      if(global.formdataToSharedForm != 'resetValue') global.formdataToSharedForm = 'resetValue'; //reset formdataToSharedForm
      if(i==0 || i==undefined){global.backButtonActive = false} else{global.backButtonActive = true;}
    }, 30);  
    
  }
  //back buttons
  backToQuestions() { this.showResult = false; this.backOneQuestion(); }
  backOneQuestion() { this.formdataToSharedForm = this.previousQuestionFingerprint; } //will be picked up by setter, but need to reset formdataToSharedForm every time!
}