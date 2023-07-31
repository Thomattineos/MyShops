import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Product } from './product';
import { Category } from '../category/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products'

  constructor(private http: HttpClient) { }

  getAllProducts(sortBy?: string, sortOrder?: string, currentPage?: number, pageSize?: number, search?: string): Observable<{ products: Product[], pagination: any }> {
    let params = new HttpParams();

    if (sortBy) {
      params = params.append('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.append('sortOrder', sortOrder);
    }
    if (currentPage) {
      params = params.append('page', currentPage.toString());
    }
    if (pageSize) {
      params = params.append('size', pageSize.toString());
    }
    if (search) {
      params = params.append('search', search);
    }

    return this.http.get<{ products: Product[], pagination: any }>(this.apiUrl, { params: params });
  }

  getProductById(productId: number): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<Product>(url);
  }

  createProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, newProduct);
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    const url = `${this.apiUrl}/${updatedProduct.id}`;
    return this.http.put<Product>(url, updatedProduct);
  }  

  deleteProduct(product: Product): Observable<void> {
    const url = `${this.apiUrl}/${product.id}`;
    return this.http.delete<void>(url);
  }

  getCategoriesByProductId(productId: number, sortBy?: string, sortOrder?: string, currentPage?: number, pageSize?: number, search?: string): Observable<{ categories: Category[], pagination: any }> {
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

    return this.http.get<{ categories: Category[], pagination: any }>(this.apiUrl + "/" + productId + "/categories", { params: params });
  }
}