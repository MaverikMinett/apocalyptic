import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../user';
import { UserService } from '../user.service'



@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  host: { 'class': 'user-modal'}
})
export class UserModalComponent implements OnInit {

  user:User 

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    


  }


  bannerImage() {    
    if ( this.user?.username == "charlie" ) {
      return "url(assets/candy-mountain.jpg)"
    }
    else {
      return `url(assets/${this.user?.username}-banner.svg`
    }
  }
}
