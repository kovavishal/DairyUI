import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
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

  postApiCall(params: string, data:any): Observable<any> {
    return this.http.post<any>(this.apiURL + params, data);
  }
   HTTPOptions = {
    headers: new HttpHeaders({
       'Accept':'application/pdf'
    }),
    'responseType': 'blob' as 'json'
 }
  getApiWithParam(params: string, id: number): Observable<any> {
    return this.http.get(this.apiURL+params+'?'+"orderId="+id, { responseType: "text" }).pipe(map(r => { try { r = JSON.parse(r); } catch { } return r; }));
  }

//   deleteUsers(users: User[]): Observable<User[]> {
//     return forkJoin(
//       users.map((user) =>
//         this.http.delete<User>(`${this.serviceUrl}/${user.id}`)
//       )
//     );
//   }
}