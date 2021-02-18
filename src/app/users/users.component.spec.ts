import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { RouterTestingModule } from '@angular/router/testing';
import { UsersComponent } from './users.component';


import { of } from 'rxjs';
import { UserService } from '../user.service';
import { ProgressBarService } from '../progress-bar.service';




describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let httpClientSpy: any

  let userService = jasmine.createSpyObj('UserService', ['list'] )
  let listSpy 

  let progressService = jasmine.createSpyObj('ProgressBarService', ['show', 'hide'] )

  const fakeData = [
    { username: 'testuser1', first_name: 'Test', last_name: 'User1' },
    { username: 'testuser2', first_name: 'Test', last_name: 'User2' },
    { username: 'testuser3', first_name: 'Test', last_name: 'User3' }
  ]

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','patch','delete']);

    userService   = jasmine.createSpyObj('UserService', ['list'] )
    listSpy = userService.list.and.returnValue(of(fakeData))

    progressService = jasmine.createSpyObj('ProgressBarService', ['show', 'hide'] )

    await TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      providers: [ 
        { provide: ProgressBarService, useValue: progressService },
        { provide: UserService, useValue: userService  },
        { provide: HttpClient, useValue: httpClientSpy },
      ],
      imports: [
        RouterTestingModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the list of users', () => {

    component.getItems()
    expect( listSpy ).toHaveBeenCalled()

    fixture.detectChanges()
    expect( component.items ).toEqual(fakeData)
  });

  it('should display the users', () => {
    component.getItems()
    fixture.detectChanges()
    expect( fixture.debugElement.nativeElement.querySelectorAll('li').length ).toEqual(fakeData.length)
  });

  it('should show/hide the progress bar', () => {
    component.getItems()
    expect( progressService.show ).toHaveBeenCalled()
    expect( progressService.hide ).toHaveBeenCalled()
  })

  it('should open the modal when an item is clicked', () => {
    component.getItems()
    fixture.detectChanges()
    
    spyOn( component, 'open' )
    fixture.debugElement.nativeElement.querySelectorAll('li')[0].click();
    expect( component.open ).toHaveBeenCalledWith( fakeData[0] )
  })

});
