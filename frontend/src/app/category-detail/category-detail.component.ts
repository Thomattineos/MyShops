import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product/product';
import { ProductService } from '../product/product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  categoryId: number = 0;
  category: Category = {} as Category;
  products: Product[] = [];
  dialogRef: any;
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  search: string = '';

  constructor(private route: ActivatedRoute, private productService: ProductService, private categoryService: CategoryService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
      this.getProductsByCategoryId();
    });
  }

  getCategoryDetails(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (category: Category) => {
        this.category = category;       
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de la catégorie :', error);
        this.openSnackBar('Les détails de la catégorie n\'ont pas pu être récupérés', 'Fermer');
      }
    );
  }

  getProductsByCategoryId(): void {
    this.categoryService.getProductsByCategoryId(this.categoryId, this.sortBy, this.sortOrder, this.currentPage, this.pageSize, this.search).subscribe(
      (data: { products: Product[]; pagination: any }) => {
        this.products = data.products;
        this.totalPages = data.pagination.totalPages;
        this.totalElements = data.pagination.totalElements;        
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits associés à la catégorie :', error);
        this.openSnackBar('Les produits associés n\'ont pas pu être récupérés', 'Fermer');
      }
    );
  }

  removeProduct(product: Product): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir retirer le produit ' + product.name + ' de la catégorie ' + this.category.name + ' ?' }
    });
  
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.category.products?.splice(this.category.products.indexOf(product), 1);
        this.categoryService.updateCategory(this.category).subscribe(
          () => {
            this.getProductsByCategoryId();
            this.openSnackBar('Produit retiré avec succès de la catégorie', 'Fermer');
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des produits associés à la catégorie :', error);
            this.openSnackBar('Erreur lors du retrait du produit', 'Fermer');
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

  searchProducts(): void {
    this.currentPage = 0;
    this.getProductsByCategoryId();
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

    this.getProductsByCategoryId();
  }

  goToPage(currentPage: number, pageSize: number) {
    if (currentPage >= 0 && currentPage <= this.totalPages) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getProductsByCategoryId();
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
              this.category.products = selectedProducts;                           
              this.categoryService.updateCategory(this.category).subscribe(
                () => {
                  this.getProductsByCategoryId();
                  this.openSnackBar('Produits ajoutés avec succès dans la catégorie', 'Fermer');
                },
                (error: any) => {
                  this.openSnackBar('Erreur lors de l\'ajout des produits', 'Fermer');
                }
              );
            }
        });
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits sans catégorie associée :', error);
      }
    );
  }

  onRowClick(event: Event, productId: number) {
    const isDeleteButtonClicked = (event.target as HTMLElement).closest('.delete-button');
    
    if (!isDeleteButtonClicked) {
      this.router.navigate(['/products', productId]);
    }
  }
}
