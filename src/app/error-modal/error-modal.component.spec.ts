import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorModalComponent } from './error-modal.component';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorModalComponent ],
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
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate', () => {
    component.title = "Foo"
    component.message = "bar"
    fixture.detectChanges()

    expect( fixture.debugElement.nativeElement.querySelector('.modal-title').innerText ).toEqual("Foo")
    expect( fixture.debugElement.nativeElement.querySelector('.modal-body p').innerText ).toEqual("bar")
  });

});
