import { CommonModule } from '@angular/common';
import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './http.interceptor';

//Dynamic components for results
import { DCMainComponent, DCDirective } from './dc.survey.component'; //main dynamic components/directive
import { Script } from './scriptloader';
import { SurveyComponent } from './survey.component';

//theming
import { MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatToolbarModule, MatOptionModule, MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatSelectModule, MatInputModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule, MatListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent, FPFormValidator } from './settings-dialog.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRoutingModule, //routingProviders, routingModules, resultComponent 
  } from './survey-routing';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Survey basic modules, other modules are loaded via survey-routing
import { SurveyService } from './surveyservice';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MaterialDesignFrameworkModule, 
        JsonSchemaFormService, FrameworkLibraryService, WidgetLibraryService, MaterialDesignFramework
  } from 'angular7-json-schema-form';

@NgModule({ 
  declarations: [ SurveyComponent, FPFormValidator, 
                  DialogComponent,
                  DCMainComponent, DCDirective,
                ],
  imports: [  CommonModule,
              MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatToolbarModule, MatOptionModule, MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatSelectModule, MatInputModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule, MatListModule,
              //BrowserAnimationsModule,
              FormsModule, ReactiveFormsModule,
              FlexLayoutModule,
              MatExpansionModule,
              HttpClientModule,
              AppRoutingModule,
              LocalStorageModule.withConfig({
                prefix: 'llqsurvey',
                storageType: 'localStorage',
                notifyOptions : {setItem: true, removeItem:true}
              }),
              MaterialDesignFrameworkModule,
              //ZIE FOR JSONSCHEMA FORM https://github.com/dschnelldavis/angular2-json-schema-form/issues/189
              // niet meer voor 7?: https://www.npmjs.com/package/angular7-json-schema-form
              /*{
                ngModule: JsonSchemaFormModule,
                providers: [
                  JsonSchemaFormService,
                  FrameworkLibraryService,
                  WidgetLibraryService,
                  {provide: Framework, useClass: MaterialDesignFramework, multi: true}
                ]
              },*/
            ],
  providers:[ SurveyService, 
            Script,
              { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi:true },
            ],
  entryComponents: [DialogComponent, DCMainComponent],
})
export class SurveyModule {
}