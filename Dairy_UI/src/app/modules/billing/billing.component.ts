import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray, FormControl } from '@angular/forms';
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
import { MatNativeDateModule } from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {UserService}  from '../services/user.service'
import { MatTable } from '@angular/material/table';


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
    MatButtonModule,MatSelectModule, MatDatepickerModule,MatCheckboxModule,MatIconModule, MatNativeDateModule,
    MatTooltipModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) 
  table!: MatTable<any>;
  billingForm: FormGroup;
  Customer: any = [];
  products:any=[];
 
  displayedColumns: string[] = ['product_name','quantity','extras','rate', 'cgst_percentage','sgst_percentage','amount','action'];
  myformArray = new FormArray([
    new FormGroup({
      product_name: new FormControl(''),
      quantity: new FormControl(''),
      extras: new FormControl(''),
      rate: new FormControl(0),
      cgst_percentage: new FormControl(0),
      sgst_percentage: new FormControl(0),
      amount: new FormControl('')
        })
  ])
  columns: number = 8;
  constructor(private fb: FormBuilder, public userApi: UserService) {
    this.billingForm = this.fb.group({
      customer:['', Validators.required],
      inputDate:['', Validators.required],
      product:['', Validators.required],
      quantity:['', Validators.required],
      totalAmount:[0, Validators.required]
});
  }

  itemid =1;
  addRow(event:any) {
    event.preventDefault();
    this.myformArray.push(
      new FormGroup({
        product_name: new FormControl(''),
      quantity: new FormControl(''),
      extras: new FormControl(''),
      rate: new FormControl(0),
      cgst_percentage: new FormControl(0),
      sgst_percentage: new FormControl(0),
      amount: new FormControl('')
        })
    );
    this.table.renderRows();
}



  removeRow(index: number) {
    this.myformArray.removeAt(index);
    this.table.renderRows();
  }
  
  ngOnInit() {
    this.loadUsers();
    this.loadProducts();
  }
  loadUsers(){
    return this.userApi.getApiCall('/users/getAllUser').subscribe((data: any) => {
      this.Customer = data.data;
    });
  }
  loadProducts(){
    return this.userApi.getApiCall('/products/allProducts').subscribe((data: any) => {
      this.products = data.data;
    });
  }
  onSubmit(): void {
    if (this.billingForm.valid) {
      const newInvoice = this.billingForm.value;
      //this.invoices.push(newInvoice);
      this.billingForm.reset();
    }
  }
  onProductSelected(value:any, index:number){
this.products.map((items)=>{
  if(items.product_id==value){
    this.myformArray.at(index).get('rate')?.setValue(items.rate);
    this.myformArray.at(index).get('cgst_percentage')?.setValue(items.cgst_percentage);
    this.myformArray.at(index).get('sgst_percentage')?.setValue(items.sgst_percentage);
 }
})
  }
  focusOutFunction(event:any, index:number){
    let litre=event.target.value;
    let rate=this.myformArray.at(index).get('rate')?.getRawValue();
    let cgst_percent =this.myformArray.at(index).get('cgst_percentage')?.getRawValue();
    let sgst_percent =this.myformArray.at(index).get('sgst_percentage')?.getRawValue();
    let baseAmount= litre*rate;
let cgst = baseAmount*(cgst_percent/100);
let sgst = baseAmount*(sgst_percent/100);
let amount = Math.abs(baseAmount+cgst+sgst).toFixed(0);
this.myformArray.at(index).get('amount')?.setValue(amount);
var totalAmnt:any=0;
this.myformArray.controls.map((data)=>{
  var amntVal:any=data.controls.amount.value;
  totalAmnt=parseInt(totalAmnt)+parseInt(amntVal);
  this.billingForm.controls['totalAmount'].setValue(totalAmnt)
  
  console.log("value: ", totalAmnt)
})
    // this.dataSource.map((u) => {
    //   if(u.itemid == id){
    //     console.log("product: ",u.product_name);
    //   }
    // });
    
  }
}
