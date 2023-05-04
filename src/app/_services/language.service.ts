import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    language_save!: string;

    constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }


    changeLanguage(language: string) {
        this.language_save = language;
        this.translate.use(language);
    }

    loadLanguage() {
        if(this.language_save == undefined) { this.translate.use("en"); } else {  this.translate.use(this.language_save);}
    }
}