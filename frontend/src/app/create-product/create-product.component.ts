import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product/product';
import { Shop } from '../shop/shop';
import { ProductService } from '../product/product.service';
import { ShopService } from '../shop/shop.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit{
  product: Product = {} as Product;
  shops: Shop[] = [];

  constructor(private productService: ProductService, private shopService: ShopService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.shopService.getAllShops().subscribe(
      (data: { shops: Shop[]; pagination: any }) => {
        this.shops = data.shops;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des boutiques :', error);
      }
    );
  }
  

  onSubmit(productForm: NgForm): void {
    this.productService.createProduct(this.product).subscribe(
      () => {
        this.openSnackBar('Produit créé avec succès', 'Fermer');
        this.router.navigate(['/products']);
      },
      (error: any) => {
        console.error('Erreur lors de la création du produit :', error);
        if (error.status === 400) {
          this.openSnackBar('Le nom du produit existe déjà. Veuillez en choisir un autre.', 'Fermer');
        }
      }
    );
  }
  

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/products']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
