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
import { FileSaver } from 'file-saver';


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

  displayedColumns: string[] = ['product_name', 'quantity', 'extras', 'rate', 'cgst_percentage', 'sgst_percentage', 'amount', 'action'];
  myformArray = new FormArray([
    new FormGroup({
      product_name: new FormControl(''),
      quantity: new FormControl(''),
      extras: new FormControl(''),
      rate: new FormControl('0.00'),
      cgst_percentage: new FormControl(0),
      sgst_percentage: new FormControl(0),
      amount: new FormControl('0.00')
    })
  ])
  columns: number = 8;
  constructor(private fb: FormBuilder, public userApi: UserService, private datePipe: DatePipe) {
    this.billingForm = this.fb.group({
      customer: ['', Validators.required],
      inputDate: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      extras: ['', Validators.required],
      totalAmount: []
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
        amount: new FormControl('0.00')
      })
    );
    this.table.renderRows();
  }



  removeRow(index: number) {
    event?.preventDefault();
    var tableLength = this.myformArray.length;
    if (tableLength > 1) {
      this.isLastRow = false;
      this.myformArray.removeAt(index);
      this.table.renderRows();
      // let amount = this.myformArray.at(index).get('amount')?.getRawValue();
      // this.myformArray.at(index).get('amount')?.setValue(parseFloat(amount).toFixed(2));
    var totalAmnt: any = 0;
    this.myformArray.controls.map((data) => {
      console.log("data: ", data)
      var amntVal: any = data.controls.amount.value;
      totalAmnt = parseFloat(totalAmnt) + parseFloat(amntVal);
      this.billingForm.controls['totalAmount'].setValue(parseFloat(totalAmnt).toFixed(2))

    })
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
          amount: new FormControl('0.00')
        })
      ])
      this.billingForm.controls['totalAmount'].setValue('0.00')
    }
  }

  ngOnInit() {
    this.loadUsers();
    this.loadProducts();
    this.isLastRow = true;
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

    //if (this.billingForm.valid) {
    var reqBody = {
      "user_id": "",
      "customer_id": newInvoice.customer,
      "productList": productList,
      "totalAmount": newInvoice.totalAmount,
      "billing_date": date
    }
    // this.billingForm = this.fb.group({
    //   customer: ['', Validators.required],
    //   inputDate: ['', Validators.required],
    //   product: ['', Validators.required],
    //   quantity: ['', Validators.required],
    //   extras: ['', Validators.required],
    //   totalAmount: []
    // });
    // this.myformArray = new FormArray([
    //   new FormGroup({
    //     product_name: new FormControl(''),
    //     quantity: new FormControl(''),
    //     extras: new FormControl(''),
    //     rate: new FormControl(0),
    //     cgst_percentage: new FormControl(0),
    //     sgst_percentage: new FormControl(0),
    //     amount: new FormControl(0)
    //   })
    // ])
    this.userApi.postApiCall('/orders/saveOrder', reqBody).subscribe((response: any) => {
      console.log("response: ", response)
      if (response.statusCode == 200) {
        //window.location.reload();
        this.printOrder(response.data[0].orderId);
      }
      else {

      }
    })
    //this.billingForm.reset();
    // }
  }
  printOrder(orderId) {
    var mediaType = 'application/pdf';
    return this.userApi.getApiWithParam('/print/printOrder', orderId).subscribe((response) => {
      
        let blob: any = new Blob([(response)], { type: 'application/pdf' });

//Create blobUrl from blob object.
let blobUrl: string = window.URL.createObjectURL(blob); 

//Use a download link.
let link: any = window.document.createElement('a'); 
if ('download' in link) {
    link.setAttribute('href', blobUrl);

    //Set the download attribute.
    //Edge doesn’t take filename here.
    link.setAttribute("download", response.fileName);

    //Simulate clicking download link.
    let event: any = window.document.createEvent('MouseEvents');
    event.initMouseEvent
        ('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);  
}
window.location.reload();
    //     var byteCharacters = atob(response.fileContent);
    //     var byteNumbers = new Array(byteCharacters.length);
    //     for (var i = 0; i < byteCharacters.length; i++) {
    //         byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // var byteArray:Uint8Array = new Uint8Array(byteNumbers); 

    // let filename = response.fileName;  
    // let binaryData = [];
    // binaryData.push(byteArray);
    // let downloadLink = document.createElement('a');
    // downloadLink.href = window.URL.createObjectURL(
    // new Blob(binaryData, { type: 'blob' }));
    // downloadLink.setAttribute('download', filename);
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
  
      // const blob = new Blob([response], {type: 'application/pdf'});
      // let fileName = 'myPdfFile';
      // let url= URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = fileName;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
    //   const linkSource = 'data:application/pdf;base64,' + response;
    //  const downloadLink = document.createElement("a");
    //  const fileName = "sample.pdf";

    // downloadLink.href = linkSource;
    // downloadLink.download = fileName;
    // downloadLink.click();
      // const fileBlob=new Blob([response],{
      //   type:'application/pdf'
      // });
      // FileSaver.saveAs(fileBlob,`Bill.pdf`);
      //let blob: any = new Blob([(response.json())], { type: 'application/pdf' });

//Create blobUrl from blob object.
//let blobUrl: string = window.URL.createObjectURL(blob);

//Bind trustedUrl to element src.
//this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);          

//Revoking blobUrl.
//window.URL.revokeObjectURL(blobUrl);
//  var url=window.URL.createObjectURL(blob);
//       var a =document.createElement('a');
//       a.href=url;
//       a.download="Bill.pdf";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
    })
      // var url=window.URL.createObjectURL(blob);
      // var a =document.createElement('a');
      // a.href=url;
      // a.download="Bill.pdf";
      // document.body.appendChild(a);
      // a.click();
      // a.remove();

      // if (response.statusCode == 200) {
      //   // this.billingForm.reset();
      //   // this.myformArray.reset();
      //   var blob = new Blob([response], { type: mediaType });
      //   saveAs(blob, 'bill.pdf');
      // }
    
      
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
  focusOutFunction(event: any, index: number) {
    event.preventDefault();
    let litre = event.target.value;
    let rate = this.myformArray.at(index).get('rate')?.getRawValue();
    let cgst_percent = this.myformArray.at(index).get('cgst_percentage')?.getRawValue();
    let sgst_percent = this.myformArray.at(index).get('sgst_percentage')?.getRawValue();
    let baseAmount = litre * rate;
    console.log("BA: ", baseAmount)
    let cgst = baseAmount * (cgst_percent / 100);
    console.log("cgst: ", cgst)
    let sgst = baseAmount * (sgst_percent / 100);
    console.log("sgst: ", sgst)
    let amount:any = baseAmount + cgst + sgst;
    console.log("amount: ", parseFloat(amount))
    this.myformArray.at(index).get('amount')?.setValue(parseFloat(amount).toFixed(2));
    var totalAmnt: any = 0;
    this.myformArray.controls.map((data) => {
      console.log("data: ", data)
      var amntVal: any = data.controls.amount.value;
      totalAmnt = parseFloat(totalAmnt) + parseFloat(amntVal);
      this.billingForm.controls['totalAmount'].setValue(parseFloat(totalAmnt).toFixed(2))

    })
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
