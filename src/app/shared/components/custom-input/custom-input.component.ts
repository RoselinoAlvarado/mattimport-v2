import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  isPassword!: boolean;
  hide: boolean = true;
  typeFormPassword: string = 'password'
  typeFormText: string = 'text'

  constructor() {}

  ngOnInit() {
    this.isPassword = this.type === this.typeFormPassword;
  }

  showOrHidePassword() {
    this.hide = !this.hide;
    this.type = this.hide ? this.typeFormPassword : this.typeFormText;
  }
}
