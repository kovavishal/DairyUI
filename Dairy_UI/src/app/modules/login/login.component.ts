import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../services/user.service";
import { ReactiveFormsModule } from '@angular/forms';
 import {AbstractControl, FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @ViewChild(MatTable, { static: true })
  loginForm!: FormGroup;
  
  submitted = false;
  constructor(private fb: FormBuilder, public userApi: UserService, private router: Router){
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]})
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]})
    
  }
  
  onSubmit(): void {
    this.submitted = true;

    
      const userReq = this.loginForm.value;
      var reqBody=
    {
      "userName": userReq.userName,
      "password":userReq.password
    }
    if (this.loginForm.valid) {
    this.router.navigate(["/billing"]);
    }
    // this.user.submitApi('/users/loginCheck', reqBody).subscribe((response: any) => {
    //   if (response.statusCode == 200) {
    //   }
    // })
    

  }
  
}
