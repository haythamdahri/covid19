import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private static API = 'https://restcountries.eu/rest/v2/all';
  private static API_COUNTRY_BY_NAME = 'https://restcountries.eu/rest/v2/name';

  constructor(private http: HttpClient) {
  }

  getCountries(region: string = null) {
    return this.http.get<any>(CountriesService.API).pipe(
      map((response) => {
        // Filter by region if exists
        if( region != null ) {
          const filter = region == 'North America' || region == 'South America' ? 'Americas' : region;
          return response.filter(row => row.region == filter);
        } else {
          return response;
        }
      })
    );
  }

  getCountry(alpha2Code: string) {
    return this.http.get<any>(`${CountriesService.API_COUNTRY_BY_NAME}/${alpha2Code}?fullText=true`);
  }

}
