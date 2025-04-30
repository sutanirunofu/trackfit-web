import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IProduct } from 'app/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpService);

  public getAll$(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>("/Product");
  }
}
