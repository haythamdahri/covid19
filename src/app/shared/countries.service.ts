import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private static API = 'https://restcountries.eu/rest/v2/all';
  private static API_COUNTRY_BY_NAME = 'https://restcountries.eu/rest/v2/name';

  constructor(private http: HttpClient) {
  }

  getCountries() {
    return this.http.get<any>(CountriesService.API);
  }

  getCountry(alpha2Code: string) {
    return this.http.get<any>(`${CountriesService.API_COUNTRY_BY_NAME}/${alpha2Code}?fullText=true`);
  }

}
