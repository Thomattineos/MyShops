import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories'

  constructor(private http: HttpClient) { }

  getAllCategories(sortBy?: string, sortOrder?: string, currentPage?: number, pageSize?: number, search?: string): Observable<{ categories: Category[], pagination: any }> {
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

    return this.http.get<{ categories: Category[], pagination: any }>(this.apiUrl, { params: params });
  }

  getCategoryById(categoryId: number): Observable<Category> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<Category>(url);
  }

  createCategory(newCategory: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, newCategory);
  }

  updateCategory(updatedCategory: Category): Observable<Category> {
    const url = `${this.apiUrl}/${updatedCategory.id}`;
    return this.http.put<Category>(url, updatedCategory);
  }  

  deleteCategory(category: Category): Observable<void> {
    const url = `${this.apiUrl}/${category.id}`;
    return this.http.delete<void>(url);
  }
}