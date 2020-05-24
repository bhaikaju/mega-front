import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {environment} from 'src/environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {Observable, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckEmailService {
  SERVER_URL = environment.SERVER_URL;


  constructor(private httpClient: HttpClient) {
  }

  searchEmail(text) {
    return timer(2000)
      .pipe(
        switchMap(() => this.httpClient.get(`${this.SERVER_URL}/users/validate/${text}`)),
      ); // PIPE ENDS HERE
  }


  emailValidate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log(control.value);
      return this.searchEmail(control.value)
        .pipe(
          map((res: { message: string, status: boolean, user: object }) => {
            if (res.status) {
              return {taken: true};
            }
            return null;
          })
        ); // PIPE ENDS HERE
    };
  }
}
