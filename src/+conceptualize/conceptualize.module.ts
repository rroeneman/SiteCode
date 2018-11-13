import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './http.interceptor';

//Component, Service and Storage
import { ConceptualizeComponent } from './conceptualize.component';
import { EditTextComponent } from './edittext-conceptualize.component';
import { DisplayTableComponent } from "./displaytable-conceptualize.component";
import { CSVWatsonImportComponent } from './CSVwatsonImport.component';
import { ConceptualizeService } from './conceptualizeservice';
import { LocalStorageModule } from 'angular-2-local-storage';
import { Script } from './conceptualize-scriptloader';
import { DCMainComponent, DCDirective, DCDataComponent, DynamicContentService } from './dc.conceptualize-contracts.component';

//Routing
import { RouterModule, Routes } from '@angular/router';
let appRoutes: Routes = [
  { path: '', component: ConceptualizeComponent },
  { path: 'texteditor', component: EditTextComponent },
  { path: 'displaytable', component: DisplayTableComponent },
  { path: 'csvimport', component: CSVWatsonImportComponent },
];

//theming
import { MatButtonModule, MatSelectModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({ 
  declarations: [ ConceptualizeComponent, EditTextComponent, DisplayTableComponent, CSVWatsonImportComponent,
                  DCMainComponent, DCDataComponent, DCDirective],
  imports: [ CommonModule,
            HttpClientModule,
             MatButtonModule, MatSelectModule, MatProgressSpinnerModule,
             //BrowserAnimationsModule,
             FormsModule,
             LocalStorageModule.withConfig({
                prefix: 'conceptualize',
                storageType: 'localStorage'
              }),
             RouterModule.forChild(appRoutes)
             ],
  providers:[ 
              DynamicContentService, 
              Script, 
              ConceptualizeService,
              { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi:true }
   ],
  entryComponents: [ DCMainComponent, DCDataComponent ]
})
export class ConceptualizeModule {
}