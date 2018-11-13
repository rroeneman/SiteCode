import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpErrorResponse, HttpResponse, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        //HIER WIJZIG JE UITGAANDE HTTP's
        //console.log("processing request", request.url);
        //console.log("body: ", request.body )
        
        return next
        //HIER KIJK JE NAAR SERVER RESPONSES
            .handle(request)
        /*    .do( (ev: HttpEvent<any>) => {
                if(ev instanceof HttpResponse){
                    //hier kun je iets doen
                }
            
                return ev;
            }) */
            .catch(response => {
                if(response instanceof HttpErrorResponse){
                    if (response.error instanceof Error) {
                        console.error('Interceptor: An client side error occurred:', response.error.message);
                    } 
                    else { 
                        console.error(`Interceptor: Backend returned code ${response.status}, body was: ${response.error}`);
                    }
                }
                return Observable.throw(response);
            });
    }
}