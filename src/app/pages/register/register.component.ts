import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Role, User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  User: User;
  userForm: FormGroup;
  selectedRole: string;
  roles: string[] = [];

  constructor(
    private userService: UsersService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.roles = Object.values(Role);
    this.User = {
      idUser: null,
      username: '',
      email: '',
      password: '',
      role: null,
      blocked: false
    };

    this.userForm = this.formBuilder.group({
      userEmail: ['', Validators.required],
      userPassword: ['', Validators.required],
      userRole: ['']
    });
  }

  addUser() {
    this.userService.register(this.User).subscribe({
      next: (response: User) => {
        this.toastr.success('User registered successfully.');
        this.userForm.reset();
        // this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Something went wrong.');
      }
    });
  }
}
