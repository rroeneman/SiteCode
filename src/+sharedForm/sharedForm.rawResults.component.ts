import { Component, OnInit, Input } from '@angular/core';
/**
 * BASIS RESULT MODULE
 */

@Component({
    selector: 'sharedForm-rawResults',
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
export class SharedFormRawResultsComponent implements OnInit  {
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
            this.DataForDocx = JSON.stringify(Object.assign(this.data[1]));
            //this.DataForDocx(this.StoredAnswers);
            console.log("Data voor de Word document.", this.DataForDocx, this.Results)
        }
    }
}