import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserModalComponent } from './user-modal.component';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;

  const fakeData = 
  { username: 'testuser1', first_name: 'Test', last_name: 'User1', date_of_birth: '2021-01-01 00:00:00', email: 'test@example.com' }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModalComponent ],
      imports: [
        NgbModule
      ],
      providers: [
          NgbActiveModal
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the window with use data', async () => {
    component.user = {...fakeData}
    fixture.detectChanges()

    await fixture.whenStable()

    expect( fixture.debugElement.nativeElement.querySelector('.username').innerHTML ).toEqual(fakeData.username)
    expect( fixture.debugElement.nativeElement.querySelector('.realname').innerHTML ).toEqual(fakeData.first_name + " " + fakeData.last_name)
    expect( fixture.debugElement.nativeElement.querySelector('.email').innerText ).toEqual(fakeData.email)
    expect( fixture.debugElement.nativeElement.querySelector('.birthday').innerText.trim() ).toEqual('01/01/2021')
  })

});
