import { DetailsComponent } from './components/details/details.component';
import { IndexSearchComponent } from './components/index-search/index-search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsSectionComponent } from './components/results-section/results-section.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchBarComponent
  },
  {
    path: 'results',
    component: ResultsSectionComponent
  },
  {
    path: 'index',
    component: IndexSearchComponent
  },
  {
    path: 'details',
    component: DetailsComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
