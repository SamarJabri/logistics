import { Component,Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";

import { UsersService } from 'src/app/services/users/users.service';
import { TokenStorageService } from 'src/app/services/users/token-storage.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: any = {};
  email: string;
  password: string;
  isSent : boolean = false;

  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string;
  authority:string='';
  sub:string=null;
  token: string;
  @Input() error: string | null;
  constructor(private router: Router, private userService: UsersService, public toastr: ToastrService,private tokenStorage: TokenStorageService) { }
  //username = ''
  //password = ''
  invalidLogin = false
  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }
  ngOnInit() : void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.token=sessionStorage.getItem('auth-user')
      const tokenInfo = this.getDecodedAccessToken(this.token);
      this.role = tokenInfo.role;
    }
  }
  ngOnDestroy() {
  }
  checkLogin() {
     (this.userService.authenticate(this.email, this.password).subscribe(
       data => {
         this.tokenStorage.saveToken(data.accessToken);
         this.tokenStorage.saveUser(data);
           /*A chaque fois on besoin du token */
           this.token=sessionStorage.getItem('auth-user');
           const tokenInfo = this.getDecodedAccessToken(this.token);
         console.log(this.token);
         console.log(tokenInfo);
         /** */
         //this.router.navigate(['/dashboard']);
         this.isLoggedIn = true;
           this.invalidLogin = false
           /** */
         if (tokenInfo.role==='Magasinage') {  
           this.router.navigate(['../tables']);
           this.isLoggedIn = true;
           this.invalidLogin = false
         }
         else if (tokenInfo.role==='Commercial' )  {
           this.router.navigate(['../add-shipment']);
           this.isLoggedIn = true;
           this.invalidLogin = false
         }
       },
       error => {
         this.invalidLogin = true
         this.error = error.message;
         this.toastr.warning('Login Incorrecte ')
 
       }
     )
     );
   }

}

