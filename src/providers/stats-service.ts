import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { DateService } from './date-service';
import { IStatsGraphData } from '../models/artist.model';

import * as _ from 'lodash';

interface IStatsRangeChart {
  data: Array<number[]>;
  labels: string[];
}

@Injectable()
export class StatsService {

  constructor(
    private http: Http,
    private dateService: DateService
  ) {

  }

  // getMarketStats(): ng.IPromise<any> {
  //           var defer = this.$q.defer();

  //           this.azureService.getMarketStats().then((results) => {
  //               defer.resolve(results);
  //           }, (error) => {
  //               defer.reject(error);
  //           });

  //           return defer.promise;
  //       }

  getArtistPriceChange(transactions, marketPrice: number) {
    transactions = _.sortBy(transactions, "transactionDate");

    let getRange = (startDate, name) => {
      let rangeProfile = {};
      let range = _.filter(transactions, (transaction: any) => {
        return transaction.transactionDate >= startDate;
      });

      if (range.length > 0) {
        let rangePrices = _.map(range, 'price');
        rangeProfile = RangeProfile(_.min(rangePrices),
          _.max(rangePrices),
          rangePrices[0],
          rangePrices[rangePrices.length - 1],
          graphData[name]
        );
      } else {
        rangeProfile = RangeProfile(marketPrice, marketPrice, marketPrice, marketPrice, graphData[name]);
      }

      return rangeProfile;
    };

    let PriceProfile = (dayRange, fiveDayRange, monthRange, threeMonthRange, yearRange) => {
      return {
        dayRange: getRange(dayRange, 'dayRange'),
        fiveDayRange: getRange(fiveDayRange, 'fiveDayRange'),
        monthRange: getRange(monthRange, 'monthRange'),
        threeMonthRange: getRange(threeMonthRange, 'threeMonthRange'),
        yearRange: getRange(yearRange, 'yearRange')
      }
    };

    let RangeProfile = (rangeMin, rangeMax, rangeStart, rangeEnd, graphData) => {
      return {
        rangeMin: rangeMin,
        rangeMax: rangeMax,
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
        percentChange: Math.round((((rangeEnd - rangeStart) / rangeStart) * 100) * 100) / 100,
        graphData: graphData
      }
    };

    let graphData = this.getGraphData(transactions);

    let today = this.dateService.zeroOutTime(new Date()),
      fiveDayOp = new Date(this.dateService.subtractDays(today, 5)),
      monthOp = new Date(this.dateService.subtractMonths(today, 1)),
      threeMonthOp = new Date(this.dateService.subtractMonths(today, 3)),
      yearOp = new Date(this.dateService.subtractYears(today, 1)),
      priceProfile = PriceProfile(today, fiveDayOp, monthOp, threeMonthOp, yearOp);

    return priceProfile;
  }

  private getGraphData(transactions): IStatsGraphData {
    transactions = _.sortBy(transactions, "transactionDate");

    let dateFormatter = (date) => {
      return (date.getMonth() + 1) + '/' + date.getDate();
    }

    let dayFormatter = (date) => {
      return this.dateService.getHourLabel(date.getHours());
    }

    let yearFormatter = (date) => {
      return this.dateService.getMonthLabel(date.getMonth());
    }

    let getRangeDates = (limit, step) => {
      var range = [],
        //today = dateService.zeroOutTime(new Date());
        today = this.dateService.maxOutTime(new Date());
      range.push(new Date());
      for (var i = 1; i < limit; i += step) {
        range.push(new Date(this.dateService.subtractDays(today, i)));
      }
      return range.reverse();
    }

    let getDayRange = () => {
      var range = [];

      for (var i = 0; i < 24; i += 3) {
        var nDate = this.dateService.zeroOutTime(new Date()),
          cDate = new Date(nDate.setHours(i));
        range.push(cDate);
      }

      return range;
    }

    let getYearRange = () => {
      var range = [],
        today = this.dateService.zeroOutTime(new Date());
      range.push(new Date());
      for (var i = 1; i < 12; i += 1) {
        var cDate = new Date(this.dateService.subtractMonths(today, i));
        cDate = new Date(cDate.getFullYear(), cDate.getMonth() + 1, 0);
        range.push(cDate);
      }
      return range.reverse();
    }

    let getRangeChart = (rangeDates, transactions, formatter, fiveFlag?): IStatsRangeChart => {
      var points = [];

      _.forEach(rangeDates, (rDate, index) => {
        var mTrans = _.filter(transactions, (transaction: any) => {
          return transaction.transactionDate <= rDate;
        });
        points.push({
          pLabel: formatter(rDate),
          price: (mTrans.length > 0) ? mTrans[mTrans.length - 1].price : 0
        });
      });

      return <IStatsRangeChart>{
        data: [_.map(points, 'price')],
        labels: _.map(points, 'pLabel')
      };
    }

    let dayRange = getDayRange(),
      dayData = getRangeChart(dayRange, transactions, dayFormatter);

    let fiveDayRange = getRangeDates(6, 1),
      fiveDayData = getRangeChart(fiveDayRange, transactions, dateFormatter, true);

    let monthRange = getRangeDates(31, 3),
      monthData = getRangeChart(monthRange, transactions, dateFormatter);

    let threeMonthRange = getRangeDates(90, 7),
      threeMonthData = getRangeChart(threeMonthRange, transactions, dateFormatter);

    let yearRange = getYearRange(),
      yearData = getRangeChart(yearRange, transactions, yearFormatter);

    return {
      dayRange: dayData,
      fiveDayRange: fiveDayData,
      monthRange: monthData,
      threeMonthRange: threeMonthData,
      yearRange: yearData
    }
  }

}
