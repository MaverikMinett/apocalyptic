import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  visibleSubject: BehaviorSubject<boolean>
  visible: Observable<boolean>

  constructor() { 
    this.visibleSubject = new BehaviorSubject(false)
    this.visible = this.visibleSubject.asObservable()
  }

  show() {
    this.visibleSubject.next(true)
  }

  hide() {
    this.visibleSubject.next(false)
    
  }
}
