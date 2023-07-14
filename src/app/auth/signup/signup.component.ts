import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    isLoading = false;
    constructor ( public authService: AuthService ) {}

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        const formData = form.value;
        this.authService.createUser(formData.email, formData.password);
    }
}