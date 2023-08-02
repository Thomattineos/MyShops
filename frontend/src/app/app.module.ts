import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopListComponent } from './shop-list/shop-list.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MyMatPaginatorIntl } from './myMatPaginatorIntl/MyMatPaginator';

import { NavbarComponent } from './navbar/navbar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CreateShopComponent } from './create-shop/create-shop.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';
import { TimeFormatDirective } from './directive/time-format.directive';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ShopListComponent,
    NavbarComponent,
    ProductListComponent,
    CategoryListComponent,
    CreateShopComponent,
    ConfirmationDialogComponent,
    EditShopComponent,
    TimeFormatDirective,
    CreateProductComponent,
    EditProductComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    ShopDetailComponent,
    CategoryDetailComponent,
    ProductDetailComponent,
    AddProductDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatListModule,
    MatCheckboxModule
    ],
  providers: [{ provide: MatPaginatorIntl, useClass: MyMatPaginatorIntl }],
  bootstrap: [AppComponent]
})
export class AppModule { }
