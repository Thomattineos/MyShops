import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../category/category';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent {
  selectedCategories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], message: string }
  ) { }

  onSubmit(): void {    
    this.dialogRef.close(this.selectedCategories);
  }
  
  
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
