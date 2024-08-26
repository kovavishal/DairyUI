import { Component,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
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

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule, MatIconModule, MatNativeDateModule,
    MatTooltipModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;
  userForm: FormGroup;
  Customer: any = [];
  isUpdate:boolean=false;
  userId:any;
  dataSource!: MatTableDataSource<any>;
  constructor(private fb: FormBuilder, public userApi: UserService){
    this.userForm = this.fb.group({
      customerName: ['', Validators.required],
      phoneNum: ['', Validators.required],
      email:[''],
      address: ['', Validators.required],
      route: ['', Validators.required],
      city: ['', Validators.required],
      pincode: [''],
      gstNum:['', Validators.required]
    });
  }
  ngOnInit(): void {
this.loadUsers();
    
  }
  loadUsers() {
    return this.userApi.getApiCall('/users/getAllCustomers').subscribe((data: any) => {
      this.Customer = data.data;
      this.dataSource=this.Customer;
  
    });
    
  }
  displayedColumns: string[] = ['userName', 'phoneNum', 'gstNum', 'route','action'];

  deleteRow(event, id){
    event.preventDefault();
    var param ='/users/deleteCustomer'+'?'+'user_id='+id;
    this.userApi.deleteApi(param).subscribe((response: any) => {
      if (response.statusCode == 200) {
       console.log("deleteResp: ", response)
       window.location.reload();
      }
      else {
    
      }
    })
  }
editRow(event, id){
  event.preventDefault();
  this.isUpdate=true;
  this.userId=id;
this.Customer.map((items)=>{
  if(items.user_id == id){
    this.userForm.controls['customerName'].setValue(items.user_name);
    this.userForm.controls['phoneNum'].setValue(items.phone_number);
    this.userForm.controls['email'].setValue(items.mail_address?items.mail_address:'');
    this.userForm.controls['address'].setValue(items.address.address_line_1);
    this.userForm.controls['route'].setValue(items.address.area);
    this.userForm.controls['city'].setValue(items.address.district);
    this.userForm.controls['pincode'].setValue(items.address.pincode?items.address.pincode:'');
    this.userForm.controls['gstNum'].setValue(items.gst_number);
  }
})

// this.userApi.updateApi('/users/updateCustomer', reqBody).subscribe((response: any) => {
//   if (response.statusCode == 200) {
//    console.log("updateResp: ", response)
//    window.location.reload();
//   }
//   else {

//   }
// })
}
onSubmit(): void{
const userReq=this.userForm.value;
if(!this.isUpdate){
var reqBody={
  "user_name": userReq.customerName,
  "userType": 2,
  "phone_number": userReq.phoneNum,
  "gst_number": userReq.gstNum,
  "mail_address": userReq.email,
  
  "address": {
      "address_line_1": userReq.address,
      "area": userReq.route,
      "district": userReq.city,
      "pincode": userReq.pincode
  }
}

this.userApi.submitApi('/users/saveCustomer', reqBody).subscribe((response: any) => {
  if (response.statusCode == 200) {
   console.log("saveResp: ", response)
  }
  else {

  }
})
}else{
  var editReqBody={
    "user_id":this.userId,
    "user_name": userReq.customerName,
    "userType": 2,
    "phone_number": userReq.phoneNum,
    "gst_number": userReq.gstNum,
    "mail_address": userReq.email,
    
    "address": {
        "address_line_1": userReq.address,
        "area": userReq.route,
        "district": userReq.city,
        "pincode": userReq.pincode
    }
  }
  this.userApi.updateApi('/users/updateCustomer', editReqBody).subscribe((response: any) => {
  if (response.statusCode == 200) {
   console.log("updateResp: ", response)
   window.location.reload();
  }
  else {

  }
})
}
}
onEventChange(event){
  const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
}
onMailEventChange(event){
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}
}
