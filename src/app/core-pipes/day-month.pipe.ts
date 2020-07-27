import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dayMonth'
})
export class DayMonthPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    const date = moment(value).format("DD MMMM");
    return date;
  }

}
