import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  host: { 'class': 'error-modal' }
})
export class ErrorModalComponent implements OnInit {

  title: string
  message: string

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
