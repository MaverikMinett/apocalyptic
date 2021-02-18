import { Injectable } from '@angular/core';


import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class DateAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);

      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year.toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})  
                + this.DELIMITER + date.month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) 
                + this.DELIMITER + date.day.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) 
                + " 00:00:00"
                : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class DateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        month : parseInt(date[0], 10),
        day : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) 
      + this.DELIMITER + date.day.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) 
      + this.DELIMITER + date.year.toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false}) : '';
  }
}
