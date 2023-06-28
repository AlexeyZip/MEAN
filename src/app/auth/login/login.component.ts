import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading = false;

    constructor( public authService: AuthService ) {}

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const formData = form.value;
        this.authService.login(formData.email, formData.password);
    }
}