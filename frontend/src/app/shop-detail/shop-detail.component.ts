import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shop } from '../shop/shop';
import { Product } from '../product/product';
import { ShopService } from '../shop/shop.service';
import { ProductService } from '../product/product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  shopId: number = 0;
  shop: Shop = {} as Shop;
  products: Product[] = [];
  dialogRef: any;
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  search: string = '';
  nbCategories: number = 0;

  constructor(private route: ActivatedRoute, private shopService: ShopService, private productService: ProductService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.shopId = Number(params.get('id'));
      this.getShopDetails();
      this.getProductsByShopId();
    });
  }

  getShopDetails(): void {
    this.shopService.getShopById(this.shopId).subscribe(
      (shop: Shop) => {
        this.shop = shop;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de la boutique :', error);
      }
    );
  }

  getProductsByShopId(): void {
    this.shopService.getProductsByShopId(this.shopId, this.sortBy, this.sortOrder, this.currentPage, this.pageSize, this.search).subscribe(
      (data: { products: Product[]; numberOfCategories: number; pagination: any }) => {
        this.products = data.products;
        this.totalPages = data.pagination.totalPages;
        this.totalElements = data.pagination.totalElements;
        this.nbCategories = data.numberOfCategories;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits de la boutique :', error);
      }
    );
  }

  

  editProduct(product: Product): void {
    this.router.navigate(['/editProduct', product.id]);
  }

  deleteProduct(product: Product): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir supprimer le produit ' + product.name + ' ?' }
    });

    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.productService.deleteProduct(product).subscribe(
          () => {
            this.getProductsByShopId();
            this.openSnackBar('Produit supprimé avec succès', 'Fermer');
          },
          (error: any) => {
            this.openSnackBar('Erreur lors de la suppression du produit', 'Fermer');
          }
        );
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  filterProducts(): void {
    this.currentPage = 0;
    this.getProductsByShopId();
  }

  sort(column: string) {
    if (this.sortBy === column) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else if (this.sortOrder === 'desc') {
        this.sortBy = '';
        this.sortOrder = '';
      }
      else {
        this.sortOrder = 'asc';
      }
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    this.getProductsByShopId();
  }

  goToPage(currentPage: number, pageSize: number) {
    if (currentPage >= 0 && currentPage <= this.totalPages) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getProductsByShopId();
    }
  }

  addProduct(): void {
    this.productService.getAllProducts("", "", 0, 9999).subscribe(
      (data: { products: Product[]; pagination: any }) => {
        const dialogRef = this.dialog.open(AddProductDialogComponent, {
          width: '40%',
          data: { products: data.products }
        });
  
        dialogRef.afterClosed().subscribe((selectedProducts: Product[]) => {
          if (selectedProducts && selectedProducts.length > 0) {
            for (const product of selectedProducts) {
              product.shop = this.shop;              
              this.productService.updateProduct(product).subscribe(
                () => {
                  this.getProductsByShopId();
                  this.openSnackBar('Produits ajoutés avec succès', 'Fermer');
                },
                (error: any) => {
                  this.openSnackBar('Erreur lors de l\'ajout des produits', 'Fermer');
                }
              );
            }
          }
        });
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits sans shop associé :', error);
      }
    );
  }  
}
