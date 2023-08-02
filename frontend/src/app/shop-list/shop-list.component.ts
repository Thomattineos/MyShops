import { Component, OnInit } from '@angular/core';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  shops: Shop[] = [];
  dialogRef!: any;
  sortBy: string = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  search: string = '';

  constructor(private shopService: ShopService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getShops();
  }

  getShops(): void {
    this.shopService.getAllShops(this.sortBy, this.sortOrder, this.currentPage, this.pageSize, this.search)
      .subscribe(data => {
        this.shops = data.shops;
        this.totalPages = data.pagination.totalPages;
        this.totalElements = data.pagination.totalElements;

        for (const shop of this.shops) {
          if (shop.id != undefined) {
            this.shopService.getProductsByShopId(shop.id)
              .subscribe(data => {
                shop.numberOfProducts = data.pagination.totalElements;
              });
          }
        }
      });
  }

  createShop(): void {
    this.router.navigate(['/createShop']);
  }

  editShop(shop: Shop): void {
    this.router.navigate(['/editShop', shop.id]);
  }

  deleteShop(shop: Shop): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir supprimer la boutique ' + shop.name + ' ?' }
    });
  
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.shopService.deleteShop(shop).subscribe(
          () => {
            this.getShops();
            this.openSnackBar('Boutique supprimée avec succès', 'Fermer');
          },
          (error: any) => {
            this.openSnackBar('Erreur lors de la suppression de la boutique', 'Fermer');
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

  filterShops(): void {
    this.currentPage = 0;
    this.getShops();
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

    this.getShops();
  }

  goToPage(currentPage: number, pageSize: number) {
    if (currentPage >= 0 && currentPage <= this.totalPages) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getShops();
    }
  }

  onRowClick(event: Event, shopId: number) {
    const isDeleteButtonClicked = (event.target as HTMLElement).closest('.delete-button');
    
    if (!isDeleteButtonClicked) {
      this.router.navigate(['/shops', shopId]);
    }
  }  
}
