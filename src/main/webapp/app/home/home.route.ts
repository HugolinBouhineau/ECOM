import { Route } from '@angular/router';

import {CatalogComponent} from "../components/catalog/catalog.component";
import {HomeComponent} from "./home.component";

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};
