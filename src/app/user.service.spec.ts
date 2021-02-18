import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { UserService } from './user.service';


import { environment } from '../environments/environment'
import { Subject } from 'rxjs';


describe('UserService', () => {
  let service: UserService;
  let apiPath:string = `${environment.apiRoot}/users`
  let httpClientSpy: any

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete'])

    TestBed.configureTestingModule({
        providers: [ UserService,
          { provide: HttpClient, useValue: httpClientSpy }
        ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list', () => {
    const fakeData = [ { username: 'foobar', first_name: 'Foo', last_name: 'Bar' } ]
    
    service.users = undefined
    let subject = new Subject()
    let observable = subject.asObservable();
    httpClientSpy.get.and.returnValue( observable )
    service.list()

    subject.next(fakeData)

    expect( httpClientSpy.get ).toHaveBeenCalledWith( apiPath )
  })

  xit('list should cache values', () => {
    const subject = new Subject()
    const observable = subject.asObservable()

    const fakeData = [ { username: 'foobar', first_name: 'Foo', last_name: 'Bar' } ]

    service.users = undefined
    httpClientSpy.get.and.returnValue( observable )
    service.list().subscribe( () => {
      expect(httpClientSpy.get.calls.count()).toBe(1)
      expect( service.users ).toEqual( fakeData )

      service.list().subscribe( (data) => {
        expect(data).toEqual(fakeData)
        expect(httpClientSpy.get.calls.count()).toBe(1)
      })
    } )
    
    subject.next(fakeData)

  })

  it('it should clearUsers', () => {

    const fakeData = [ { username: 'foobar', first_name: 'Foo', last_name: 'Bar' } ]
    service.users = fakeData

    service.clearUsers()
    expect( service.users ).toBe(undefined)

  })

  it('it should retrieve', () => {

    const fakeData = { username: 'foobar', first_name: 'Foo', last_name: 'Bar' } 
    service.retrieve( fakeData.username )

    expect( httpClientSpy.get ).toHaveBeenCalledWith( `${apiPath}/${fakeData.username}` )

  })

  it('it should retrieveCurrentUser', () => {

    const fakeData = { username: 'foobar', first_name: 'Foo', last_name: 'Bar' } 
    service.retrieveCurrentUser()

    expect( httpClientSpy.get ).toHaveBeenCalledWith( `${apiPath}/current` )

  })

  it('it should update', () => {

    const fakeData = { date_of_birth: '2021-01-01', email: 'test@example.com' } 
    service.update( 'foobar', fakeData )

    expect( httpClientSpy.post ).toHaveBeenCalledWith( `${apiPath}/foobar`, fakeData )

  })

});
