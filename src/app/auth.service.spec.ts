import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs'
import { Md5 } from 'ts-md5/dist/md5';

import { AuthService } from './auth.service';

import { JwtModule, JwtHelperService  } from '@auth0/angular-jwt';
export function tokenGetter() {
  return localStorage.getItem('token');
}


import { environment } from '../environments/environment'



describe('AuthService', () => {
  let service: AuthService;

  let httpClientSpy: any
  let jwtHelperSpy: any


  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','patch','delete']);
    jwtHelperSpy  = jasmine.createSpyObj('jwtHelperService', ['isTokenExpired'])

    localStorage.removeItem('user')
    localStorage.removeItem('token')

    TestBed.configureTestingModule({
      providers: [AuthService,
        { provide: HttpClient, useValue: httpClientSpy, deps: [] },
        { provide: JwtHelperService, useValue: jwtHelperSpy }
      ],
      imports: [ 
          JwtModule.forRoot({
            config: {
              tokenGetter: tokenGetter,
              allowedDomains: environment.domains
            }
          }),
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should send a post request with login credentials', inject([AuthService], (service: AuthService) => {
    let subject = new Subject()
    let observable = subject.asObservable();

    httpClientSpy.post.and.returnValue( observable )

    service.login( 'username', 'password' )

    const md5 = new Md5()
    const hashed = md5.appendStr('password').end()
    expect( httpClientSpy.post ).toHaveBeenCalledWith(
      `${environment.apiRoot}/users/auth`,
      { username: 'username',  password_hash: hashed }
    );
  }));

  it('should not be authenticated', inject([AuthService], (service: AuthService) => {
    expect(service.isAuthenticated()).toBeFalse()
  }));


  it('should set local storage upon authentication', inject([AuthService], (service: AuthService) => {
    let subject = new Subject()
    let observable = subject.asObservable();

    httpClientSpy.post.and.returnValue( observable )

    service.login( 'username', 'password' ).subscribe( 
      (response) => {
        expect( localStorage.getItem('token') ).toEqual( 'stringofcharacters' )
        expect( localStorage.getItem('user') ).toEqual( 'username' )
      }
    )

    subject.next({ token: 'stringofcharacters' })

  }));

  it('should be authenticated', inject([AuthService], (service: AuthService) => {
    let subject = new Subject()
    let observable = subject.asObservable();

    httpClientSpy.post.and.returnValue( observable )
    jwtHelperSpy.isTokenExpired.and.returnValue( false )

    service.login( 'username', 'password' ).subscribe( 
      (response) => {
        expect( service.isAuthenticated() ).toBeTrue()
      }
    )
    subject.next({ token: 'stringofcharacters' })   

  }));

  it('should not be authenticated if token expired', inject([AuthService], (service: AuthService) => {
    jwtHelperSpy.isTokenExpired.and.returnValue( true )

    localStorage.setItem('token', 'stringofcharacters')
    expect( service.isAuthenticated() ).toBeFalse()
  }));

});
