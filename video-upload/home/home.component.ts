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
                    this.recordVideo();
                }
            }, {
                text: 'Gallery',
                icon: 'images',
                handler: () => {
                    this.selectVideoFromGallery();
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


    recordVideo() {

        let options: CaptureVideoOptions = { limit: 1, duration: 30, quality: 0 };

        this.mediaCapture.captureVideo(options)
            .then(
                (data: MediaFile[]) => {
                    this.uploadVideoToServer(data[0].fullPath, "file");
                },
                (err: CaptureError) => console.error(err)
            );
    }


    selectVideoFromGallery() {

        const options: CameraOptions = {
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }

        this.camera.getPicture(options)
            .then(async (videoUrl) => {
                if (videoUrl) {

                    var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
                    var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);

                    dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

                    try {
                        var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
                        var retrievedFile = await this.file.getFile(dirUrl, filename, {});
                    } catch (err) {
                        this.dismissLoader();
                        return this.presentAlert("Error", "Something went wrong.");
                    }
                    retrievedFile.file(data => {
                        this.dismissLoader();
                        if (data.size > MAX_FILE_SIZE) {
                            return this.presentAlert("Error", "cannot upload more than 5mb.")
                        } else {
                            this.uploadVideoToServer(retrievedFile.nativeURL, filename);
                        }
                    });
                }
            },
                (err) => {
                    console.log(err);
                });
    }


    uploadVideoToServer(videoData: any, fileName: any) {
        let url = baseUrl + "/video/upload";

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.isVideoUploading = true;

        let options: FileUploadOptions = {
            chunkedMode: false,
            fileName: fileName,
            fileKey: "file",
            mimeType: "video/mp4"
        }

        fileTransfer.upload(videoData, url, options)
            .then((data) => {
                this.isVideoUploading = false;
                this.videoUploadPercent = 0;
                // this.getUploadVideosFromServer();
                this.dismissLoader();
                this.presentAlert("Success", "Video upload was successful.");


            }).catch((err) => {
                this.isVideoUploading = false;
                this.videoUploadPercent = 0;
                this.presentAlert("Error", "Error uploading video try again.");

            });
        /* --- get upload progress percentage ----- */
        fileTransfer.onProgress((progressEvent) => {
            this._zone.run(() => {
                var perc = (progressEvent.lengthComputable) ? Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
                this.videoUploadPercent = perc;
            });
        });

        if (this.isVideoUploading == true) {
            this.showLoader(`Please Wait Uploading in Progress...`);
        }

    }


}