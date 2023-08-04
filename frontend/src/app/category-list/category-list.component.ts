import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  dialogRef!: any;
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  search: string = '';

  constructor(private categoryService: CategoryService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getAllCategories(this.sortBy, this.sortOrder, this.currentPage, this.pageSize, this.search)
      .subscribe(data => {
        this.categories = data.categories;
        this.totalPages = data.pagination.totalPages;
        this.totalElements = data.pagination.totalElements;
      });
  }

  createCategory(): void {
    this.router.navigate(['/createCategory']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/editCategory', category.id]);
  }

  deleteCategory(category: Category): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir supprimer la catégorie ' + category.name + ' ?' }
    });
  
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.categoryService.deleteCategory(category).subscribe(
          () => {
            this.getCategories();
            this.openSnackBar('Catégorie supprimée avec succès', 'Fermer');
          },
          (error: any) => {
            this.openSnackBar('Erreur lors de la suppression da la catégorie', 'Fermer');
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

  searchCategories(): void {
    this.currentPage = 0;
    this.getCategories();
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

    this.getCategories();
  }

  goToPage(currentPage: number, pageSize: number) {
    if (currentPage >= 0 && currentPage <= this.totalPages) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getCategories();
    }
  }

  onRowClick(event: Event, categoryId: number) {
    const isDeleteButtonClicked = (event.target as HTMLElement).closest('.delete-button');
    
    if (!isDeleteButtonClicked) {
      this.router.navigate(['/categories', categoryId]);
    }
  }
}
