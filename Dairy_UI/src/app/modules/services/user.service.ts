import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    
  private apiURL = 'http://ec2-13-61-3-132.eu-north-1.compute.amazonaws.com:8080/Dairyapp';

  constructor(private http: HttpClient) {}

//   getUsers(): Observable<Rate[]> {
//     return this.http
//       .get(this.serviceUrl)
//       .pipe<User[]>(map((data: any) => data.users));
//   }

//   updateUser(user: User): Observable<User> {
//     return this.http.patch<User>(`${this.serviceUrl}/${user.id}`, user);
//   }

getApiCall(params:string): Observable<any> {
    return this.http
      .get<any>(this.apiURL + params)
     // .pipe(retry(1), catchError(this.handleError));
  }
//   deleteUser(id: number): Observable<User> {
//     return this.http.delete<User>(`${this.serviceUrl}/${id}`);
//   }

//   deleteUsers(users: User[]): Observable<User[]> {
//     return forkJoin(
//       users.map((user) =>
//         this.http.delete<User>(`${this.serviceUrl}/${user.id}`)
//       )
//     );
//   }
}