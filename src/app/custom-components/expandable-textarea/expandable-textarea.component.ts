import { Component, EventEmitter, Input, Output, HostBinding, ViewEncapsulation } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TextAreaWindowComponent } from './textarea-window/textarea-window.component';

@Component({
  selector: 'travale-expandable-textarea',
  templateUrl: './expandable-textarea.component.html',
  styleUrls: ['./expandable-textarea.component.scss'],
})
export class ExpandableTextareaComponent {

  constructor(private dialogService: NbDialogService) {}

  @Input() readonly = false;
  @Input() expandable = true;
  @Input() value?: string;
  @Input() placeholder?: string;
  @Output() valueChange: EventEmitter<string | undefined> = new EventEmitter();
  @HostBinding('style.--max-height') maxHeight = '150px';
  @HostBinding('style.--min-height') minHeight = '40px';

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  showTextAreaWindow() {
    this.dialogService.open(TextAreaWindowComponent, {
      context: {
        value: this.value
    }}).onClose.subscribe(value => {
      if (value !== undefined) {
        this.value = value;
        this.valueChange.emit(value);
      }
    });
  }

}
