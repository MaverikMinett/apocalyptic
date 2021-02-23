import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment'

import { Subject, of } from 'rxjs'
import { map } from 'rxjs/operators'

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
    return this.users 
    ? of(this.users)
    : this.http.get<User[]>( this.apiPath ).pipe(
      map( users => this.users = users )
    )
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
