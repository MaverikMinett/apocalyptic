import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


import { AuthService } from '../auth.service';
import { ErrorService } from '../error.service'

import { finalize } from 'rxjs/operators'
import { ProgressBarService } from '../progress-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model = { username: "", password: "" }

  next  = "home"

  requestInProgress: boolean = false

  constructor( 
    private auth: AuthService, 
    private errorService: ErrorService, 
    private progress: ProgressBarService,
    private router: Router ) { 

  }

  ngOnInit(): void {
    // set the "next" location if one was passed in via the router
    // needs to be fixed, currently will router to "/home" by default
    // console.log( this.router.getCurrentNavigation().extras.state.example )
    // this.route.data.subscribe( (data) => {
    //   console.log( data );
    //   if ( 'next' in data && data['next'] ) this.next = data.next
    // })
  }

  submit():void {
    this.model.username = this.model.username.trim()

    this.progress.show()
    this.requestInProgress = true
    this.auth.login( this.model.username, this.model.password ).pipe( 
      finalize( () => {
        this.progress.hide()
        this.requestInProgress = false
      })
    ).subscribe(
      (response:string) => {
        this.progress.hide()
        this.requestInProgress = false
        this.router.navigate([this.next])
      },
      (response:any) => {
        console.log( response )
        if ( response.status == 403 ) {
          this.errorService.displayError({title: "Invalid Credentials", message: "Check your username and password." } )
        }
        else {
          this.errorService.displayError({ response: response } )
        }
       
      }
    )

    
  }


}
