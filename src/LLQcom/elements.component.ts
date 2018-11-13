import { Component, Inject } from '@angular/core';
import { MatButton, MatDivider, MatIcon, MatMenu} from '@angular/material';

/**
 * MAIN MENU, LINKS, TOP PAGE AND FOOTER
 */
@Component({
  selector: 'menu-main',
  template: `
  <div fxLayout="row" fxLayoutAlign="space-between">
    <button mat-button color="primary" [matMenuTriggerFor]="menuAbout">About</button>
      <mat-divider [vertical]="true"></mat-divider>
    <a [routerLink]=" ['legal-advice']" title="Juridisch advies" mat-button color="primary">Advice</a>
      <mat-divider [vertical]="true"></mat-divider>
    <a [routerLink]=" ['kb']" title="Contact details" mat-button color="primary">Knowledge bank</a>
  </div>
  <mat-menu #menuAbout="matMenu" [overlapTrigger]="false"><about_component></about_component></mat-menu>
`,
//styles: [``],
}) export class MenuMainComponent {}

/**
 * MENU FOOTER, LINKS TO PAGE
 */
@Component({
  selector: 'menu-footer',
  template: `

  <div id="menuFooter" fxLayout="row wrap" fxLayoutAlign="center" >
  <a title="Homepage Legal LinQ" [routerLink]=" ['./']" class="text-light">Home</a>
  <a title="Privacy statement" [matMenuTriggerFor]="menuPrivacy" class="text-light" style="text-decoration:underline;">Privacy statement</a>
  <a title="Informatie about Legal LinQ" [matMenuTriggerFor]="menuAbout" class="text-light" style="text-decoration:underline;">About Legal LinQ</a>
  <a title="Contact details" [routerLink]=" ['./contact']" class="text-light">Contact</a>
  </div> 
  <mat-menu #menuPrivacy="matMenu" [overlapTrigger]="false"><privacy_component></privacy_component></mat-menu>
  <mat-menu #menuAbout="matMenu" [overlapTrigger]="false"><about_component></about_component></mat-menu>
`,
  styles: [`
    #menuFooter a{
      cursor:pointer;
      margin:5px;
    }
  `],
}) export class MenuFooterComponent {}


/**
 * MOBILE MENU
 */
@Component({
  selector: 'menu-mobile',
 // styles: [``],
  template: `
  <!-- BEGIN VAN HET DROPDOWN MENU -->
  <!-- dit moet in hoofdbalk om menu te openen
  <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>menu</mat-icon> </button>
  -->
      <a mat-menu-item [routerLink]=" ['./'] " ><mat-icon>home</mat-icon></a>
      <a mat-menu-item [routerLink]=" ['./contact']"><mat-icon>person outline</mat-icon></a>
      <a mat-menu-item [matMenuTriggerFor]="menuAbout">About us</a> 
          <mat-menu #menuAbout="matMenu" [overlapTrigger]="false"><about_component></about_component></mat-menu>
      <a mat-menu-item [routerLink]=" ['./legal-advice'] ">Advice</a>
      <a mat-menu-item [routerLink]=" ['./kb'] ">Knowledge bank</a>
      `,
 }) export class MenuMobileComponent {}

/**
 * ABOUT COMPONENT
 */
@Component({
  selector: 'about_component',
  styles: [`
    a:link, a:visited {
      color:inherit;
    }
  `],
  template: `
  <p>Legal LinQ is a boutique legal firm specialised in legal risks of business partnerships.</p>
  <p>We are located in Haarlem, the Netherlands, however advise online also.</p>
  `,
}) export class AboutComponent {}

/**
 * PRIVACY statement COMPONENT
 */
@Component({
  selector: 'privacy_component',
  template: `
  <h3>Privacy statement</h3>
  <p>This website uses cookies of Google Analytics. Please see their <a href="http://www.google.nl/intl/nl/policies/privacy/" target="_blank">privacy statement</a>.</p>
  <p>We do not store data from you through cookies other than as is necessary for the well functioning of this website.</p>
`,
}) export class PrivacyComponent {}

/**
 * PARTNERSCHAP COMPONENT
 */
@Component({
  selector: 'partnerschap_component',
  templateUrl: 'elements.Partnerschap.html',
}) export class PartnerschapComponent {}


/**
 * CONTACT COMPONENT
 */
@Component({
  selector: 'contact_component',
  templateUrl: 'elements.Contact.html',
}) export class ContactComponent {}

/**
 * Juridisch advies
 */
@Component({
  selector: 'JuridischAdvies',
  templateUrl: 'elements.JurAdvies.html',
}) export class JuridischAdviesComponent {}