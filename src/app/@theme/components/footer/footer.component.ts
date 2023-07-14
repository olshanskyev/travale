import { Component } from '@angular/core';

@Component({
  selector: 'travale-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created by <b><a href="mailto:olshanskyev@gmail.com" target="_blank">Evgenii Olshanskii</a></b> 2023
    </span>
    <div class="socials">
      <a href="https://www.linkedin.com/in/evgenii-olshanskii"><nb-icon icon="logo-linkedin" pack="ion"></nb-icon></a>
      <a href="https://vk.com/id201838"><nb-icon icon="logo-vk" pack="ion"></nb-icon></a>
    </div>
  `,
})
export class FooterComponent {
}
