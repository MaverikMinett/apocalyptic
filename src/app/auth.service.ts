import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import * as md5 from 'md5'
import { Md5 } from 'ts-md5/dist/md5';

import { environment } from '../environments/environment'
import { Subject } from "rxjs"

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiPath:string = `${environment.apiRoot}/users/auth`


  constructor( private http: HttpClient, private jwtHelper: JwtHelperService ) { 
 
  }

  get user():string {
    return localStorage.getItem( "user" )
  }

  login( username: string, password: string ) {

    const md5 = new Md5();
    const hashed = md5.appendStr(password.trim()).end()
    // const hashed = md5(password.trim())
    const data = { username: username.trim(), password_hash: hashed }

    console.log( data )

    let subject = new Subject()
    let observable = subject.asObservable()

    this.http.post( this.apiPath, data ).subscribe(
      
      (response:{token:string}) => {
        localStorage.setItem( "user" , username )
        localStorage.setItem( "token", response.token)
        subject.next(username)
       
      },
      
      (response) => {
        subject.error(response)
      }

    )

    return observable
  }


  logout() {
    localStorage.removeItem( "user" ); 
    localStorage.removeItem( "token" ); 
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token")
    return token ? ! this.jwtHelper.isTokenExpired(token) : false
  }

}
