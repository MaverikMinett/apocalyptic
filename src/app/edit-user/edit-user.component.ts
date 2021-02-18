import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from '../error.service';
import { ToastService } from '../toast.service';

import { User } from '../user'
import { UserService } from '../user.service'


import { finalize } from 'rxjs/operators'
import { ProgressBarService } from '../progress-bar.service';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

  item: User 

  today: any

  requestInProgress: boolean = false


  constructor(  private errorService: ErrorService,
                private progress: ProgressBarService,
                private service: UserService, 
                private router: Router,
                private toast: ToastService ) {
    
    var date = new Date();
    var ngbDateStruct = { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear()};

    
    this.today = ngbDateStruct
   }

  ngOnInit(): void {

    /* put this in a time-out to avoid "value changed after checked error"  */
    setTimeout( () => {
      this.getItem()
    })

  }

  getItem() {
    this.progress.show()
    this.requestInProgress = true

        this.service.retrieveCurrentUser( ).pipe(
          finalize( () => { this.progress.hide(); this.requestInProgress = false } )  
        ).subscribe(
          (item:User) => {
            this.item = item
          },
          (response) => {
            
            this.errorService.displayError({response: response})

          }
        );
  }



  submit() {
    this.progress.show()
    this.requestInProgress = true
    this.service.update( this.item.username, {
      date_of_birth: this.item.date_of_birth,
      email: this.item.email
    }).pipe(
      finalize( () => { this.progress.hide(); this.requestInProgress = false } )  
    ).subscribe( 
      (response) => {
        this.toast.show( "Saved", { delay: 1500 } )
        this.router.navigate( ['/home'] )
      },
      (response) => {
        this.errorService.displayError({response: response})
      }
    )
  }


}
