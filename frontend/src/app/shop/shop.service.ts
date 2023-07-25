import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Shop } from './shop'

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:8080/api/shops'

  constructor(private http: HttpClient) { }

  getAllShops(sortBy?: string, sortOrder?: string, currentPage?: number, pageSize?: number, search?: string): Observable<{ shops: Shop[], pagination: any }> {
    let params = new HttpParams();

    if (sortBy) {
      params = params.append('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.append('sortOrder', sortOrder);
    }
    if (currentPage) {
      params = params.append('page', currentPage);
    }
    if (pageSize) {
      params = params.append('size', pageSize);
    }
    if (search) {
      params = params.append('search', search);
    }

    return this.http.get<{ shops: Shop[], pagination: any }>(this.apiUrl, { params: params });
  }

  getShopById(shopId: number): Observable<Shop> {
    const url = `${this.apiUrl}/${shopId}`;
    return this.http.get<Shop>(url);
  }

  createShop(newShop: Shop): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, newShop);
  }

  updateShop(updatedShop: Shop): Observable<Shop> {
    const url = `${this.apiUrl}/${updatedShop.id}`;
    return this.http.put<Shop>(url, updatedShop);
  }  

  deleteShop(shop: Shop): Observable<void> {
    const url = `${this.apiUrl}/${shop.id}`;
    return this.http.delete<void>(url);
  }
}
