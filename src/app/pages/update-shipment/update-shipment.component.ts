import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Incoterm, Shipment } from 'src/app/models/shipment';
import { ShipmentService } from 'src/app/services/shipment/shipment.service';

@Component({
  selector: 'app-update-shipment',
  templateUrl: './update-shipment.component.html',
  styleUrls: ['./update-shipment.component.scss']
})
export class UpdateShipmentComponent implements OnInit {

  shipmentForm!: FormGroup;
  shipmentId!: number;
  incotermList: string[] = [];

  // File variables
  blFile?: File;
  blFinalFile?: File;
  collisageFile?: File;
  factureFile?: File;

  insertionBlPath?: string;
blFinalPath?: string;
listeCollisagePath?: string;
facturePath?: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.shipmentId = +idParam;
        this.loadShipment(this.shipmentId);
      }
    });
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
      estimatedArrival: ['', Validators.required]
    });
  }

  loadShipment(id: number): void {
    this.shipmentService.getShipment(id).subscribe((shipment: Shipment) => {
      this.shipmentForm.patchValue({
        client: shipment.client,
        poids: shipment.poids,
        volume: shipment.volume,
        provenance: shipment.provenance,
        incoterm: shipment.incoterm,
        magasinCale: shipment.magasinCale,
        confirme: shipment.confirme,
        motifModification: shipment.motifModification,
        estimatedDeparture: shipment.estimatedDeparture ? new Date(shipment.estimatedDeparture).toISOString().split('T')[0] : '',
  estimatedArrival: shipment.estimatedArrival ? new Date(shipment.estimatedArrival).toISOString().split('T')[0] : '',
      });
      this.insertionBlPath = shipment.insertionBlPath;
  this.blFinalPath = shipment.blFinalPath;
  this.listeCollisagePath = shipment.listeCollisagePath;
  this.facturePath = shipment.facturePath;
    });
  }

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  onFileChange(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (file) {
      switch (fileType) {
        case 'blFile': this.blFile = file; break;
        case 'blFinalFile': this.blFinalFile = file; break;
        case 'collisageFile': this.collisageFile = file; break;
        case 'factureFile': this.factureFile = file; break;
      }
    }
  }

  onSubmit(): void {
    //const dto = this.shipmentForm.value;
    const formData = new FormData();
    const formatToISOString = (date: Date) => {
      return new Date(date).toISOString(); // "2025-04-23T00:00:00.000Z"
    };
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
    //formData.append('shipment', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.blFile) formData.append('blFile', this.blFile);
    if (this.blFinalFile) formData.append('blFinalFile', this.blFinalFile);
    if (this.collisageFile) formData.append('collisageFile', this.collisageFile);
    if (this.factureFile) formData.append('factureFile', this.factureFile);

    this.shipmentService.updateShipment(this.shipmentId, formData).subscribe({
      next: () => {
        this.toastr.success('Expédition mise à jour avec succès');
      },
      error: err => {
        console.error('Échec de la mise à jour', err);
        this.toastr.error('Échec de la mise à jour');
      }
    });
  }

}

