import { Component, OnInit } from '@angular/core';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  shops: Shop[] = [];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getShops();
  }

  getShops(): void {
    this.shopService.getAllShops()
      .subscribe(shops => this.shops = shops);
  }
}
