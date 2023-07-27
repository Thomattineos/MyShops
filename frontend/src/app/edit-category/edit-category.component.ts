import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  category: Category = {} as Category;

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const categoryIdParam = this.route.snapshot.paramMap.get('id');
    const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : null;
    
    if (categoryId !== null) {
      this.categoryService.getCategoryById(categoryId).subscribe(
        (category: Category) => {
          this.category = category; 
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des détails de la catégorie :', error);
        }
      );
    } else {
      console.error('Erreur lors de la récupération de l\'id de la catégorie');
    }
  }

  onSubmit(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: { categories: Category[]; pagination: any; }) => {
        const existingCategory = data.categories.find(category => category.name === this.category.name);
        if (existingCategory != null && existingCategory.name != this.category.name) {
          this.openSnackBar('Le nom de la catégorie existe déjà. Veuillez en choisir un autre.', 'Fermer');
          return;
        }

        this.categoryService.updateCategory(this.category).subscribe(
          () => {
            this.openSnackBar('Catégorie modifiée avec succès', 'Fermer');
            this.router.navigate(['/categories']);
          },
          (error: any) => {
            console.error('Erreur lors de la modification de la catégorie :', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    );
  }

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/categories']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'bottom',
    });
  }
}