import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        FormsModule
    ]
})
export class AuthModule {

}