import { Component, OnInit } from '@angular/core';
import { User } from './_models';
import { AccountService } from './_services';
import { JqueryService } from './_services/jquery.services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [JqueryService]
})
export class AppComponent implements OnInit{
  user: User | null;
  startComments!: number;

  constructor(private accountService: AccountService, private jqueryService: JqueryService) {
    this.user = this.accountService.userValue;
  }
  
  title = 'DUO';
  idioms = [ {id: 1, name: "es", text: "Es - Español"}, {id: 2, name: "en", text: "En - English"}]
  comments = [ {id: 1, id_user: "1", text: "Buenarda la web!"}, {id: 2, id_user: "2", text: "Malisima la web!"}, {id: 3, id_user: "3", text: "Regular la web!"}]
  isCollapsed = true;

  ngOnInit(): void {
    const $ = this.jqueryService.getJQuery();
    $('[data-toggle="tooltip"]').tooltip();
    this.startComments = 0;
  }

  changeIdiom(){
  }

  nextComments(){
    this.startComments = this.startComments+2;
    console.log(this.startComments);
  }

  prevComments() {
    this.startComments = this.startComments-2;
  }
}
