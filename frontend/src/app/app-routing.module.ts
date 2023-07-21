import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CreateShopComponent } from './create-shop/create-shop.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';

const routes: Routes = [
  { path: 'shops', component: ShopListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'createShop', component: CreateShopComponent },
  { path: 'editShop/:id', component: EditShopComponent },
  { path: '', redirectTo: 'shops', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
