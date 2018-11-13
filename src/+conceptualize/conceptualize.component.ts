import { Component, OnInit } from '@angular/core';
import { MatButton, MatSelect } from '@angular/material';
import { ConceptualizeService } from './conceptualizeservice';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

//Script external
import { Script } from './conceptualize-scriptloader'; //loading the script
declare var mammoth: any;

//Routing
import { Router } from '@angular/router';

@Component({
    selector: 'conceptualize-app',
    template: `<h1>Some html </h1>
    <mat-form-field>
        <mat-select placeholder="ContractType" [(ngModel)]="contractTypeOptionSelected">
            <mat-option *ngFor="let contractTypeOption of contractTypeOptions" [value]="contractTypeOption">{{ contractTypeOption }}</mat-option>
        </mat-select>
    </mat-form-field>
        <br />
        <div [hidden]="!contractTypeOptionSelected"> Select file: <input type="file" id="upload" (change)="MainDocxHandler($event)" /> </div>
        
        <br /><button mat-raised-button color="secondary" mat-button (click)="getRaspTestData()">Test RaspData</button>
        <br />
        <pre>{{raspdata}}</pre>
        <div *ngIf="showspinner"><mat-progress-spinner class="spinner" color="primary" mode="indeterminate" strokeWidth=5 value=80> </mat-progress-spinner></div>
        

    
        <div style="margin-top:100px">
        <p>For <b>admin</b>, <a href="https://web4.shared.hosting-login.net/phpmyadmin/sql.php?server=1&db=legallinqc_3" target="_blank">edit db directly</a>.</p>
        <p>Base <b>contracts</b>, <a href="http://corporate.findlaw.com/contracts.html" target="_blank">findlaw</a>.</p>
        <p>Watson <a href="https://natural-language-classifier-toolkit.eu-gb.bluemix.net/" target="_blank">Conceptualize Tool</a>.</p>
    </div>
    `
})
export class ConceptualizeComponent implements OnInit  {
    private concepts = this._CService.storeConcepts(); //vroegtijdig inladen van alle concepten
    private paragraphHash = this._CService.storeParaHash(); //vroegtijdig inladen van alle paragraph hashes en id's
    public raspdata:any = 'Nog geen data';
    public showspinner:boolean = false;
    constructor(
        private router: Router,
        private _CService: ConceptualizeService,
        private script : Script,
    ){}

    ngOnInit() {}

    getRaspTestData() :void{
        this.raspdata = '';
        this.showspinner = true;
        this._CService.TESTRASB()
            //er kan maar 1 subscription zijn, en die doe je waar de data moet eindigen... hier dus
            .subscribe( result => {this.showspinner = false; this.raspdata = result['data']; },  );
    }

    public contractTypeOptions : Array<string> = [
        'Services',
        'Software development',
        'Land purchase or sale',
        'Clinical trial',
        'Agency',
        'Various',
    ];
    public contractTypeOptionSelected : string;

    //activeert wanneer een document is ingeladen
    MainDocxHandler($event:any): void {
        //check file format, //eerst kijken of het een csv bestand is om in te laden
        if($event.target.files[0].type == 'application/vnd.ms-excel')
            {
                console.log('CSV file gedetecteerd, export van Watson verondersteld')
                //console.log('readThis geactiveerd');
                var file: File = $event.target.files[0];
                var fileReader = new FileReader();
                fileReader.readAsText(file);
                fileReader.onloadend = () => { 
                    this._CService.storeCSV(fileReader.result);
                    this.router.navigate(['/conceptualize/csvimport']);
                }; 
            return;
            }
        else if(
            ($event.target.files[0].type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') &&
            ($event.target.files[0].type !== 'application/msword' ) 
            ){ 
                console.log('Wrong document type: ' +$event.target.files[0].type);
                this.router.navigate(['/404']);   
            }
        //in case of new file upload, erase storage
        this._CService.removeItem();
        //store contract type
        this._CService.storeType(this.contractTypeOptionSelected);
        //store the new document name (will erase the old one)
        this._CService.storeDocName($event.target.files[0].name);
        //load external JS scripts first, then do something
        this.script.load('mammoth', 'ckeditor')
            .then(() => this.upLoadFile($event.target)) //dit is de vervolgactie
            .catch(() => console.log('Script loading voor Conceptualize niet gelukt')); //dit is eventuele foutmelding
    }
    
    //lees bestand in met filereader en 
    upLoadFile(inputValue: any): void {
        //console.log('readThis geactiveerd');
        var file: File = inputValue.files[0];
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = () => { this.parseDocx(fileReader.result) }; //send Arraybuffer to textToArray function
    }
    
    //parse a Docx file to raw text.
    parseDocx(arrayBuffer:any){
        //console.log('parseDocx geactiveerd');
        //https://www.npmjs.com/package/mammoth
        mammoth.extractRawText({arrayBuffer: arrayBuffer}) 
        //mammoth.convertToHtml({arrayBuffer: arrayBuffer})
            .then((result:any) => this.preProcessText(result.value))
            //.then(function(result:any){ 
            //     console.log('Mammoth parser messages: ' + result.messages); 
            //})
            .done();
    }
    
    preProcessText(rawtext:any){
        //remove all instances of 3 lines, to keep text with paragraphs seperated with one blank line
        var countBlankLines = 0;
        do {
            rawtext = rawtext.replace(/\n\n\n/g, '\n\n');
            countBlankLines = (rawtext.match(/\n\n\n/) || []).length;
        }
        while (countBlankLines > 0);

        //remove all multiple spaces
        var countSpaces = 0;
        do {
            rawtext = rawtext.replace(/  /g, ' ');
            countSpaces = (rawtext.match(/  /) || []).length;
        }
        while (countSpaces > 0);

        //TODO: SANATIZER
        //remove "" as we will need those signs for csv files
        rawtext = rawtext.replace(/\"/g, '\'');
        //rawtext = rawtext.replace(/\t/g, 'TABTABTABTAB');
       
        //store
        this._CService.storeTextPersistent(rawtext)
        //navigate to texteditor
        this.router.navigate(['/conceptualize/texteditor'])
    }
}
