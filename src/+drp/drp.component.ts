import { Component, OnInit, Input } from '@angular/core';
import { MatButton, MatTabGroup, MatTab, MatIcon, MatInput, MatFormField, MatDialog, MatDialogRef } from '@angular/material';
import { DRPData } from './drpdata';
import { DRPService } from './drpservice';
import { DialogComponent } from './drp-dialog.component';

//Routing
import { Router } from '@angular/router';

@Component({
  selector: 'drp-app',
  templateUrl: 'drp.component.html',
  styles: [require('./drp.component.css')],
  providers: [],
})

export class DRPComponent implements OnInit {
  public drpdata: DRPData[]; 
  public selectedItem: DRPData;
  public cl_fingerprint:string;
  public de_fingerprint:string;
  selectedIndex:number; //van de tabs, start op nul
    
  constructor(
    private _drpService: DRPService,
    private _router: Router,
    public dialog: MatDialog,
  ) { }
 
 ngOnInit() {
    this.getData("drpdata");
    //ga door bij laatste tab of begin bij UNCITRAL tab
    let tab = this._drpService.getTabStatus('drptab');
    if (tab == null){ 
      this._drpService.setTabStatus('drptab', 3); 
      this.selectedIndex = 3;  
      }//set tab on 0 on first go
    else { this.selectedIndex = Number (tab); }
    //static fingerprint data
    this.cl_fingerprint = '#9KL473LK'
    this.de_fingerprint = '#7EL897KI'
  }
  getData(key:string) {
    this._drpService.getBaseData(key).then(drpdata => this.drpdata = drpdata);
  }
  persistData(key:string) {
    let test = this._drpService.storeToPersist(key,this.drpdata);
  }
  resetData() {
    this._drpService.resetPersist();
    //TODO, RELOAD ORIGINAL DATA, BELOW DOESN'T WORK
  }
 
  //Open popup window en stuur object er naar toe
  openDialog(drpdata:any) {
    //initiate dialogbox and send data
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '324px',
      data: {
        drp: drpdata, //alle data in drpdata
        tab: this.selectedIndex, //index, waarbij: 0 = Claimant, 1 = Defendant, 2 = Analysis
      }
      } );
    //result back
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'exclude') {
        drpdata.status_icon = 'block'; //set checkmark icon
        //use tab selector to see if claimant or defendant provided data
        if (this._drpService.getTabStatus('drptab') == 0) {drpdata.cl_value = 'none (excluded)';}
        else { drpdata.de_value = 'none (excluded)';}
        //TODO, REMOVE VALUE FROM CORRECT DRPDATA...
        this.persistData('drpdata');
      }        
      if(result == 'save') {
        drpdata.status_icon = 'done'; //set checkmark icon
        this.persistData('drpdata'); //store data in localstorage
      }
    });
  }
  
  //Check bij welke tab hij is, 0 = Claimant, 1 = Defendant, 2 = Analysis 
  selectedIndexChange(val :number ){
    this.selectedIndex=val; //for in the page
    this._drpService.setTabStatus('drptab', val); //for persisting outside page
  }
  gotoClaimant(){this.selectedIndex=0;} //2 is index number of analysis tab
  gotoDefendant(){this.selectedIndex=1;} //2 is index number of analysis tab
  gotoAnalysis(){this.selectedIndex=2;} //2 is index number of analysis tab
}