import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username:string

  constructor( private auth: AuthService, private router: Router, private toast: ToastService ) { 

  }

  ngOnInit(): void {
    this.username = this.auth.user

  }

  logout() {
    this.auth.logout()
    this.toast.show("Signed out", { delay: 1500 })
    this.router.navigate(['login'])
  }

}
