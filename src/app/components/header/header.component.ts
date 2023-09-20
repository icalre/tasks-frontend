import {Component} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    host: {
        class: 'header-container'
    },
})
export class HeaderComponent {
}
