import { Component, OnInit } from '@angular/core';
import { ConceptualizeService } from './conceptualizeservice';
import { MatButton } from '@angular/material';

//Routing
import { Router } from '@angular/router';

@Component({
    selector: 'csv-watson-import',
    template: `<a mat-raised-button routerLink='/conceptualize'>Return to uploading</a>
    <button mat-raised-button color="secondary" mat-button (click)="updateDatabase()">Update Db</button>
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
export class CSVWatsonImportComponent implements OnInit  {
  private concepts: any = this._CService.getConceptsFlatArray();
  private paraHash: any = this._CService.getparaHashArray();
  private arrayToEdit: Array<any> = [];
  
  constructor(
        private _CService: ConceptualizeService,
        private router: Router,
    ){}

    ngOnInit() {
      var textToEdit = this._CService.getCSV();
       //generate array from text
       textToEdit = this.textToArray(textToEdit); //de locale en niet die van de services, die gaat uit van 2 harde returns als scheidingsteken
       //make two dimensional array
       this.arrayToEdit = this._CService.oneToTwoArrayDimensions(textToEdit);
       //find concepts
       this.arrayToEdit = this.conceptFinder(this.arrayToEdit);
       //build table from two dimensional array
       this.createTable(this.arrayToEdit);
    }

    //assumes two dimensionsal table, each element has the row 'text' and 'comment'.
    createTable(tableData:Array<any>) {
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
  updateDatabase(){
    this._CService.updateLinkTable(this.arrayToEdit);
    this.router.navigate(['/conceptualize'])
  }

  textToArray(text:any){
    var oneDimensionalArray = text.split("\n")
    //filter out empty array elements
    oneDimensionalArray = oneDimensionalArray.filter(function(value:any) { if (value) return value;});
    //remove white space at beginning and end of the paragraph
    oneDimensionalArray.forEach(function(value:any, i:number) { oneDimensionalArray[i] = value.trim();});
    //return array
    return oneDimensionalArray;
  } 
  //find the concepts in the string and put in second array element
  //WATCH OUT, only one concept is assumed... this might change...
  conceptFinder(textToEdit:Array<any>){
    console.log('Are paraHash loaded, check hereunder:'); console.log(this.paraHash)
    console.log('Are concepts loaded, check hereunder:'); console.log(this.concepts);
    for (var i = 0; i < textToEdit.length; i++) {
        let paraText :Array<any> = textToEdit[i][0].split(",");
        //cut of last element of array
        let paraTextElement = paraText.pop(); //keep original to attach again if needed
        //strip characters and trim spaces
        let concept = paraTextElement; concept = concept.replace(';', '');  concept = concept.replace(',', ''); concept = concept.trim();
        //match with list of concepts to confirm its a concept, or do nothing and assume no concept was included
        textToEdit[i][3] = Number(this.concepts.indexOf(concept)); //store also the -1 result, used to filter this element out later.
        if(textToEdit[i][3] == -1){
          //put array element back in its place  
          paraText.push(paraTextElement);
        }
        //concept was found, do something
        else{
          //insert concept in textToEdit array
          textToEdit[i][1] = concept;
              //seperate loop for if one concept is found, to find more concepts,
              //seperate because we need to add stuf to array elements instead of creating new array elements
              //we start searching at array element 1, and go up from there every time we find a concept.
              do {
                  if(paraText.length == 0) break; //security, to avoid errors on empty array's
                  //cut of last element of array
                  let paraTextElement = paraText.pop(); //keep original to attach again if needed
                  //strip characters and trim spaces
                  let concept = paraTextElement; concept = concept.replace(';', '');  concept = concept.replace(',', ''); concept = concept.trim();
                  //match with list of concepts to confirm its a concept, or do nothing and assume no concept was included
                  let conceptId:number = this.concepts.indexOf(concept);
                  //if NO concept, break it of here and do noting more (-1 means NO match with concept). For loop will stop.
                  if(conceptId == -1) {
                      //put original concept back in place and break the loop
                      paraText.push(paraTextElement); break;
                  }
                  //insert ID, but now only if this is a positive one
                  textToEdit[i][3] += ','+conceptId; //store also the -1 result, used to filter this element out later.
                  //insert concept in textToEdit array
                  textToEdit[i][1] += ','+concept;
              } while(paraText.length > 1); //do loop really stops at the break, but may stop also when no array elements are there
          }
          //make text whole again, assuming last concept wasn't really a concept, but that is dangerous.
          textToEdit[i][0] = paraText.join(',');
          //strip concept from textToEdit first element
          textToEdit[i][0] = textToEdit[i][0].trim(); //white spaces verwijdered
        //search in database for match of the paragraph, if -1, that element will be filtered out later
        //result is paragraph ID
        textToEdit[i][2] = this.paraHash.indexOf( this._CService.djb2Hash( textToEdit[i][0] ) );
      }
      //filter out array elements without paraID (no reference found in DB)
      textToEdit = textToEdit.filter(function(value:any) { 
            if (value[2] == -1) {console.log('Not in DB, therefore NOT imported: \n' +value[0]) }
            else { return value; }
      });
      //filter out elements without concept
      textToEdit = textToEdit.filter(function(value:any) { 
          if (value[3] == -1) { console.log('NO CONCEPT FOUND paraId:' +value[2]); }
          else{ return value;}
       });
      return textToEdit;
  }
}
