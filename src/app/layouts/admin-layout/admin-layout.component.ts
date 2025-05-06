import { Component, OnInit } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { TokenStorageService } from 'src/app/services/users/token-storage.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  isLoggedIn = false;
  token: string;
  role: string;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.token=sessionStorage.getItem('auth-user')
      const tokenInfo = this.getDecodedAccessToken(this.token);
      this.role = tokenInfo.role;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

}
