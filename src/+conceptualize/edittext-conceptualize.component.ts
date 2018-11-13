import { Component, OnInit, Input } from '@angular/core';
import { ConceptualizeService } from './conceptualizeservice';
import { MatButton } from '@angular/material';

//Routing
import { Router } from '@angular/router';


@Component({
    selector: 'edittext-app',
    template: `<textarea [(ngModel)]='textToEdit' rows="25" cols="100%" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    <p><button mat-raised-button color="secondary" mat-button (click)="storeText()">Save</button></p>

`
    //styleUrls: ['./app.component.css']
  })
  export class EditTextComponent implements OnInit { 
    public textToEdit:any;
    constructor(
        private _CService: ConceptualizeService,
        private router: Router,
    ){}
    
    ngOnInit() {
        this.textToEdit = this._CService.getText();
        if(this.textToEdit == undefined) this.textToEdit = 'No text in storage';
        //do something with the text, ie mark long paragraphs
        let textarray :Array<any> = this._CService.textToArray(this.textToEdit);
        for (var i = 0; i < textarray.length; i++) {
    			//check string length, als te lang dan melden in tabel
	    		if (textarray[i].length > 1024) textarray[i] = "||" + textarray[i].length + "|| "+ textarray[i];
            }
        //put the array back into text
        this.textToEdit = textarray.join("\n\n");
    }

    storeText(){
        //remove word counts, nl: ||nummers||spatie
        this.textToEdit = this.textToEdit.replace(/(\|\|)(\d+)(\|\|)\s/g, '');
        this._CService.storeTextPersistent(this.textToEdit)
        this.router.navigate(['/conceptualize/displaytable'])
    }
}
