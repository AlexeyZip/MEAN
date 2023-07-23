import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;

    constructor ( public authService: AuthService ) {}

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        const formData = form.value;
        this.authService.createUser(formData.email, formData.password);
    }
}