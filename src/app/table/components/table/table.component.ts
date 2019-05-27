import { Component, OnInit } from '@angular/core';
import { TableService } from '../../services/table/table.service';
import { Cars } from 'src/app/core/models/cars.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from 'src/app/core/models/car.model';
import { CarData } from 'src/app/core/models/car-data.model';
import { AbstractModel } from 'src/app/core/models/abstract.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  carData: CarData = new CarData();
  customField: AbstractModel = new AbstractModel();
  car: Car = new Car(this.carData, this.customField);
  cars: Cars;

  carAddForm: FormGroup;
  carEditForm: FormGroup;
  sortForm: FormGroup;

  isSortFormOpen: false;
  isCarAddOpen: false;
  isCarEditOpen: boolean;
  currentEditing: Car;
  currentEditingCarIndex: number;

  constructor(
    private tableService: TableService,
    private formBuilder: FormBuilder
  ) {
    this.getCarsData();
    this.carAddForm = this.createFormGroup();
    this.carEditForm = this.createFormGroup();
    this.sortForm = this.formBuilder.group({
      sortBy: [null],
      sortType: [null]
    });
  }

  ngOnInit() {
  }

  private getCarsData() {
    this.tableService.getTableData()
      .subscribe((carsArray: Cars) => this.cars = carsArray);
  }

  private createFormGroup() {
    return this.formBuilder.group(
      {
        id: [this.car.carData.id],
        name: [this.car.carData.name, Validators.required],
        price: [this.car.carData.price, Validators.required],
        customFieldName: [this.car.customField.customFieldName],
        customFieldValue: [this.car.customField.customFieldValue]
      }
    );
  }

  addCar() {
    if (this.carAddForm.valid) {
      const form = this.carAddForm.value;
      this.car.carData.id = form.id;
      this.car.carData.name = form.name;
      this.car.carData.price = form.price;
      if (form.customFieldName) {
        this.car.customField.customFieldName = form.customFieldName;
        this.car.customField.customFieldValue = form.customFieldValue;
      }
      this.cars.cars.push(this.car);
      console.log(this.car);
      console.log(this.cars);
      this.carAddForm.reset();
    }
  }

  deleteCar(car: Car) {
    const index = this.cars.cars.indexOf(car);
    if (index !== -1) {
      this.cars.cars.splice(index, 1);
    }
  }

  editCar(car: Car) {
    this.isCarEditOpen = !this.isCarEditOpen;
    this.currentEditing = car;
    this.currentEditingCarIndex = this.cars.cars.indexOf(car);

    const customFields = {
      customFieldName: null, customFieldValue: null
    };

    if (this.currentEditing.customField) {
      customFields.customFieldName = this.currentEditing.customField.customFieldName;
      customFields.customFieldValue = this.currentEditing.customField.customFieldValue;
    }

    this.carEditForm.setValue({
      id: this.currentEditing.carData.id,
      name: this.currentEditing.carData.name,
      price: this.currentEditing.carData.price,
      customFieldName: customFields.customFieldName,
      customFieldValue: customFields.customFieldValue
    });

  }

  submitEditedCar() {
    const form = this.carEditForm.value;
    console.log(form);
    this.car.carData.id = form.id;
    this.car.carData.name = form.name;
    this.car.carData.price = form.price;

    if (form.customFieldName) {
      this.car.customField.customFieldName = form.customFieldName;
      this.car.customField.customFieldValue = form.customFieldValue;
    }

    this.cars.cars[this.currentEditingCarIndex] = this.car;
    this.isCarEditOpen = !this.isCarEditOpen;
    this.carEditForm.reset();
  }

  sortDataByColumn() {
    const form = this.sortForm.value;
    const column = form.sortBy;
    const type = form.sortType;
    if (column === 'name') {
      if (type === 'ascending') {
        this.cars.cars.sort((a, b) => {
          if (a.carData.name < b.carData.name) { return -1; }
          if (a.carData.name > b.carData.name) { return 1; }
          return 0;
        });
      } else {
        this.cars.cars.sort((a, b) => {
          if (a.carData.name < b.carData.name) { return 1; }
          if (a.carData.name > b.carData.name) { return -1; }
          return 0;
        });
      }
    }
    if (column === 'id') {
      if (type === 'ascending') {
        this.cars.cars.sort((a, b) => {
          return a.carData.id - b.carData.id;
        });
      } else {
        this.cars.cars.sort((a, b) => {
          return b.carData.id - a.carData.id;
        });
      }
    }
    if (column === 'price') {
      if (type === 'ascending') {
        this.cars.cars.sort((a, b) => {
          return a.carData.price - b.carData.price;
        });
      } else {
        this.cars.cars.sort((a, b) => {
          return b.carData.price - a.carData.price;
        });
      }
    }
  }

}
