import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UpdateShipmentComponent } from 'src/app/pages/update-shipment/update-shipment.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'add-shipment',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'update-shipment/:id',      component: UpdateShipmentComponent}
];
