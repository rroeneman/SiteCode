import { Component } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import {MatGridList} from '@angular/material/grid-list';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styles:[` #dashboard-main{ padding-bottom:3em;} `],
})
export class DashboardComponent{}

/**
 * Automated Decision Support explained - the full story
 */
@Component({
    selector: 'ads-explained',
    templateUrl: 'dashboard-ads-explained.html',
    //styles: [``],
  }) export class ADSExplainedComponent {}
/**
 * GENERAL PURPOSE
 */
@Component({
    selector: 'general-purpose',
    templateUrl: 'dashboard-general-purpose.html',
    //styles: [``],
  }) export class GeneralPurposeComponent {}

/**
 * DISPUTE RESOLUTION PROTOTYPES
 */
@Component({
    selector: 'drm-prototypes',
    templateUrl: 'dashboard-drm-prototypes.html',
    //styles: [``],
  }) export class DRMPrototypesComponent {}

