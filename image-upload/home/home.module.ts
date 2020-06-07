import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";

import { HomeComponent } from "./home.component";

import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";

@NgModule({
  declarations: [HomeComponent],
  imports: [IonicModule, CommonModule],
  providers: [Camera, File, FileTransfer],
})

export class HomeModule {}
