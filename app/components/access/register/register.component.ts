import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { RestService, UserService } from "../../../services";
import { RegModel } from "../access.model";
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page } from "ui/page";

import scrollViewModule = require("ui/scroll-view");

@Component({
    selector: "tl-register",
    moduleId: module.id,
    templateUrl: "./register.component.html",
    styleUrls: ["./register-common.css", "./register.component.css"],
    providers: []
})
export class RegisterComponent implements OnInit {
    //Input username from login view

    username: string;
    fullname: string;
    loginForm: FormGroup;
    usernameControl: AbstractControl;
    public userText: string;
    private sub: any;
    constructor(private route: ActivatedRoute, private router: RouterExtensions, private RestService: RestService, private UserService:UserService, private fb:FormBuilder, private page: Page)  {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.loginForm = this.fb.group({
            fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        });
        this.usernameControl = this.loginForm.controls['fullname'];
        this.userText = "Welcome, " + this.UserService.username + "!";
    }

    public checkValidity(){
            this.fullname = this.usernameControl.value;
            if (this.usernameControl.hasError('required'))
              alert('Fullname is required');
            else if (this.usernameControl.hasError('minlength'))
              alert('Fullname is too short');
            else if (this.usernameControl.hasError('maxlength'))
              alert('Fullname is too long');
            else this.register()
    }

    public register() {
            this.username = this.UserService.username;

            this.registerThisUser(this.username, this.fullname);
    }

    goToHome() {
        this.UserService.fullname = this.fullname;
        this.router.navigate(['/main'], {
            transition: {
                duration: 500,
                name: 'slideLeft',
            },
            clearHistory: true
        });
    }

    registerThisUser(user_id, user_fullname){
            this.RestService
                    .post({ username: user_id, fullname: user_fullname }, "register-user")
                    .subscribe(res => {
                        this.validateRegistered(res);
                    });
    }

    validateRegistered(res){
           if (!(res.trailUserName == "false")) {
                this.goToHome();
            } else {
                this.invalidName();
            }
    }

    invalidName(){
      alert("Error: The name entered is invalid");
    }
}
