import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthService } from './auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* JWT */
import { JwtModule } from '@auth0/angular-jwt';
export function tokenGetter() { return localStorage.getItem('token') }

import { environment } from '../environments/environment'
import { UserService } from './user.service';
import { UsersComponent } from './users/users.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { AuthorizedGuard, NotAuthorizedGuard } from './auth.guard'
import { ToastService } from './toast.service';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';

import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, DateParserFormatter }  from './date.service'
import { ProgressBarService } from './progress-bar.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EditUserComponent,
    UsersComponent,
    UserModalComponent,
    ErrorModalComponent,
    ToastsContainerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgbModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.domains
      }
    }),
  ],
  providers: [ 
    AuthService, AuthorizedGuard, NotAuthorizedGuard, ProgressBarService, ToastService, UserService,
    { provide: NgbDateAdapter, useClass: DateAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
