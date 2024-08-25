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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../services/user.service'
import { MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { saveAs  } from 'file-saver';


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
    MatButtonModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule, MatIconModule, MatNativeDateModule,
    MatTooltipModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;
  billingForm: FormGroup;
  Customer: any = [];
  products: any = [];
  isLastRow: boolean = false;
  taxVal:any='0.00';
  isDiscEntered:boolean=false;

  displayedColumns: string[] = ['product_name', 'quantity', 'extras', 'rate', 'cgst_percentage', 'sgst_percentage', 'amount', 'action'];
  myformArray = new FormArray([
    new FormGroup({
      product_name: new FormControl(''),
      quantity: new FormControl(''),
      extras: new FormControl(''),
      rate: new FormControl('0.00'),
      cgst_percentage: new FormControl(0),
      sgst_percentage: new FormControl(0),
      amount: new FormControl('0.00'),
      cgstAmount: new FormControl('0.00'),
      sgstAmount: new FormControl('0.00')

    })
  ])
  columns: number = 8;
  constructor(private fb: FormBuilder, public userApi: UserService, private datePipe: DatePipe) {
    this.billingForm = this.fb.group({
      customer: ['', Validators.required],
      customerName: [],
      customerAddress:[],
      route:[],
      city:[],
      pincode:[],
      outStdCrates:['', Validators.required],
receivedCrates:['', Validators.required],
      inputDate: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      extras: ['', Validators.required],
      totalAmount: ['0.00'],
      discount:[],
      taxAmount:['0.00'],
      netAmount:['0.00']
    });
  }

  addRow(event: any) {
    event.preventDefault();
    this.isLastRow = false;
    this.myformArray.push(
      new FormGroup({
        product_name: new FormControl(''),
        quantity: new FormControl(''),
        extras: new FormControl(''),
        rate: new FormControl('0.00'),
        cgst_percentage: new FormControl(0),
        sgst_percentage: new FormControl(0),
        amount: new FormControl('0.00'),
        cgstAmount: new FormControl('0.00'),
        sgstAmount: new FormControl('0.00')
      })
    );
    this.table.renderRows();
  }
ngOnInit() {
    this.loadUsers();
    this.loadProducts();
    this.isLastRow = true;
    this.billingForm.controls['discount'].setValue('0.00')
  }
  loadUsers() {
    return this.userApi.getApiCall('/users/getAllUser').subscribe((data: any) => {
      this.Customer = data.data;

    });
  }
  loadProducts() {
    return this.userApi.getApiCall('/products/allProducts').subscribe((data: any) => {
      this.products = data.data;
    });
  }
  onSubmit(): void {
    const newInvoice = this.billingForm.value;
    var productList: any = [];
    this.myformArray.controls.map((data) => {
      var req: any = {
        "product_id": data.controls.product_name.value,
        "rate": data.controls.rate.value,
        "cgst_percentage": data.controls.cgst_percentage.value,
        "sgst_percentage": data.controls.sgst_percentage.value,
        "quantity": data.controls.quantity.value,
        "liters": data.controls.extras.value,
        "amount": data.controls.amount.value,

      }
      productList.push(req);
    })
    var date = this.datePipe.transform(newInvoice.inputDate, "yyyy-MM-dd");

    var reqBody = {
      "user_id": "",
      "customer_id": newInvoice.customer,
      "productList": productList,
      "totalAmount": newInvoice.totalAmount,
      "billing_date": date
    }
    
    this.userApi.postApiCall('/orders/saveOrder', reqBody).subscribe((response: any) => {
      console.log("response: ", response)
      if (response.statusCode == 200) {
        this.printOrder(response.data[0].orderId);
      }
      else {

      }
    })
    
  }
  onCustomerOnchange(value){
    this.Customer.map((items)=>{
      if(items.user_id==value){
        this.billingForm.controls['customerName'].setValue(items.user_name);
        this.billingForm.controls['customerAddress'].setValue(items.address_id);
      }
    })
  }
  printOrder(orderId) {
    var mediaType = 'application/pdf';
    return this.userApi.getApiWithParam('/print/printOrder', orderId) .then(blob=> {
      saveAs(blob, this.billingForm.controls['customerName'].getRawValue+'_'+orderId+'.pdf');
      window.location.reload();
   });
    
  }


  onProductSelected(value: any, index: number) {
    event?.preventDefault();
    this.products.map((items) => {
      if (items.product_id == value) {
        this.myformArray.at(index).get('rate')?.setValue(items.rate);
        this.myformArray.at(index).get('cgst_percentage')?.setValue(items.cgst_percentage);
        this.myformArray.at(index).get('sgst_percentage')?.setValue(items.sgst_percentage);
      }
    })
  }
  focusOutFunction(event: any, index: number, name:string) {
    event.preventDefault();
    if(name =="disc"){
      this.isDiscEntered=true;
      
    }
    if(name=="litre"){
      let litre = event.target.value;
    let rate = this.myformArray.at(index).get('rate')?.getRawValue();
    let cgst_percent = this.myformArray.at(index).get('cgst_percentage')?.getRawValue();
    let sgst_percent = this.myformArray.at(index).get('sgst_percentage')?.getRawValue();
    let baseAmount = litre * rate;
     var cgst_val:any = baseAmount * (cgst_percent / 100);
     var sgst_val:any = baseAmount * (sgst_percent / 100);
     var total_tax:any=parseFloat(cgst_val)+parseFloat(sgst_val);
     this.taxVal=parseFloat(this.taxVal)+parseFloat(total_tax);
    let amount:any = baseAmount + cgst_val + sgst_val;    
    this.myformArray.at(index).get('amount')?.setValue(parseFloat(amount).toFixed(2));
    var totalAmnt: any = 0;   
    var net_amount:any=0;
    this.myformArray.controls.map((data) => {
      console.log("data: ", data)
      var amntVal: any = data.controls.amount.value;      
      totalAmnt = parseFloat(totalAmnt) + parseFloat(amntVal);
        
    })
    if(this.isDiscEntered ==true){
    
    var discnt:any=this.billingForm.controls['discount'].getRawValue;
    
    net_amount = parseFloat(totalAmnt)+parseFloat(this.taxVal)-parseFloat(discnt); 
    }
    else{
      net_amount = parseFloat(totalAmnt)+parseFloat(this.taxVal);
    }
    this.billingForm.controls['totalAmount'].setValue(parseFloat(totalAmnt).toFixed(2))
     this.billingForm.controls['taxAmount'].setValue(parseFloat(this.taxVal).toFixed(2))
      this.billingForm.controls['netAmount'].setValue(parseFloat(net_amount).toFixed(2))
}
  }
  removeRow(index: number) {
    event?.preventDefault();
    var tableLength = this.myformArray.length;
    if (tableLength > 1) {
      this.isLastRow = false;
      
    var totalAmnt: any = 0;
    let litre = this.myformArray.at(index).get('extras')?.getRawValue();
    let rate = this.myformArray.at(index).get('rate')?.getRawValue();
    let cgst_percent = this.myformArray.at(index).get('cgst_percentage')?.getRawValue();
    let sgst_percent = this.myformArray.at(index).get('sgst_percentage')?.getRawValue();
    this.myformArray.removeAt(index);
      this.table.renderRows();
    let baseAmount = litre * rate;
     var cgst_val:any = baseAmount * (cgst_percent / 100);
     var sgst_val:any = baseAmount * (sgst_percent / 100);
    var total_tax:any=parseFloat(cgst_val)+parseFloat(sgst_val);
     this.taxVal=parseFloat(this.taxVal)-parseFloat(total_tax);
    var net_amount:any=0;
    //var discount:any=this.billingForm.controls['discount']?.getRawValue;
    this.myformArray.controls.map((data) => {
      console.log("data: ", data)
      var amntVal: any = data.controls.amount.value;
      totalAmnt = parseFloat(totalAmnt) + parseFloat(amntVal);
      net_amount = parseFloat(totalAmnt)+parseFloat(this.taxVal);      

    })
    this.billingForm.controls['totalAmount'].setValue(parseFloat(totalAmnt).toFixed(2));
      this.billingForm.controls['taxAmount'].setValue(parseFloat(this.taxVal).toFixed(2))
      this.billingForm.controls['netAmount'].setValue(parseFloat(net_amount).toFixed(2))
    } else {
      this.isLastRow = true;
      this.myformArray = new FormArray([
        new FormGroup({
          product_name: new FormControl(''),
          quantity: new FormControl(''),
          extras: new FormControl(''),
          rate: new FormControl('0.00'),
          cgst_percentage: new FormControl(0),
          sgst_percentage: new FormControl(0),
          amount: new FormControl('0.00'),
          cgstAmount: new FormControl('0.00'),
          sgstAmount: new FormControl('0.00')
        })
      ])
      this.billingForm.controls['totalAmount'].setValue('0.00');
      this.billingForm.controls['discount'].setValue('0.00');
      this.billingForm.controls['taxAmount'].setValue('0.00');
      this.billingForm.controls['netAmount'].setValue('0.00');
     
    }
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  onlyDecimalNumberKey(event) {
    // let charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode != 46 && charCode > 31
    //     && (charCode < 48 || charCode > 57))
    //     return false;
    // return true;
    const reg = /^-?\d*(\.\d{0,9})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
