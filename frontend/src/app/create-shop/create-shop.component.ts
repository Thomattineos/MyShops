import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css']
})
export class CreateShopComponent {
  shop: Shop = {} as Shop

  constructor(private shopService: ShopService, private router: Router, private snackBar: MatSnackBar) { }

  onSubmit(): void {
    this.shopService.createShop(this.shop).subscribe(
      (createdShop: Shop) => {
        this.openSnackBar('Boutique créée avec succès', 'Fermer');
        this.router.navigate(['/shops']);
      },
      (error: any) => {
      }
    );
  }

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/shops']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'bottom',
    });
  }
}

