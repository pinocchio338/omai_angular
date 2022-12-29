import { Component, Inject, OnInit } from '@angular/core';
import { base64ToFile, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagecropper',
  templateUrl: './imagecropper.component.html',
  styleUrls: ['./imagecropper.component.scss']
})
export class ImagecropperComponent implements OnInit {
  imageChangedEvent: any = '';
  asratio = 1/1;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  isValidImage:boolean = true;
  loadingImg:boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public cropperdata:any,public dialogRef: MatDialogRef<ImagecropperComponent> ) { }

  ngOnInit(): void {
    //console.log("cropperdata",this.cropperdata);
    this.asratio = this.cropperdata.ratio;
    this.imageChangedEvent = this.cropperdata.file;
    
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //console.log(event, base64ToFile(event.base64));
}
doneImgeCropper(){
  this.dialogRef.close(this.croppedImage);
}
imageLoaded() {
  this.loadingImg=false;
  this.isValidImage = true;
    this.showCropper = true;
    //console.log('Image loaded');
}



loadImageFailed() {
  this.loadingImg=false;
  this.isValidImage = false;
    //console.log('Load failed');
}

rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
}

rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
}

private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
}


flipHorizontal() {
    this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH
    };
}

flipVertical() {
    this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV
    };
}

resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
}

zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
    this.transform = {
        ...this.transform,
        rotate: this.rotation
    };
}
}
