import { Component, OnInit } from '@angular/core';
import { ConceptualizeService } from './conceptualizeservice';
import { MatButton } from '@angular/material';
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//Routing
import { Router } from '@angular/router';

@Component({
    selector: 'displaytable-app',
    template: `<a mat-raised-button routerLink='/conceptualize/texteditor'>Display - Return to editor</a>
    <button mat-raised-button color="secondary" mat-button (click)="sendToDatabase()">Save in Db</button>
    <button mat-raised-button color="secondary" mat-button (click)="sendToClassify()">Classify</button>
    <button mat-raised-button color="secondary" mat-button (click)="showLatestClassification()">Show Latest (test)</button>
    <button mat-raised-button color="secondary" mat-button (click)="downloadLatestPdf()">Download Latest (pdf)</button>
    <br>
      <div id="tablediv"></div>
    `,
    //de 'white-space in the styles is to preserve line breaks
    styles: [`
      div{
        white-space: pre-wrap;
        overflow: auto; 
        height:400px;
      }
    `],
})
export class DisplayTableComponent implements OnInit  {
    constructor(
        private _CService: ConceptualizeService,
        private router: Router,
    ){}

    ngOnInit() {
      //start to wipe storage, TODO, MAKE BUTTON TO CHOOSE WHETHER TO WIPE OR TO CONTINUE
       var textToEdit = this._CService.getText();
       //generate array from text
       textToEdit = this._CService.textToArray(textToEdit);
       //make two dimensional array
       textToEdit = this._CService.oneToTwoArrayDimensions(textToEdit);
       //build table from two dimensional array
       this.createTable(textToEdit);
    }

    //assumes two dimensionsal table, each element has the row 'text' and 'comment'.
    createTable(tableData:any) {
      var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
      var tableBody = document.createElement('tbody');
  
      tableData.forEach(function(rowData:any) {
        //create for each table recored (first dimension in the array) an row
        var row = document.createElement('tr');
          row.style.borderBottom = '1px solid #ccc'; //voeg een lijn toe onder elke cel
        //HIER KAN EEN CUSTOM COLUMN WORDEN GEMAAKT
        //make for element in an array (the second dimension in the array) a cell in the row
        rowData.forEach(function(cellData:any) {
          var cell = document.createElement('td');
          cell.appendChild(document.createTextNode(cellData));
          row.appendChild(cell);
        });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableBody);
    //document.body.appendChild(table);
    document.getElementById("tablediv").appendChild(table); 
  }
  //Store each paragraph and title in database
  sendToDatabase(){
    this._CService.insertIntoDatabase();
    this.router.navigate(['/conceptualize'])
  }
  //send to Watson to conceptualize TODO: wait circle.
  sendToClassify(){
    if(this._CService.classify()) {
      console.log("Classificatie done")
      this.showLatestClassification();
    }
  }
  //to work with classifications ...
  showLatestClassification(){
    var Classifications = this._CService.getClassifiedDocs();
    let a = Object.keys(Classifications).length;
		var twoDimensionalArray = new Array(a); //array met juiste lengte
    
    for(var k in Classifications) {if (Classifications.hasOwnProperty(k)) {
      twoDimensionalArray[k] = new Array(2);
      twoDimensionalArray[k][0] = Classifications[k]['text'];

      twoDimensionalArray[k][1] = 'Class_with_confidence_rounded_up\n'; //initialize
      //if confidence is HIGH, only show this (to check)
      if(Classifications[k]['classes'][0]['confidence'] > 0.9){
        twoDimensionalArray[k][1] = Classifications[k]['top_class']; continue;
        }
      else{
          //put all classes with confidence, rounded up.
          for(var i in Classifications[k]['classes']) {if (Classifications[k]['classes'].hasOwnProperty(i)) {
            twoDimensionalArray[k][1] += Classifications[k]['classes'][i]['class_name'];
            twoDimensionalArray[k][1] += ': ';
            twoDimensionalArray[k][1] += Math.ceil(Classifications[k]['classes'][i]['confidence'] * 1000) / 1000 ;
            twoDimensionalArray[k][1] += '\n';
          }}
        }
    }}

    //DISPLAY
    document.getElementById("tablediv").innerHTML = 'RESULT\n\n';
    
    this.createTable(twoDimensionalArray);
    //SHOW RAW DATA PRETTY PRINTED
    //document.getElementById("tablediv").innerHTML += JSON.stringify( Classifications, null, '\t' );
  }
  downloadLatestPdf(){
    var Classifications = this._CService.getClassifiedDocs();
    let a = Object.keys(Classifications).length;
		var tableData = new Array(a); //array met juiste lengte
    for(var k in Classifications) {if (Classifications.hasOwnProperty(k)) {
      tableData[k] = new Array(2);
			tableData[k][0] = Classifications[k]['text'];
			tableData[k][1] = Classifications[k]['top_class'];;
    }}
    
    pdfMake.createPdf(this.buildPdfContent(tableData)).download();
  }

  //build PDF, with styling and all, based on an array that should be converted into text table.
  buildPdfContent(tableData:Array<any>){
    console.log(tableData)
    return {
      content: [
        {text: 'Tables', style: 'header'},
        'Conceptualized contracts will help you work faster.',
        {text: 'A simple table based on the raw data, the service will deliver an array of raw data therefore styling can be done anyway you like.', style: 'subheader'},
        'Left is the contract text, right column is for concepts found. Not all clauses will have a concept yet.',
        {
          style: 'tableExample',
          table: {
              body: tableData
/*            body: [
              ['Column 1', 'Column 2', 'Column 3'],
              ['One value goes here', 'Another one here', 'OK?']
            ] */
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
  }
}