import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Template } from '@app/core/models/template';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: "app-template",
	templateUrl: "./template.component.html",
	styleUrls: ["./template.component.scss"],
})
export class TemplateComponent implements OnInit {

  @Input() template?: Template;
  @Input() selectedTemplate?: Template;
  @Output() selectTemplate = new EventEmitter<Template>();

	constructor(private translate: TranslateService) {}

	onSelect(template: Template): void {
		this.selectTemplate.emit(template);
	}

	ngOnInit(): void {}
}
