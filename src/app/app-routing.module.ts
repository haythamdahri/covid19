import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CountriesComponent} from './countries/countries.component';
import {CountryDetailsComponent} from './country-details/country-details.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'countries', component: CountriesComponent
  },
  {
    path: 'countries/:code', component: CountryDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
