import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private static API = 'https://restcountries.eu/rest/v2/all';

  constructor(private http: HttpClient) {
  }

  getCountries() {
    return this.http.get<any>(CountriesService.API);
  }

}
