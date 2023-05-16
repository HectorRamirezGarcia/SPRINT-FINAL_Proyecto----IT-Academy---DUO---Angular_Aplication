import { Component, OnInit } from '@angular/core';
import { Idiom, Status, User } from './_models';
import { AccountService, LanguageService, AlertService } from './_services';
import { JqueryService } from './_services/jquery.services';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [JqueryService]
})

export class AppComponent implements OnInit {

  //Variables
  user_info!: User;
  user: string | null;
  startComments!: number;
  loading = false;
  idioms! : any;
  photourl! : any;
  privatelink !: any;
  status !: Array<Status>;
  status_checked ?: string;
  
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  form_status = this.fb.group({
    item: ['', Validators.required],
  })

  constructor(
    private accountService: AccountService, 
    private route: ActivatedRoute,
    private jqueryService: JqueryService, 
    private languageService: LanguageService,
    private readonly fb: NonNullableFormBuilder,
    private alertService: AlertService,
    private router: Router,
    ) {
    this.user = localStorage.getItem('user');
  }

  title = 'DUO';
  comments = [{ id: 1, id_user: "1", text: "Buenarda la web!" }, { id: 2, id_user: "2", text: "Malisima la web!" }, { id: 3, id_user: "3", text: "Regular la web!" }];
  isCollapsed = true;

  async ngOnInit(): Promise<void> {
    const $ = this.jqueryService.getJQuery();
    $('[data-toggle="tooltip"]').tooltip();
    this.startComments = 0;
    await this.accountService.getAllIdioms().subscribe(data => { this.idioms = data });
    if (this.user != null) {
      this.user = this.user.substring(1);
      this.user = this.user.slice(0, -1);
      this.accountService.getByEmail(this.user).subscribe(data => {
        this.user_info = data;
        this.status_checked = data.status_id;
        this.photourl = data.photourl; 
      });
      this.accountService.getAllStatus().subscribe(data => {this.status = data})
      this.privatelink = "localhost:8080/images/";
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  changeStatus(event : any) {
    this.form_status.patchValue({
      item: event.value,
    });
    this.onSubmitStatus();
  }

  async onSubmitStatus() {  
    (await this.accountService.update(this.user_info.id!, { status_id: this.form_status.value.item }))
    .subscribe({
      next: () => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
      },
      error: error => {
          this.alertService.error(error);
          this.loading = false;
      }
  });
  }

  changeLanguage(language: string) {
    this.languageService.changeLanguage(language);
    console.log(this.user);
  }

  nextComments() {
    this.startComments = this.startComments + 2;
    console.log(this.startComments);
  }

  prevComments() {
    this.startComments = this.startComments - 2;
  }

  async onChange() {

  }

  async logout() {
    this.accountService.logout();
    this.user = null;
  }

  async loggin() {
    this.loading = true;
    this.accountService.login(this.form.value)
    .subscribe({
        next: () => {
            this.alertService.success('Login successful', { keepAfterRouteChange: true });
        },
        error: error => {
            this.alertService.error(error);
            this.loading = false;
        }
    });
    await this.delay(1000);
    this.user = localStorage.getItem('user');
  }


}
