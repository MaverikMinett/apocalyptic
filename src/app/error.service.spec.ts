import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from './error-modal/error-modal.component';
// import { RouterTestingModule } from '@angular/router/testing';

import { ErrorService } from './error.service';



describe('ErrorService', () => {
  let service: ErrorService;
  let routerSpy: any

  

  beforeEach(() => {
    routerSpy     = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      declarations: [
        ErrorModalComponent
      ],
      providers: [ 
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        NgbModule
      ]
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
