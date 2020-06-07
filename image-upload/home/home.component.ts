import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';


const baseUrl = "https://example.com";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPE = "video/mp4";

@Component({

    selector: 'selector-name',
    template: `

    <ion-header>
        <ion-toolbar>
            <ion-title>Upload Video</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content> 
        <div>
            <button (click)="actionSheetForVideo()"> Upload </button>
        </div>

    </ion-content>

    `,

})

export class HomeComponent implements OnInit {

    isVideoUploading: boolean;
    videoUploadPercent: number;
    loader;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public actionSheetController: ActionSheetController, private camera: Camera,
        private alertCtrl: AlertController, private mediaCapture: MediaCapture,
        private transfer: FileTransfer, private file: File, private diagnostic: Diagnostic,
        public _zone: NgZone, private loadingCtrl: LoadingController) {


    }

    ngOnInit() { }


    showLoader(title: any) {
        this.loader = this.loadingCtrl.create({
            content: title ? title : 'Please wait...'
        });
        this.loader.present();
    }

    dismissLoader() {
        this.loader.dismiss();
    }

    presentAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['Dismiss']
        });
        alert.present();
    }




    async actionSheetForVideo() {
        const actionSheet = await this.actionSheetController.create({

            buttons: [{
                text: 'Camera',
                icon: 'camera',
                handler: () => {
                    this.captureImg();
                }
            }, {
                text: 'Gallery',
                icon: 'images',
                handler: () => {
                    this.selectImgFromGallery();
                }
            },
            {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                }
            }]
        });
        await actionSheet.present();
    }




    selectImgFromGallery() {



    }


    captureImg() {

    }

    uploadImgToServer(imgData: any, fileName: any) {



    }


}