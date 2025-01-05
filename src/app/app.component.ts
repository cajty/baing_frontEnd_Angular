import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./features/auth/pages/login/login.component";
import {HeaderComponent} from "./shared/components/header/header.component";
import {HttpClientModule} from "@angular/common/http";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    HeaderComponent,
    HttpClientModule,
  ],
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-ang';

}
