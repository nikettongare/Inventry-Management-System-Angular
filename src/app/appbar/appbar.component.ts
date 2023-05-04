import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
})
export class AppbarComponent {
  @Input() username: string = "";

  openUserDropdown: boolean = false;

  toggleUserDropDown() {
    this.openUserDropdown = !this.openUserDropdown;
    console.log(this.openUserDropdown);
  }
}
