import { Component, Input, OnInit, Pipe } from '@angular/core';
import { MatButton, MatFormField, MatFormFieldControl, MatHint, MatInput, MatSlider } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedFormService } from '../+sharedForm/sharedForm.service';

@Component({
    templateUrl:'drmethods.result.component.html',
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
export class ResultDrmethodsComponent implements OnInit {
    @Input() data: any; 
    public ResultNumber: number = 50;
    public uai_cl : number = 50;
    public uai_de : number = 50;
    public pref_cl : number = 50;
    public pref_de : number = 50;
    public yourFPKey : any; //your = Claimant= _cl
    public othersFPKey : any; //other = Defendant = _de

    public FPotherForm: FormGroup;
    public FPother: FormControl;
    public FPdoNothing : FormControl;

    constructor(
        private _service: SharedFormService,
    ){ }
    
    ngOnInit() {
        if(this.data != null) {
            this.yourFPKey = this.data[2];
            this.initializeGlobalsClaimant(this.data[0].split(",")[0].replace("[","").replace("]",""))
            //create form for other fingerprint
            this.createFormControls();
            this.createForm();
        }
    }
    
    createFormControls() {
        this.FPother = new FormControl('', [
            Validators.required,
        ]);
        this.FPdoNothing = new FormControl({value: this.yourFPKey, disabled: true}, []);
    }
    
    createForm() {
        this.FPotherForm = new FormGroup({
            FPother: this.FPother,
        });
    }
    FPotherFormOnSubmit(){
        //get the answer from local storage
        let answer:String = String(this._service.GetResultById(String(this.FPotherForm.value['FPother'])));
        //in case answer is found, update graphs
        if(answer != null) {
            answer = answer.split(",")[0].replace("[","").replace("]","");
            console.log('FP was correct, charts will be updated with ', answer);
            this.initializeGlobalsDefendant(answer);
        }
        else{//simulating an forms error
            this.FPother.errors['FPotherValidator'] = true; 
            console.error("No data for fingerprint found, FP was ", this.FPotherForm.value['FPother'])
            return;
        } 
    }
    
    initializeGlobalsClaimant(drpMethod:any){
        this.uai_cl = drpMethod.substring(drpMethod.length-2);
        let pref = drpMethod.substring(0,drpMethod.length-2);
        switch (pref) {
            case "MethodNegotiation": this.pref_cl = 20; break;
            case "MethodMediation": this.pref_cl = 40; break;
            case "MethodArbitration": this.pref_cl = 60; break;
            case "MethodLitigation": this.pref_cl = 80; break;
        }
        this.setdata();
    }
    initializeGlobalsDefendant(drpMethod:any){
        console.log("Defendant Google charts started: ", drpMethod)
        this.uai_de = drpMethod.substring(drpMethod.length-2);
        let pref = drpMethod.substring(0,drpMethod.length-2);
        switch (pref) {
            case "MethodNegotiation": this.pref_de = 20; break;
            case "MethodMediation": this.pref_de = 40; break;
            case "MethodArbitration": this.pref_de = 60; break;
            case "MethodLitigation": this.pref_de = 80; break;
        }
        this.setdata();
    }
    // ------ GAUGE - CLOCK -  UAI -----------
    public gauge_type : string = "Gauge";
  
    public gauge_ChartData : any; //will be initialized in setdata function
  
    public gauge_ChartOptions = {
          width: 400, height: 120,
          redFrom: 75, redTo: 100,
          yellowFrom: 25, yellowTo: 75,
          greenFrom: 0, greenTo: 25,
          minorTicks: 5
    };
  
    setdata(){
        let uaidiff = this.diff(+this.uai_cl, +this.uai_de)
        let prefdiff = this.diff(+this.pref_cl, +this.pref_de)
        let totaldiff = this.diff(+uaidiff, +prefdiff);
        this.gauge_ChartData = [
            ['Label', 'Value'],
            ['UAI', uaidiff],
            ['Preference', prefdiff],
            ['Average', totaldiff] //Google Gauge chart for unknown reasons need to have at least 3 charts, or empty table cell will occure
        ];

        let prefaverage = Number (this.average(+this.pref_cl,+this.pref_de ) );
        let uaiaverage =  Number (this.average(+this.uai_cl,+this.uai_de ) );
        let totalaverage = this.average(+prefaverage,+uaiaverage );
        this.ResultNumber = Number (totalaverage);
    }
  
    //CALC difference between numbers
    diff(a:number,b:number){return Math.abs(a-b);}
    average(x:number,y:number){return((x+y)/2).toFixed(2)}
}


/** 
 * CUSTOM VALIDATOR TO CHECK IF FINGERPRINT WOULD RESULT TO AN ANSWER
 */
import { Directive, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[FPotherValidator][formControl]', //input field that has the validator
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => FPotherValidator), multi: true }
    ]
})
export class FPotherValidator implements Validator {
    constructor( private _service: SharedFormService ){ }

    //validate(c: AbstractControl): { [key: string]: any } {
    validate(c: FormControl) {
        if (c.value.length >= 3){
            // see if value exist in store, otherwise return false
            if(this._service.GetResultById(String(c.value)) == null){
                return { FPotherValidator: false  } //NOT validated
            }
            else{ return null } //validated!
        }
        else{  return { FPotherValidator: false  }  } //NOT validated
    }
}