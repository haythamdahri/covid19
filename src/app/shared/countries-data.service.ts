import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CountriesService} from './countries.service';
import {map} from 'rxjs/operators';
import CountryDataModel from '../models/country-data.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesDataService {

  private static API = 'https://coronavirus-19-api.herokuapp.com/countries';

  constructor(private http: HttpClient, private countriesService: CountriesService) {
  }

  getCountriesData() {
    return this.http.get<CountryDataModel[]>(CountriesDataService.API, {responseType: 'json'});
  }

  getRegionsData() {
    return this.http.get<CountryDataModel[]>(CountriesDataService.API, {responseType: 'json'}).pipe(
      map((response) => {
        let data = response.slice(0, 6);
        data = data.map((row) => {
          row.region = ((row.country == 'North America' || row.country == 'South America') ? 'Americas' : row.country);
          return row;
        });
        // Return data
        return data;
      })
    );
  }
}
