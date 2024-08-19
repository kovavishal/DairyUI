import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

interface Customer {
  user_id: number;
  user_name: string;
  phone_number: number;
  mail_address: string;
  address_id: number;
  active_flag: string;
  password: string; // remove from this object
}

interface product{
  product_id: number;
  product_name: string;
  rate_per_unit: number;
  cgst_amount: number;
  sgst_amount: number;
}

interface billings{
  itemid:number;
  product_name: string;
  quantity: number;
  extras:number;
  rate_per_unit: number;
  cgst_amount: number;
  sgst_amount: number;
  amount:number;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,MatSelectModule, MatDatepickerModule,MatCheckboxModule,MatIconModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  billingForm: FormGroup;

  customers: Customer[] = [
    {user_id: 1001,user_name:"Kova",phone_number:1234567890,mail_address:"kova@gmail.com",address_id:101,active_flag:"Y",password:"kova"},
    {user_id:1002,user_name:"Gowtham",phone_number:9876543210,mail_address:"gowwtham@gmail.com",address_id:102,active_flag:"Y",password:"gowtham"},
    {user_id:1003,user_name:"Naveen",phone_number:5678901234,mail_address:"naveen@gmail.com",address_id:103,active_flag:"Y",password:"naveen"}
  ];

  products: product[]=[
    {"product_id":101,"product_name":"CURD-135g -SACHET","rate_per_unit":39.5,"cgst_amount":6,"sgst_amount":6},
    {"product_id":102,"product_name":"CURD-100g-BOX","rate_per_unit":35.0,"cgst_amount":8,"sgst_amount":8},
    {"product_id":103,"product_name":"MILK-500g-PACKET","rate_per_unit":40.0,"cgst_amount":0,"sgst_amount":0}];

  billing_list: billings[]=[
    {"itemid":1,"product_name":"","quantity":0,"extras":0 ,"rate_per_unit":0, "cgst_amount":0,"sgst_amount":0,"amount":0.0}
  ];
  displayedColumns: string[] = ['product_name','quantity','extras','rate_per_unit', 'cgst_amount','sgst_amount','amount','action'];
  dataSource = this.billing_list;
//, 'quantity', 'rate_per_unit', 'cgst_amount','sgst_amount', 'amount'
  constructor(private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      selectedValue: ['select', Validators.required]
    });
  }

  itemid =1;
  addRow() {
    this.itemid=this.itemid+1;

    const newRow =  {"itemid":this.itemid,"product_name":"",quantity:0,"extras":0,"rate_per_unit":0, "cgst_amount":0,"sgst_amount":0,"amount":0.0};
    this.dataSource = [newRow, ...this.dataSource];
  }

  focusOutFunction(id: number){
    console.log(id)
    const temprow=this.dataSource.filter((u) => u.itemid == id);
    console.log(temprow)
    
  }

  removeRow(id: number) {
    this.dataSource = this.dataSource.filter((u) => u.itemid !== id);
  }
  
  ngOnInit() {
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      const newInvoice = this.billingForm.value;
      //this.invoices.push(newInvoice);
      this.billingForm.reset();
    }
  }
}
