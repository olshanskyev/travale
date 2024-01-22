import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule,
  NbCheckboxModule, NbContextMenuModule, NbInputModule, NbLayoutModule, NbSelectModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';


@NgModule({
  imports: [
    TranslateModule.forChild(),
    CommonModule,
    FormsModule,
    NbLayoutModule,
    NbActionsModule,
    NbContextMenuModule,
    HttpClientModule,
    NbCardModule,
    NbAlertModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    RouterModule,
    NbSelectModule,
  ],
  declarations: [
    LoginComponent,
  ],
})
export class LoginModule { }
