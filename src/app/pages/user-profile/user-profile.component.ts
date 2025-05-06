import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Incoterm } from 'src/app/models/shipment';
import { ShipmentService } from 'src/app/services/shipment/shipment.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  shipmentForm!: FormGroup;
  incotermList: string[] = [];

  constructor(private fb: FormBuilder, private shipmentService: ShipmentService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.incotermList = Object.values(Incoterm);
    this.initForm();
  }

  initForm(): void {
    this.shipmentForm = this.fb.group({
      client: ['', Validators.required],
      poids: [0, [Validators.required, Validators.min(0)]],
      volume: [0, [Validators.required, Validators.min(0)]],
      provenance: ['', Validators.required],
      incoterm: ['', Validators.required],
      magasinCale: ['', Validators.required],
      confirme: [false],
      motifModification: [''],
      estimatedDeparture: ['', Validators.required],
      estimatedArrival: ['', Validators.required],

      blFile: [null],
      blFinalFile: [null],
      collisageFile: [null],
      factureFile: [null],
    });
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.shipmentForm.patchValue({ [field]: file });
    }
  }

  onSubmit(): void {
    const formData = new FormData();
  
    const formatToISOString = (date: Date) => {
      return new Date(date).toISOString(); // "2025-04-23T00:00:00.000Z"
    };

    // Build the shipment DTO as a plain JS object
    const shipmentDto = {
      client: this.shipmentForm.value.client,
      poids: this.shipmentForm.value.poids,
      volume: this.shipmentForm.value.volume,
      provenance: this.shipmentForm.value.provenance,
      incoterm: this.shipmentForm.value.incoterm,
      magasinCale: this.shipmentForm.value.magasinCale,
      confirme: this.shipmentForm.value.confirme,
      motifModification: this.shipmentForm.value.motifModification,
      estimatedDeparture: formatToISOString(this.shipmentForm.value.estimatedDeparture),
  estimatedArrival: formatToISOString(this.shipmentForm.value.estimatedArrival),
      userId: this.shipmentForm.value.userId,
    };
  
    // Append the shipment DTO as a JSON string
    formData.append('shipment', new Blob([JSON.stringify(shipmentDto)], { type: 'application/json' }));
  
    // Append the files only if they exist
    if (this.shipmentForm.value.blFile) {
      formData.append('blFile', this.shipmentForm.value.blFile);
    }
    if (this.shipmentForm.value.blFinalFile) {
      formData.append('blFinalFile', this.shipmentForm.value.blFinalFile);
    }
    if (this.shipmentForm.value.collisageFile) {
      formData.append('collisageFile', this.shipmentForm.value.collisageFile);
    }
    if (this.shipmentForm.value.factureFile) {
      formData.append('factureFile', this.shipmentForm.value.factureFile);
    }
  
    if (this.shipmentForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    
    this.shipmentService.addShipment(formData).subscribe({
      next: (response) => {
        console.log('Success response:', response);
        this.toastr.success('Shipment added successfully.');
        this.shipmentForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error from shipmentService:', error);
        this.toastr.error('Something went wrong.');
      }
    });
    
  }
  
  

}
