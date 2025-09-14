import { Component, OnInit } from '@angular/core';
import {Employe} from '../models/Employe.model';
import {EmployeService} from '../services/employe/employe.service';
import {HeaderComponent} from '../shared/header/header.component';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {LayoutComponent} from '../shared/layout/layout.component';
import { PopupComponent } from "../shared/popup/popup.component";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  imports: [
    FormsModule,
    DatePipe,
    NgClass,
    NgForOf,
    NgIf,
    PopupComponent
],
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {


    // popup variables ///////////////////////////////////////////////////////////////
    showPopup = false;
    popupTitle = '';
    popupMessage = '';
    popupIsSuccess = false;
    popupRedirectPath: string | null = null;
    showCancelButton = false;


  employees: Employe[] = [];
  loading = false;

  // Pour l'ajout/modification
  editing: boolean = false;
  selected: Partial<Employe> = {};

  constructor(private employeService: EmployeService) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll() {
    this.loading = true;
    this.employeService.list().subscribe({
      next: (emps) => { this.employees = emps; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openAddModal() {
    this.editing = false;
    this.selected = {};
    // Ouvre le modal via JS ou bootstrap
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('addEmployee')).show();
  }

  openEditModal(emp: Employe) {
    this.editing = true;
    this.selected = { ...emp };
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('addEmployee')).show();
  }

  saveEmployee(form: any) {
    if (this.editing && this.selected.matricule) {
      this.employeService.update(this.selected.matricule, this.selected).subscribe(() => {
        this.fetchAll();
        (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('addEmployee')).hide();
      });
    } else {
      this.employeService.add(this.selected as any).subscribe({
        next: () => {
          this.fetchAll();
          (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('addEmployee')).hide();
        },
        error: (err) => {
          console.log("Add error:", err);
          this.showErrorPopup("Failed to add employee", "Please check the fields or server", null, true);
        }
      });
    }
  }

  // Pour la suppression (à implémenter si besoin)
  // deleteEmployee(matricule: string) {...}



   /// popup methods //////////////////////////////////////////

   showSuccessPopup(title: string , message: string,path: string|null,showCancelButton:boolean) {
    this.popupTitle =  title;
    this.popupMessage =  message;
    this.popupIsSuccess = true;
    this.popupRedirectPath = path;
    this.showCancelButton = showCancelButton;
    this.showPopup = true;
  }

  showErrorPopup(title : string,errorMessage: string,path:string|null,showCancelButton:boolean) {
    console.log('show error popup actived')
    this.popupTitle = title;
    this.popupMessage = errorMessage;
    this.popupIsSuccess = false;
    this.popupRedirectPath = path;
    this.showCancelButton = showCancelButton;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
////////////////////////////////////
}
