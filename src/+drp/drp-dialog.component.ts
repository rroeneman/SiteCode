import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatSelect } from '@angular/material';

@Component({
  selector: 'drp-dialogbox',
  templateUrl: 'drp-dialog.component.html',
})
export class DialogComponent implements OnInit {
  public Qtable :string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      drp : any, //Injected is data from drp.component.ts
      tab: any, //index, waarbij: 0 = Claimant, 1 = Defendant, 2 = Analysis
    }, 
  ) {}
  ngOnInit() {
    //Check bij welke tab hij is, 0 = Claimant, 1 = Defendant, 2 = Analysis 
    //Provide data for Switch statement, to select correct form
    if (this.data.tab == 0 && this.data.drp.name == 'Procedural preference') { this.Qtable = 'claimant-proc_pref'; };
    if (this.data.tab == 0 && this.data.drp.name == 'Uncertainty Avoidance Index') { this.Qtable = 'claimant-UAI'; };
    if (this.data.tab == 1 && this.data.drp.name == 'Procedural preference') { this.Qtable = 'defendant-proc_pref'; };
    if (this.data.tab == 1 && this.data.drp.name == 'Uncertainty Avoidance Index') { this.Qtable = 'defendant-UAI'; };
  }
}