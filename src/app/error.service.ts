import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from './error-modal/error-modal.component'


export interface ErrorParameters {
  title?:string,
  message?:string,
  response?:HttpErrorResponse
}


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private modal: NgbModal, private router: Router ) {

  }

  getErrorText( params: ErrorParameters ) {
    let title, message

    if ( params.response ) {

      if ( params.response.status == 403 ) {
        message = "You must be logged in to do that"
      } 
      
      else if ( params.response.status == 0 ) {
        message = "Check your internet connection."
      }
      else if ( params.response.error?.message ) {
        message = params.response.error.message
      }
      else {
        title = params.response.statusText
        message = "Please report this error to Smart Management"
      }
    }

    /* allow user to specify title and message, over-riding defaults */
    if ( 'title' in params ) title = params.title
    if ( 'message' in params ) message = params.message

    return { title: title, message: message }
  }

  displayError( params:ErrorParameters ) {

    let notAuthenticated = false

    if ( params.response?.status == 403 ) {
      notAuthenticated = true
    } 

    const { title, message } = this.getErrorText( params ) 
    const ref = this.modal.open(ErrorModalComponent, { centered: true, backdrop: 'static' });
    ref.componentInstance.title = title
    ref.componentInstance.message = message


    /* If the user is not authenticated then their session has timed out, send them
    back to the login screen in addition to displaying the error modal */
    if ( notAuthenticated == true ) {
      this.router.navigate(['/login'] )
    }

    return ref
  }


}
