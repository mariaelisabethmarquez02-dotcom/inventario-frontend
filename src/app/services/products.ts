import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Products {

  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // Consumo de la API de productos
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  createProduct(product: any): Observable<any> {
  return this.http.post(this.apiUrl, product);
}

updateProduct(id: number, product: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, product);
}

deleteProduct(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

  // Consumo de la IA
  getAIAnalysis(products: any[]): Observable<any> {

    return this.http.post(
      'http://localhost:3000/ai/analysis',
      {
        products: products
      }
    );

  }

}