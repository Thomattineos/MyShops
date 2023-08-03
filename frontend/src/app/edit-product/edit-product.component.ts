  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { Product } from '../product/product';
  import { Shop } from '../shop/shop';
  import { ProductService } from '../product/product.service';
  import { NgForm } from '@angular/forms';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { ShopService } from '../shop/shop.service';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';

  @Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
  })
  export class EditProductComponent implements OnInit {
    product: Product = {} as Product;
    shops: Shop[] = [];
    originalShop: Shop = {} as Shop;
    productShop: Shop | null = {} as Shop;
    selectedCategories: Category[] | null = [];
    categories: Category[] = [];

    constructor(
      private productService: ProductService,
      private shopService: ShopService, 
      private categoryService: CategoryService,
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

      this.categoryService.getAllCategories("", "", 0, 9999).subscribe(
        (data: { categories: Category[]; pagination: any }) => {
          this.categories = data.categories;
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des catégories :', error);
          this.openSnackBar('Les catégories n\'ont pas pu être récupérées', 'Fermer');
        }
      );

      const productIdParam = this.route.snapshot.paramMap.get('id');
      const productId = productIdParam ? parseInt(productIdParam, 10) : null;
      
      if (productId !== null) {
        this.productService.getProductById(productId).subscribe(
          (product: Product) => {
            this.product = product;
            this.productShop = product.shop;
            this.selectedCategories = product.categories;
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

          this.product.categories = this.selectedCategories;
          

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

    compareShops(shop1: Shop, shop2: Shop): boolean {
      return shop1 && shop2 ? shop1.id === shop2.id : shop1 === shop2;
    }
    
    compareCategories(category1: Category, category2: Category): boolean {
      return category1 && category2 ? category1.id === category2.id : category1 === category2;
    }
  }