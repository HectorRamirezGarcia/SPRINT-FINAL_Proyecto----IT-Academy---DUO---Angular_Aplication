import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, JqueryService, LanguageService } from '../_services';
import { Game } from '../_models';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    loading = false;
    submitted = false;
   
    preview!: string;

    games!: Array<Game>;

    form = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        birthdate: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rpassword: ['', [Validators.required, Validators.minLength(6)]],
        photourl: [null],
        file: [null],
        games: ['', Validators.required],
        description: [''],
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private readonly fb: NonNullableFormBuilder,
        private jqueryService: JqueryService,
        private languageService: LanguageService,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        const $ = this.jqueryService.getJQuery();
        $('[data-toggle="tooltip"]').tooltip();
        this.languageService.loadLanguage();
        this.accountService.getAllGames().subscribe({
            next: (data) => {
                this.games = data;
            }, error: (err) => {
                console.error(err);
            }
        });
    }

    changeFn() {
        console.log("Dropdown selection:", this.form.value.games);
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    upload(event: any) {
        console.log(event.target.files[0]);
        this.form.patchValue({
            photourl: event.target.files[0].name,
            file: event.target.files[0]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log("no valido")
            return;
        }       
        this.loading = true;

        // Upload img avatar
        const formData = new FormData();
        formData.append('file', this.form.value.file!);
        this.accountService.uploadimg(formData).subscribe();

        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
        this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        
        await this.delay(3000);
        this.accountService.createGamesLiked(this.form.value).subscribe(
            {
                next: () => {
                    this.alertService.success('GamesLiked successful', { keepAfterRouteChange: true });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            }
        )
        this.router.navigate(['/'], { relativeTo: this.route });
    }
}

function requiredFileType(arg0: string): any {
    throw new Error('Function not implemented.');
}
