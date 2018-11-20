import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Test1406 overview voorpagina
 */
@Component({
  selector: 'test-first',
  template: `<h1>Test1406</h1>
  <json-schema-form
    [schema]="exampleJsonObject.schema"
    [layout] = "exampleJsonObject.form"
    framework="material-design">
  </json-schema-form>`,
})
export class TestFirstComponent implements OnInit {
  constructor(
    ) {}
    public exampleJsonObject : any;
    
    ngOnInit() {

      this.exampleJsonObject = {"schema":{"type":"object","properties":{"StartOfQuestionnaire":{"type":"array","items":{"type":"string","enum":["a750","c05a","0229","25e0","4ee7","b16e","3cf5"]}}}},"form":[{"key":"StartOfQuestionnaire","ClassName":"Ja"},{"key":"StartOfQuestionnaire","type":"checkboxes","titleMap":[{"value":"a750","name":"ik zie wel mogelijkheden voor een redelijke oplossing"},{"value":"c05a","name":"ik heb belang bij een snelle oplossing"},{"value":"0229","name":"ik heb nog vaker met de andere partij(en) te maken"},{"value":"25e0","name":"ik wil graag een oplossing op maat waar ik zelf invloed op heb"},{"value":"4ee7","name":"het gaat ook om communicatiestoringen"},{"value":"b16e","name":"ik denk dat in mediation ook andere conflicten die ik met de wederpartij heb, kunnen worden opgelost"},{"value":"3cf5","name":"het kan wellicht aanzienlijke (proces)kosten besparen"}]},{"type":"submit","title":"Volgende vraag","onChanges":" ","progressIndicator":"1/3"}]}
/*    
      this.exampleJsonObject = {
        "first_name": "Jane", "last_name": "Doe", "age": 25, "is_company": false,
        "address": {
          "street_1": "123 Main St.", "street_2": "ook iets",
          "city": "Las Vegas", "state": "NV", "zip_code": "89123"
        },
        "phone_numbers": [
          { "number": "702-123-4567", "type": "cell" },
          { "number": "702-987-6543", "type": "work" }
        ], "notes": ""
      };
  */      
    
    }


}

/**
 * Test1406 pagina's gebaseerd op JSON input
 */
@Component({
  selector: 'test-second',
  //templateUrl: 'test.component.html',
  template: ``,
})
export class TestSecondaryComponent implements OnInit, OnDestroy {
  constructor(
    ) {}

    ngOnInit() {
  }

  ngOnDestroy() {
  }
}