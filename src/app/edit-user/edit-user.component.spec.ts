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


  xit('should display an error if a future date is entered', async () => {

    
  })

  xit('should display an error if the date field is empty', async () => {

    
  })

  xit('should display an error if the email is invalid', async () => {

    
  })

  xit('should display an error if the email is empty', async () => {

    
  })

});

