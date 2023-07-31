import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product/product';
import { Shop } from '../shop/shop';
import { ProductService } from '../product/product.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: Product = {} as Product;
  shops: Shop[] = [];
  originalShop?: Shop = {} as Shop;

  constructor(
    private productService: ProductService,
    private shopService: ShopService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.shopService.getAllShops("", "", 0, 9999).subscribe(
      (data: { shops: Shop[]; pagination: any }) => {
        this.shops = data.shops;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des boutiques :', error);
      }
    );

    const productIdParam = this.route.snapshot.paramMap.get('id');
    const productId = productIdParam ? parseInt(productIdParam, 10) : null;
    
    if (productId !== null) {
      this.productService.getProductById(productId).subscribe(
        (product: Product) => {
          this.product = product; 
          this.originalShop = product.shop;
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des détails du produit :', error);
        }
      );
    } else {
      console.error('Erreur lors de la récupération de l\'id du produit');
    }
  }

  onSubmit(): void {
    this.productService.getAllProducts().subscribe(
      (data: { products: Product[]; pagination: any; }) => {
        const existingProduct = data.products.find(product => product.name === this.product.name);
        if (existingProduct != null && existingProduct.name != this.product.name) {
          this.openSnackBar('Le nom du produit existe déjà. Veuillez en choisir un autre.', 'Fermer');
          return;
        }

        this.productService.updateProduct(this.product).subscribe(
          () => {
            this.openSnackBar('Produit modifié avec succès', 'Fermer');
            this.router.navigate(['/products']);
          },
          (error: any) => {
            console.error('Erreur lors de la modification du produit :', error);
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
      verticalPosition: 'bottom',
    });
  }
}