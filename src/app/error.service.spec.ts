import { HttpErrorResponse } from '@angular/common/http';

import { Component} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router'
import {  NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isExportDeclaration } from 'typescript';
import { ErrorModalComponent } from './error-modal/error-modal.component';
// import { RouterTestingModule } from '@angular/router/testing';

import { ErrorService } from './error.service';



describe('ErrorService', () => {
  let service: ErrorService;
  let routerSpy: any

  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;

  beforeEach( async() => {
    routerSpy     = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      declarations: [
        ErrorModalComponent
      ],
      providers: [ 
        NgbActiveModal,
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        NgbModule
      ]
    }).compileComponents();
    service = TestBed.inject(ErrorService);
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(ErrorModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should display a specific error message', () => {
    const params = { title: "Invalid credentials", message: "Check your username and password" }
    const ref = service.displayError( params )

    expect(  ref.componentInstance.title ).toEqual( params.title )
    expect(  ref.componentInstance.message ).toEqual( params.message )
    ref.close()
  });

  it('smart management error', () => {
    const response = new HttpErrorResponse({ status: 400, statusText: "Bad request", error: { message: "Foobar" } })
    const { title, message } = service.getErrorText({response: response})
    expect( title ).toBeUndefined()
    expect( message ).toEqual("Foobar")

    const ref = service.displayError({response: response})
    expect(  ref.componentInstance.title ).toEqual( title )
    expect(  ref.componentInstance.message ).toEqual( message )
    ref.close()
  });

  it('no internet connection error', () => {
    const response = new HttpErrorResponse({ status: 0, statusText: "Unknown error" })
    const { title, message } = service.getErrorText({response: response})
    expect( title ).toBeUndefined()
    expect( message ).toEqual("Check your internet connection.")

    const ref = service.displayError({response: response})
    expect(  ref.componentInstance.title ).toEqual( title )
    expect(  ref.componentInstance.message ).toEqual( message )
    ref.close()
  });

  it('other error', () => {
    const response = new HttpErrorResponse({ status: 500, statusText: "Internal Server Error" })
    const { title, message } = service.getErrorText({response: response})
    expect( title ).toEqual("Internal Server Error")
    expect( message ).toEqual("Please report this error to Smart Management")

    const ref = service.displayError({response: response})
    expect(  ref.componentInstance.title ).toEqual( title )
    expect(  ref.componentInstance.message ).toEqual( message )
    ref.close()
  });


  it('unauthenticated error ', () => {
    const response = new HttpErrorResponse({ status: 403, statusText: "Forbidden" })
    const { title, message } = service.getErrorText({response: response})
    expect( title ).toBeUndefined()
    expect( message ).toEqual("You must be logged in to do that")

    const ref = service.displayError({response: response})
    expect(  ref.componentInstance.title ).toEqual( title )
    expect(  ref.componentInstance.message ).toEqual( message )

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'])
    ref.close()
  });

});


