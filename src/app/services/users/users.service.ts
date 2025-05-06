import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { jwtDecode } from "jwt-decode";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) {}
  authenticate(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/authenticate`,
      {
        email,
        password,
      },
      httpOptions
    );
  }

  getDecodedAccessToken(token: string): any {
    return jwtDecode(token);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem("auth-user");
    console.log("------>", user);
    return !(user === null);
  }

  loggedUserAuthoritiy() {
    if (this.isUserLoggedIn()) {
      let token = sessionStorage.getItem("auth-user");
      return this.getDecodedAccessToken(token).roles[0].authority;
    }
  }

  logOut() {
    sessionStorage.removeItem("email");
  }

  register(user: User) {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, user);
  }

  public getUser(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}/user/retrieve-all-users`);
  }

  // public addUser(user: User): Observable<User[]>{
  //   return this.http.post<any>(`${this.apiServerUrl}/user`,user);
  // }


  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/user/remove-user/${userId}`
    );
  }
  /*getConnectedUser() : Observable<User>{
     return this.httpClient.get<User>("http://localhost:8083/ERP/user/retrieve-connected-user");
  }*/

  // getConnectedUser(email: string) : Observable<User>{
  //   return this.http.get<User>(`${this.apiServerUrl}/user/connected-user/${email}`);
  // }

  getConnectedUser(username: string): Observable<User> {
    return this.getUserByUserName(username);
  }

  getUserByUserName(username: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/user/retrieve-user-username/${username}`
    );
  }


  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/user/retrieve-user-id/${userId}`
    );
  }

  resetPassword(token: string, pwd: string) {
    return this.http.post<any>(`${this.apiUrl}/user/reset_password/${token}/${pwd}`,
      null
    )
  }

  forgetPassword(email :string) {
 
    return this.http.post(`${this.apiUrl}/user/forgotPassword`,{email});
   }
}
