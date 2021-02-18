import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';

import { JwtModule  } from '@auth0/angular-jwt';
export function tokenGetter() {
  return localStorage.getItem('token');
}

import { environment } from '../../environments/environment'



describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let httpClientSpy: any

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','patch','delete']);
    
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [ 
        AuthService, UserService, 
        { provide: HttpClient, useValue: httpClientSpy },
      ],
      imports: [
        NgbModule,
        RouterTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: environment.domains
          }
        }),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
