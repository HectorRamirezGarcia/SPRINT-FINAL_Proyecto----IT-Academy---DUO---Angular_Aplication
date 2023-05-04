import { Component, OnInit } from '@angular/core';
import { User } from './_models';
import { AccountService, LanguageService, AlertService } from './_services';
import { JqueryService } from './_services/jquery.services';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [JqueryService]
})
export class AppComponent implements OnInit {
  user: User | null;
  startComments!: number;
  loading = false;


  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private accountService: AccountService, 
    private jqueryService: JqueryService, 
    private languageService: LanguageService,
    private readonly fb: NonNullableFormBuilder,
    private alertService: AlertService,
    ) {
    this.user = this.accountService.userValue;

  }

  title = 'DUO';
  idioms = [{ id: "1", name: "en", text: "En - English" }, { id: "2", name: "es", text: "Es - Español" }];
  comments = [{ id: 1, id_user: "1", text: "Buenarda la web!" }, { id: 2, id_user: "2", text: "Malisima la web!" }, { id: 3, id_user: "3", text: "Regular la web!" }];
  isCollapsed = true;

  ngOnInit(): void {
    const $ = this.jqueryService.getJQuery();
    $('[data-toggle="tooltip"]').tooltip();
    this.startComments = 0;
  }

  changeLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }

  nextComments() {
    this.startComments = this.startComments + 2;
    console.log(this.startComments);
  }

  prevComments() {
    this.startComments = this.startComments - 2;
  }

  async onSubmit() {
    this.loading = true;
    this.accountService.login(this.form.value).pipe(first())
    .subscribe({
        next: () => {
            this.alertService.success('Login successful', { keepAfterRouteChange: true });
        },
        error: error => {
            this.alertService.error(error);
            this.loading = false;
        }
    });
  }

}
