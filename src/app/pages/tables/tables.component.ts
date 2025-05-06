import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Shipment } from 'src/app/models/shipment';
import { ShipmentService } from 'src/app/services/shipment/shipment.service';
import { jwtDecode } from "jwt-decode";
import { TokenStorageService } from 'src/app/services/users/token-storage.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  shipments: Shipment[] = [];
  filteredShipments: Shipment[] = [];
  selectedShipmentId: number | null = null;

  showCustomModal = false;
shipmentIdToDelete: number | null = null;

role: string
token: string;
isLoggedIn = false;
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Sorting
  sortColumn: string = '';
  sortDirection: string = 'asc';

  // Search
  searchTerm: string = '';

  constructor(
    private shipmentService: ShipmentService, 
    private router: Router,   
    private toastr: ToastrService,
    private tokenStorage: TokenStorageService
  ) {}

    getDecodedAccessToken(token: string): any {
      try {
        return jwtDecode(token);
      } catch(Error) {
        return null;
      }
    }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.token=sessionStorage.getItem('auth-user')
      const tokenInfo = this.getDecodedAccessToken(this.token);
      this.role = tokenInfo.role;
    }
    this.getAllShipments();
  }

  getAllShipments(): void {
    this.shipmentService.getAllShipments().subscribe((data: Shipment[]) => {
      this.shipments = data;
      console.log(this.shipments);
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredShipments = this.shipments.filter(shipment =>
      Object.values(shipment).some(value =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    this.sortFilteredShipments();
    this.totalPages = Math.ceil(this.filteredShipments.length / this.itemsPerPage);
  }

  get paginatedShipments(): Shipment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredShipments.slice(start, start + this.itemsPerPage);
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortFilteredShipments();
  }

  sortFilteredShipments(): void {
    this.filteredShipments.sort((a, b) => {
      const aValue = (a as any)[this.sortColumn];
      const bValue = (b as any)[this.sortColumn];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getTotalPages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  editShipment(id: number): void {
    this.router.navigate(['/update-shipment', id]);
  }

  openModal(id: number): void {
    this.shipmentIdToDelete = id;
    this.showCustomModal = true;
  }
  
  closeModal(): void {
    this.showCustomModal = false;
    this.shipmentIdToDelete = null;
  }

  getArrivalAlert(arrivalDateStr: string): string | null {
    const today = new Date();
    const arrivalDate = new Date(arrivalDateStr);
  
    today.setHours(0, 0, 0, 0);
    arrivalDate.setHours(0, 0, 0, 0);
  
    const diffInTime = arrivalDate.getTime() - today.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
  
    if (diffInDays === 2) return "Arrivée dans 2 jours";
    if (diffInDays === 1) return "Arrivée dans 1 jour";
    if (diffInDays === 0) return "Arrive aujourd’hui";
    return null;
  }
  
  confirmDelete(): void {
    if (!this.shipmentIdToDelete) return;
  
    console.log("Deleting shipment", this.shipmentIdToDelete);
    this.shipmentService.deleteShipment(this.shipmentIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Envoi supprimé avec succès');
        this.getAllShipments(); // Refresh list
        this.closeModal();
      },
      error: () => {
        this.toastr.error('Erreur lors de la suppression');
        this.closeModal();
      }
    });
  }
  

  viewShipment(shipment: Shipment): void {
    console.log('Viewing shipment:', shipment);
    // Optionally show modal with details
  }

  downloadFile(shipmentId: number, fileType: string): void {
    this.shipmentService.downloadShipmentFile(shipmentId, fileType).subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${fileType}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

