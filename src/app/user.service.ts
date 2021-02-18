import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment'

import { Subject, Observable } from 'rxjs'

import { User } from './user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiPath:string = `${environment.apiRoot}/users`

  users: Array<User>


  constructor( private http: HttpClient ) {

  }

  list() {

    if ( ! this.users ) {

      const subject = new Subject()
      const observable = subject.asObservable()

      this.http.get( this.apiPath ).subscribe(
        (users:Array<User>) => {
          this.users = users
          subject.next( users ); subject.complete();
        },
        (response) => {
          subject.error( response )
        }
      )

      return observable
    }
    else {
      const subject = new Subject()
      const observable = subject.asObservable()
      setTimeout( () => { subject.next(this.users); subject.complete(); } )
      return observable
    }
    
  }

  clearUsers() {
    this.users = undefined
  }

  retrieve( username:string ) {
    return this.http.get( `${this.apiPath}/${username}` )
  }

  retrieveCurrentUser() {
    return this.http.get( `${this.apiPath}/current` )
  }

  update( username:string, data:{[key: string]: any} ) {
    return this.http.post( `${this.apiPath}/${username}`, data )
  }

}
