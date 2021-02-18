import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';


import { LoginComponent } from './login.component';
import { Subject } from 'rxjs'

/* local dependencies */
import { AuthService } from '../auth.service'

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceStub = {
    loginSubject: new Subject(),
    login: function() {},
  }

  let httpClientSpy: any
  let routerSpy: any

  beforeEach(async () => {


    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','patch','delete']);
    routerSpy     = jasmine.createSpyObj('Router', ['navigate'])

    authServiceStub = {
      loginSubject: new Subject(),
      login: function() { return this.loginSubject.asObservable() },
    } 

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [ 
        { provide: HttpClient, useValue: httpClientSpy, deps: [] },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        FormsModule,
        CommonModule,
        RouterTestingModule,
      ]
    })

    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call the service when the form is submitted', () => {
    spyOn( authServiceStub, 'login' ).and.callThrough()

    component.model.username = 'testuser';
    component.model.password = 'testpass';
    component.submit()

    expect( authServiceStub.login ).toHaveBeenCalled();
  });


  it('should navigate to another page when login is successful', () => {


    spyOn( authServiceStub, 'login' ).and.callThrough()

    component.model.username = 'testuser';
    component.model.password = 'testpass';
    component.submit()

    expect( authServiceStub.login ).toHaveBeenCalled();

    authServiceStub.loginSubject.next({ token: 'RANDOM'});
    expect( routerSpy.navigate ).toHaveBeenCalledWith(["home"])
  });
  


});
