import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Location } from '../models/location.model';

const API = 'https://rickandmortyapi.com/api/location';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);

  getAll(page: number): Observable<ApiResponse<Location>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Location>>(API, { params });
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${API}/${id}`);
  }

  getInfoCount(): Observable<number> {
    return this.http
      .get<ApiResponse<Location>>(API, { params: { page: 1 } })
      .pipe(map((res) => res.info.count));
  }
}
