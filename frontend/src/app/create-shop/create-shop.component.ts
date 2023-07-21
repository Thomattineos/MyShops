import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css'],
})
export class CreateShopComponent {
  shop: Shop = {} as Shop;

  constructor(private shopService: ShopService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(shopForm: NgForm): void {
    const openingTime = this.parseTime(this.shop.openingHours);
    const closingTime = this.parseTime(this.shop.closingHours);

    if (openingTime > closingTime) {
      this.openSnackBar('L\'horaire d\'ouverture doit être inférieur à l\'horaire de fermeture', '');
      return;
    }

    this.shopService.getAllShops().subscribe(
      (shops: Shop[]) => {
        const existingShop = shops.find(shop => shop.name === this.shop.name);
        if (existingShop) {
          this.openSnackBar('Le nom de la boutique existe déjà. Veuillez en choisir un autre.', '');
          return;
        }

        this.shopService.createShop(this.shop).subscribe(
          () => {
            this.openSnackBar('Boutique créée avec succès', '');
            this.router.navigate(['/shops']);
          },
          (error: any) => {
            console.error('Erreur lors de la création de la boutique :', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des boutiques :', error);
      }
    );
  }

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/shops']);
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    });
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
