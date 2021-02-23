import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../user';
import { UserService } from '../user.service';
import { UserModalComponent } from '../user-modal/user-modal.component'

import { finalize } from 'rxjs/operators'
import { ProgressBarService } from '../progress-bar.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  host: { 'class': 'app-users'}
})
export class UsersComponent implements OnInit {

  items: Array<User> = []

  constructor( 
    private service: UserService,
    private progress: ProgressBarService,
    private error: ErrorService,
     private modal: NgbModal ) { 
    
  }


  ngOnInit(): void {
    /* put this in a time-out to avoid "value changed after checked error" from
       the progressbar */
    setTimeout( () => {
      this.getItems()
    })
  }

  getItems() {
    this.progress.show()
    this.service.list().pipe(
      finalize( () => this.progress.hide() )  
    ).subscribe(
      (users:Array<User>) => {
        this.items = users

      },
      (response) => {
        this.error.displayError({response: response})
      }
    );
  }


  open(user:User) {


    this.progress.show()
    this.service.retrieve(user.username).pipe(
      finalize( () => this.progress.hide() )  
    ).subscribe( 
      (user:User) => {
        const ref = this.modal.open(UserModalComponent, { centered: true, backdrop: 'static' });
        ref.componentInstance.user = user
      },
      (response) => {
        this.error.displayError({response: response})
      }
    )

  }

}
