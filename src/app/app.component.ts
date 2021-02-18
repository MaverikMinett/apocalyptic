import { Component } from '@angular/core';
import { ProgressBarService } from './progress-bar.service';

import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';

  showProgressBar: Observable<boolean>

  constructor( private progress: ProgressBarService ) {
    this.showProgressBar = this.progress.visible

    // this.progress.visible.subscribe( visible => this.showProgressBar = visible)
  }
}
