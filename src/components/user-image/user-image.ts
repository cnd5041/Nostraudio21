import { Component, Input } from '@angular/core';

@Component({
    selector: 'user-image',
    templateUrl: 'user-image.html'
})
export class UserImageComponent {
    @Input() imageUrl: string = null;

    errorHandled: boolean = false;

    constructor() { }

    errorHandler(event) {
        if (this.errorHandled) {
            this.imageUrl = null;
        } else {
            event.target.src = 'assets/default_user_avatar.jpg';
            this.errorHandled = true;
        }
    }

}
