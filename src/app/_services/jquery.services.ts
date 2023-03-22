import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class JqueryService {

  constructor() { }

  public getJQuery() {
    return $;
  }
}