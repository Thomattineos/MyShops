import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Shop } from './shop'

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:8080/api/shops'

  constructor(private http: HttpClient) { }

  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl)
  }
}
