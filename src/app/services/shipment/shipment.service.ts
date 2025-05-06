import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipment } from 'src/app/models/shipment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  private apiUrl = `${environment.apiBaseUrl}/shipments`;

  constructor(private http: HttpClient) { }

  getShipment(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/get-shipment/${id}`);
  }

  getAllShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.apiUrl}/get-all-shipments`);
  }

  addShipment(formData: FormData): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.apiUrl}/add-shipment`, formData);
  }

  updateShipment(id: number, formData: FormData): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.apiUrl}/update-shipment/${id}`, formData);
  }

  deleteShipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-shipment/${id}`);
  }

  downloadShipmentFile(shipmentId: number, fileType: string): Observable<Blob> {
    const url = `${this.apiUrl}/${shipmentId}/download/${fileType}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
