import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../product/product';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ["./add-product-dialog.component.css"]
})
export class AddProductDialogComponent {
  selectedProducts: Product[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[], message: string }
  ) { }

  onSubmit(): void {    
    this.dialogRef.close(this.selectedProducts);
  }
  
  
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
