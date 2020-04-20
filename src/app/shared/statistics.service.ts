import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, retry} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import StatisticsModel from '../models/statistics.model';
import { compareDate } from './global.functions';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private static API = 'http://covid19.soficoop.com/country';

  constructor(private http: HttpClient, private datepipe: DatePipe) {
  }

  /**
   * Get covid data from API
   * Http Interceptor will perform error in case of unsuccessful operation
   */
  getData(countryCode: string, startDate: Date = null, endDate: Date = null) {
    return this.http.get<{snapshots: Array<StatisticsModel>, name: string, code: string}>(`${StatisticsService.API}/${countryCode}`).pipe(
      map((data) => {
        const desiredDate: Date = new Date();
        desiredDate.setHours(19, 0, 0, 0);
        let snapshots :Array<StatisticsModel> = new Array<StatisticsModel>();
        // Apply range if required
        if( startDate != null && endDate != null ) {
          data.snapshots.forEach((snapshot) => {
            const timestampDate1 = new Date(snapshot.timestamp);
            const timestampDate2 = new Date(snapshot.timestamp);
            // Subtract 24 hours to include end date 
            timestampDate2.setUTCHours(timestampDate2.getUTCHours() - 24);
            if( compareDate(timestampDate1, startDate) >= 0 && compareDate(timestampDate2, endDate) <= 0 ) {
              snapshots = [...snapshots, snapshot];
            }
          });
          data.snapshots = snapshots.slice();
        }
        // Retrieve snapshots of each day at 7 PM
        snapshots = [];
        data.snapshots.forEach((row) => {
          if( new Date(row.timestamp).getHours() == desiredDate.getHours() ) {
            row.timestamp = this.datepipe.transform(row.timestamp, 'dd/MM/yyyy');
            snapshots = [...snapshots, row];
          } 
        });
        // Reverse array to start from first first date
        data.snapshots = snapshots.slice().reverse();
        return data;
      }),
      retry(5)
    );
  }

}
