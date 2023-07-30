import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CreateShopComponent } from './create-shop/create-shop.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';

const routes: Routes = [
  { path: 'shops', component: ShopListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'createShop', component: CreateShopComponent },
  { path: 'editShop/:id', component: EditShopComponent },
  { path: 'createProduct', component: CreateProductComponent },
  { path: 'editProduct/:id', component: EditProductComponent },
  { path: 'createCategory', component: CreateCategoryComponent },
  { path: 'editCategory/:id', component: EditCategoryComponent },
  { path: 'shops/:id', component: ShopDetailComponent },
  { path: '', redirectTo: 'shops', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
