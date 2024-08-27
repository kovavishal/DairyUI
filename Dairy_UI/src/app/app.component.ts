import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NavbarComponent} from './navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,HttpClientModule,MatTable, MatAutocompleteModule, NavbarComponent],
    providers:[DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    
  }
  title = 'milkyway_dairy';
  showHeader = false;
  constructor(private route: Router, private activatedRoute: ActivatedRoute){
    this.route.events.pipe(
      filter(e => e instanceof  NavigationEnd)
  ).subscribe(event => this.modifyHeader(event));
    {
      
  }
  }
  modifyHeader(location) { // This method is called many times
    console.log(location); // This prints a loot of routes on console
    if (location.url === '/' || location.urlAfterRedirects === '/login') {
        this.showHeader = false;
    } else {
        this.showHeader = true;
    }
}
}
