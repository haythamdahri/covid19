import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import StatisticsModel from '../models/statistics.model';
import {catchError, map, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private static API = 'http://covid19.soficoop.com/country';

  constructor(private http: HttpClient) {
  }

  /**
   * Get covid data from API
   * Http Interceptor will perform error in case of unsuccessful operation
   */
  getData(countryCode: string): any {
    return this.http.get<Array<any>>(`${StatisticsService.API}/${countryCode}`);
  }

}
