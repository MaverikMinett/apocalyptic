import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms'

import { of } from 'rxjs';
import { UserService } from '../user.service';
import { ProgressBarService } from '../progress-bar.service';

import {By} from '@angular/platform-browser';

import { EditUserComponent } from './edit-user.component';
import { NgbModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';


import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, DateParserFormatter }  from '../date.service'

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  let httpClientSpy: any

  let userService = jasmine.createSpyObj('UserService', ['retrieveCurrentUser', 'update'] )
  let retrieveSpy, updateSpy

  let progressService = jasmine.createSpyObj('ProgressBarService', ['show', 'hide'] )

  const fakeData = 
    { username: 'testuser1', first_name: 'Test', last_name: 'User1', date_of_birth: '2021-01-01 00:00:00', email: 'test@example.com' }

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','patch','delete']);

    userService   = jasmine.createSpyObj('UserService', ['retrieveCurrentUser', 'update'] )
    retrieveSpy = userService.retrieveCurrentUser.and.returnValue(of({...fakeData}))
    updateSpy   = userService.update.and.returnValue(of())

    progressService = jasmine.createSpyObj('ProgressBarService', ['show', 'hide'] )


    await TestBed.configureTestingModule({
      declarations: [ EditUserComponent ],
      providers: [ 
        { provide: ProgressBarService, useValue: progressService },
        { provide: UserService, useValue: userService  },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: NgbDateAdapter, useClass: DateAdapter },
        { provide: NgbDateParserFormatter, useClass: DateParserFormatter }
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        NgbModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current user', () => {
    component.getItem()
    expect(retrieveSpy).toHaveBeenCalled();

    fixture.detectChanges()
    expect( component.item ).toEqual(fakeData)
  })

  it('should populate the form', async () => {
    component.item = {...fakeData}
    fixture.detectChanges()

    await fixture.whenStable()

    expect( fixture.debugElement.nativeElement.querySelector('.username').innerHTML ).toEqual(fakeData.username)
    expect( fixture.debugElement.nativeElement.querySelector('.realname').innerHTML ).toEqual(fakeData.first_name + " " + fakeData.last_name)
    expect( fixture.debugElement.nativeElement.querySelector('input[name="email"]').value ).toEqual(fakeData.email)
    expect( fixture.debugElement.nativeElement.querySelector('input[name="date_of_birth"]').value ).toEqual('01/01/2021')
  })

  it('should open the date-picker', async () => {
    component.item = {...fakeData}
    fixture.detectChanges()

    await fixture.whenStable()

    fixture.debugElement.nativeElement.querySelector('.btn.calendar').click()
    fixture.detectChanges()

    const dpInput = fixture.debugElement.query(By.directive(NgbInputDatepicker)).injector.get(NgbInputDatepicker);
    expect(dpInput.isOpen()).toBeTrue()
  })

  it('should update the field when a date is picked', async () => {
    component.item = {...fakeData}
    fixture.detectChanges()

    await fixture.whenStable()

    fixture.debugElement.nativeElement.querySelector('.btn.calendar').click()
    fixture.detectChanges()

    fixture.debugElement.nativeElement.querySelectorAll('.ngb-dp-day')[13].click();  // 10 Jan 2021

    const dpInput = fixture.debugElement.query(By.directive(NgbInputDatepicker)).injector.get(NgbInputDatepicker);
    expect(dpInput.isOpen()).toBeFalse()
    

    expect( fixture.debugElement.nativeElement.querySelector('input[name="date_of_birth"]').value ).toEqual('01/10/2021')
    expect( component.item.date_of_birth ).toEqual('2021-01-10 00:00:00')
    
  })


  it('should display an error if a future date is entered', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()
    await fixture.whenStable()

    const dateInput = fixture.debugElement.nativeElement.querySelector('input[name="date_of_birth"]')

    let date = new Date()
    date.setDate(date.getDate() + 1)
    dateInput.value = date.toLocaleDateString("en-US")
    dateInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable()

    const error = dateInput.closest('.form-group').querySelector('.invalid-feedback p')
    expect( error.innerHTML ).toEqual("Birthday cannot be greater than today")
  })

  it('should display an error if the date field is empty', async () => {
    component.item = {...fakeData }
    fixture.detectChanges();
    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="date_of_birth"]')

    input.value =  ""
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable()

    const error = input.closest('.form-group').querySelector('.invalid-feedback p')
    expect( error.innerHTML ).toEqual("Birthday is required")
    
  })

  it('should display an error if the email is invalid', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()
    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="email"]')
    input.value = "invalid/email"
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable()

    const error = input.closest('.form-group').querySelector('.invalid-feedback p')
    expect( error.innerHTML ).toEqual("Must be a valid email address")
  })

  it('should display an error if the email is empty', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()
    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="email"]')
    input.value = ""
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable()

    const error = input.closest('.form-group').querySelector('.invalid-feedback p')
    expect( error.innerHTML ).toEqual("Email is required")
  })

  it('should submit the form', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()
    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="email"]')
    input.value = "new@example.com"
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    spyOn(component, 'submit')

    fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click()
    await fixture.whenStable()

    expect( component.submit ).toHaveBeenCalled()
  })

  it('should call service on submit', () => {
    component.item = {...fakeData }
    fixture.detectChanges()

    component.submit()
    
    expect(userService.update).toHaveBeenCalled()
  })

  it('update progress bar on submit', () => {
    component.item = {...fakeData }
    fixture.detectChanges()

    component.submit()
    
    expect(progressService.show).toHaveBeenCalled()
    expect(progressService.hide).toHaveBeenCalled()
  })


  it('should have a disabled submit button if the form is not dirty', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()

    await fixture.whenStable()


    expect( fixture.debugElement.nativeElement.querySelector('button[type="submit"]').hasAttribute('disabled') ).toBeTrue()
  })


  it('should enable the submit button if the form is dirty', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()

    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="email"]')
    input.value = "new@example.com"
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect( fixture.debugElement.nativeElement.querySelector('button[type="submit"]').hasAttribute('disabled') ).toBeFalse()
  })

  it('should disable the submit button if the form is not valid', async () => {
    component.item = {...fakeData }
    fixture.detectChanges()

    await fixture.whenStable()

    const input = fixture.debugElement.nativeElement.querySelector('input[name="email"]')
    input.value = ""
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect( fixture.debugElement.nativeElement.querySelector('button[type="submit"]').hasAttribute('disabled') ).toBeTrue()
  })


});

