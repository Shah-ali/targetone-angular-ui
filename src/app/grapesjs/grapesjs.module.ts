import { NgModule } from "@angular/core";
import { DataLayerComponent } from "./data-layer/data-layer.component";
import { GrapesjsComponent } from "./grapesjs/grapesjs.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [],
  imports: [RouterModule, CommonModule, TranslateModule, BrowserModule, FormsModule],
})
export class GrapesjsModule {}
