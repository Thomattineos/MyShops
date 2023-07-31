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
    originalShop: Shop = {} as Shop;
    shopName: string = "";

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
          this.openSnackBar('Les boutiques n\'ont pas pu être récupérées', 'Fermer');
        }
      );

      const productIdParam = this.route.snapshot.paramMap.get('id');
      const productId = productIdParam ? parseInt(productIdParam, 10) : null;
      
      if (productId !== null) {
        this.productService.getProductById(productId).subscribe(
          (product: Product) => {
            this.product = product;
            this.shopName = product.shop ? product.shop.name : "";
            console.log(this.shopName);
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des détails du produit :', error);
            this.openSnackBar('Les détails du produit n\'ont pas pu être récupérés', 'Fermer');
          }
        );
      } else {
        console.error('Erreur lors de la récupération de l\'id du produit');
        this.openSnackBar('L\'identifiant du produit n\'a pas pu être récupéré', 'Fermer');
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
              this.openSnackBar('Le produit n\'a pas pu être modfifié', 'Fermer');
            }
          );
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des produits :', error);
          this.openSnackBar('Les produits n\'ont pas pu être récupérés', 'Fermer');
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