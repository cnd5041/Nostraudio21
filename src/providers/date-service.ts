import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  zeroOutTime(date): Date {
    date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  maxOutTime(date): Date {
    date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(0);
    return date;
  }

  subtractDays(date, num): number {
    var newDate = new Date(date);
    return newDate.setDate(date.getDate() - num);
  }

  subtractMonths(date, num): number {
    var newDate = new Date(date);
    return newDate.setMonth(date.getMonth() - num);
  }

  subtractYears(date, num): number {
    var newDate = new Date(date);
    return newDate.setFullYear(date.getFullYear() - num);
  }

  getMonthLabel(i: number): string {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return months[i];
  }

  getHourLabel(i: number): string {
    let hours = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am',
      '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
    return hours[i];
  }

  treatAsUTC(date: any): any {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  daysBetween(startDate: number, endDate: number): number {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;

    return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  }

}
