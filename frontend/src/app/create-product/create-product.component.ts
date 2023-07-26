import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product/product';
import { ProductService } from '../product/product.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  product: Product = {} as Product;

  constructor(private productService: ProductService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(productForm: NgForm): void {
    this.productService.getAllProducts().subscribe(
      (data: { products: Product[]; pagination: any; }) => {
        const existingProduct = data.products.find(product => product.name === this.product.name);
        if (existingProduct) {
          this.openSnackBar('Le nom du produit existe déjà. Veuillez en choisir un autre.', 'Fermer');
          return;
        }

        this.productService.createProduct(this.product).subscribe(
          () => {
            this.openSnackBar('Produit créé avec succès', 'Fermer');
            this.router.navigate(['/products']);
          },
          (error: any) => {
            console.error('Erreur lors de la création du produit :', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits :', error);
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
