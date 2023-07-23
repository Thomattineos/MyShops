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

  getAllShops(sortBy?: string, sortOrder?: string): Observable<Shop[]> {
    let params = new HttpParams();

    if (sortBy && sortOrder) {
      params = params.append('sortBy', sortBy);
      params = params.append('sortOrder', sortOrder);
    }

    return this.http.get<Shop[]>(this.apiUrl, { params: params });
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
