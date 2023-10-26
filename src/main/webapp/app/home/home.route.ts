import { Route } from '@angular/router';

import {CatalogComponent} from "../components/catalog/catalog.component";

export const HOME_ROUTE: Route = {
  path: '',
  component: CatalogComponent,
  data: {
    pageTitle: 'home.title',
  },
};
