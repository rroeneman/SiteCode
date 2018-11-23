import { Component, Inject } from '@angular/core';
import { MatButton, MatDivider, MatIcon, MatMenu} from '@angular/material';

/**
 * MAIN MENU, LINKS, TOP PAGE AND FOOTER
 */
@Component({
  selector: 'menu-main',
  template: `
  <div fxLayout="row" fxLayoutAlign="space-between">
    <button mat-button color="primary" [matMenuTriggerFor]="menuAbout">Over ons</button>
      <mat-divider [vertical]="true"></mat-divider>
    <a [routerLink]=" ['juridisch-advies']" title="Juridisch advies" mat-button color="primary">Advies</a>
      <mat-divider [vertical]="true"></mat-divider>
    <a [routerLink]=" ['kb']" title="Contact gegevens" mat-button color="primary">Kennisbank</a>
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
  <a title="Homepage van Legal LinQ" [routerLink]=" ['./']" class="text-light">Home</a>
  <a title="Privacy statement" [matMenuTriggerFor]="menuPrivacy" class="text-light" style="text-decoration:underline;">Privacy statement</a>
  <a title="Informatie over Legal LinQ" [matMenuTriggerFor]="menuAbout" class="text-light" style="text-decoration:underline;">Over Legal LinQ</a>
  <a title="Contact informatie" [routerLink]=" ['./contact']" class="text-light">Contact</a>
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
      <a mat-menu-item [matMenuTriggerFor]="menuAbout">Over ons</a> 
          <mat-menu #menuAbout="matMenu" [overlapTrigger]="false"><about_component></about_component></mat-menu>
      <a mat-menu-item [routerLink]=" ['./juridisch-advies'] ">Advies</a>
      <a mat-menu-item [routerLink]=" ['./kb'] ">Kennisbank</a>
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
  <p>Legal LinQ is een boutique juridisch adviesbureau gespecialiseerd in zakelijk organisatierecht en geschillenbeslechting.</p>
  <p>Wij zijn gevestigd in Haarlem maar adviseren ook online. Onze <a [routerLink]=" ['kb']" title="Kennisbank partnerschappen">kennisbank</a> helpt u opweg, maar aarzel vooral niet om <a [routerLink]=" ['contact']" title="Contact gegevens">contact</a> op te nemen voor <a [routerLink]=" ['juridisch-advies']" title="Advies">persoonlijk advies</a>.</p>
  <p>De expertise van Legal LinQ brengt passende oplossingen tot stand. Snel, inzichtelijk en duidelijk: voor u en uw bedrijf de grootste zekerheid tegen een redelijk tarief.</p>
  `,
}) export class AboutComponent {}

/**
 * PRIVACY statement COMPONENT
 */
@Component({
  selector: 'privacy_component',
  template: `
  <h3>Privacy statement</h3>
  <p>Deze site gebruikt cookies van Google Analytics. Zie ook het <a href="http://www.google.nl/intl/nl/policies/privacy/" target="_blank">privacy statement</a> van Google.</p>
  <p>Voor het overige verzamelen wij geen gegevens anders dan die noodzakelijk zijn voor het juist functioneren van deze website.</p>
 `,
}) export class PrivacyComponent {}

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
  styles: [`
    #inner div{ padding: 0 5px 0 5px;  }
    main { max-width: 496px; }
  `],
}) export class JuridischAdviesComponent {}