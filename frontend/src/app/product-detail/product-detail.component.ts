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
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product: Product = {} as Product;
  categories: Category[] = [];
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
      this.productId = Number(params.get('id'));
      this.getProductDetails();
      this.getCategoriesByProductId();
    });
  }

  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails du produit :', error);
        this.openSnackBar('Les détail du produit n\'ont pas pu être récupérés', 'Fermer');
      }
    );
  }

  getCategoriesByProductId(): void {
    this.productService.getCategoriesByProductId(this.productId, this.sortBy, this.sortOrder, this.currentPage, this.pageSize, this.search).subscribe(
      (data: { categories: Category[]; pagination: any }) => {
        this.categories = data.categories;
        this.totalPages = data.pagination.totalPages;
        this.totalElements = data.pagination.totalElements;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des catégories associées au produit :', error);
        this.openSnackBar('Les catégories associées n\'ont pas pu être récupérées', 'Fermer');
      }
    );
  }

  removeCategory(category: Category): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir retirer la catégorie ' + category.name + ' du produit ' + this.product.name + ' ?' }
    });
  
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.product.categories?.splice(this.product.categories.indexOf(category), 1);
        this.productService.updateProduct(this.product).subscribe(
          () => {
            this.getCategoriesByProductId();
            this.openSnackBar('Catégorie retirée du produit avec succès', 'Fermer');
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des catégories associées au produit :', error);
            this.openSnackBar('Erreur lors du retrait de la catégorie', 'Fermer');
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

  filterCategories(): void {
    this.currentPage = 0;
    this.getCategoriesByProductId();
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

    this.getCategoriesByProductId();
  }

  goToPage(currentPage: number, pageSize: number) {
    if (currentPage >= 0 && currentPage <= this.totalPages) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getCategoriesByProductId();
    }
  }

  addCategory(): void {
    this.categoryService.getAllCategories("", "", 0, 9999).subscribe(
      (data: { categories: Category[]; pagination: any }) => {
        const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
          width: '40%',
          data: { categories: data.categories }
        });
  
        dialogRef.afterClosed().subscribe((selectedCategories: Category[]) => {
          if (selectedCategories && selectedCategories.length > 0) {
            if (this.product.categories) {
              this.product.categories = this.product.categories.concat(selectedCategories);     
            } else {
              this.product.categories = selectedCategories;
            }         
              this.productService.updateProduct(this.product).subscribe(
                () => {
                  this.getCategoriesByProductId();
                  this.openSnackBar('Catégories ajoutées avec succès au produit', 'Fermer');
                },
                (error: any) => {
                  this.openSnackBar('Erreur lors de l\'ajout des catégories au produit', 'Fermer');
                }
              );
          }
        });
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits sans shop associé :', error);
      }
    );
  }

  onRowClick(event: Event, categoryId: number) {
    const isDeleteButtonClicked = (event.target as HTMLElement).closest('.delete-button');
    
    if (!isDeleteButtonClicked) {
      this.router.navigate(['/categories', categoryId]);
    }
  }
}
