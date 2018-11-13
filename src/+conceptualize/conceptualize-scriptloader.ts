/**
 * see: https://stackoverflow.com/questions/37729896/how-to-load-a-3rd-party-script-from-web-dynamically-into-angular2-component
 * First answer, probably is third answer better but didn't it get to work
 * 
 * UITLEG: 
 * - in module: 
 *      - import: "import { Script } from './drp-scriptloader';"
 *      - voeg toe aan providers: "providers:[ Script],"
 * 
 * - in een compontent: 
 *      - import deze loader: "import { Script } from './drp-scriptloader';"
 *      - in de construct, maak aan variabele aan: "constructor( private script : Script) { }
 *      - in een functie, bijv. oninit, roep het script op (bij de naam) als promise, 
 *          zodat eerst script wordt geladen en dan pas de rest: 
 *              this.script.load('googlechart')
 *                   .then(() => this.loadComponent()) //dit is de vervolgactie
 *                   .catch(() => console.log('Google Chart loading niet gelukt')); //dit is eventuele foutmelding
 * 
 */

 /**
 * SCRIPT STORE, holds all names of the scripts 
 * from example ScriptStore.ts
 */

interface Scripts {
    name: string;
    src: string;
}  
export let ScriptStore: Scripts[] = [
    { name: 'mammoth', src: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js' },
    { name: 'ckeditor', src: 'https://cdn.ckeditor.com/4.7.3/standard/ckeditor.js' }
    ];

/**
 * SCRIPT SERVICE
 * from example script.service.ts
 */
import {Injectable} from "@angular/core";
//import {ScriptStore} from "./script.store";

declare var document: any;

@Injectable()
export class Script {

private scripts: any = {};

constructor() {
    ScriptStore.forEach((script: any) => {
        this.scripts[script.name] = {
            loaded: false,
            src: script.src
        };
    });
}

load(...scripts: string[]) {
    var promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
}

loadScript(name: string) {
    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
        }
        else {
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true, status: 'Loaded'});
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'OnError'});
            document.getElementsByTagName('head')[0].appendChild(script);

            /* SPECIALE FUNCTIE VOOR INLINE SCRIPT */
         //   let script_inline = document.createElement('script');
         //   script_inline.type = 'text/javascript';
         //   script_inline.text = "var googleLoaded = false; var googleChartsPackagesToLoad = ['BarChart', 'Gauge'];";
         //   document.getElementsByTagName('head')[0].appendChild(script_inline);            
        }
    });
}

}