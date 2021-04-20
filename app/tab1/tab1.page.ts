import { Component } from '@angular/core';
import { FotoService, Photo } from '../foto.service';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  topik : string;
  waktu : any;
  tanggal : string = '';
  currentDate = new Date();
  urlImageStorage : string[] = [];
  selectedPhoto : Photo[] = [];

  isiData : Observable<data[]>;
  isiDataCol: AngularFirestoreCollection<data>;

  dataImage : any = [];

  constructor(public fotoService: FotoService, private afStorage : AngularFireStorage, public alertController: AlertController, afs : AngularFirestore) {
    this.waktu = this.currentDate.toLocaleTimeString();
    this.isiDataCol = afs.collection('todo');
    this.isiData = this.isiDataCol.valueChanges();
  }

  async ngOnInit() {
    await this.fotoService.loadFoto();
  }

  tambahFoto() {
    this.fotoService.tambahFoto();
  }

  async presentAlert(text) {
    const alert = await this.alertController.create({
      header: 'Sukses',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  select(dataFoto, id) {
    if(!this.selectedPhoto.includes(dataFoto)) {
      document.getElementById(id).style.border = '5px solid red'
      this.selectedPhoto.unshift(dataFoto);
    }
    else {
      document.getElementById(id).style.border = '0px solid'
      const index = this.selectedPhoto.indexOf(dataFoto);
      this.selectedPhoto.splice(index,1);
    }
  }

  uploadData() {
    var urlPhoto : string[] = [];
    if(this.selectedPhoto.length >= 2) {
      for(var i = 0; i < this.selectedPhoto.length; i++) {
        var path =  "https://firebasestorage.googleapis.com/v0/b/utsmobdev.appspot.com/o/imgStorage%2F"+this.selectedPhoto[i].filePath+"?alt=media&token=42a14eea-13cd-4629-ab58-3e68573ffa0d"
        urlPhoto.push(path)
        const imgFilePath = `imgStorage/${this.selectedPhoto[i].filePath}`
        this.afStorage.upload(imgFilePath, this.selectedPhoto[i].dataImage).then(() => {
         this.afStorage.storage.ref().child(imgFilePath).getDownloadURL().then(url => {
          this.urlImageStorage.unshift(url)
         });
        });
      }
      this.isiDataCol.doc(this.topik).set({
        topik : this.topik,
        tanggal: this.tanggal,
        waktu: this.waktu,
        foto: urlPhoto
      }).then(() => {
        this.topik = '';
        this.waktu = this.currentDate.toLocaleTimeString();
        this.tanggal = '';
      })
      this.fotoService.setfsPhoto(urlPhoto);
      this.selectedPhoto = [];
      this.presentAlert("Data Todo berhasil di upload!");
    }
    else if(this.selectedPhoto.length == 0) {

    }
    else {
      this.presentAlert("Pilih minimal 2 gambar atau tidak sama sekali");
    }
  }
}

export interface data {
  topik : string,
  tanggal : string,
  waktu : string,
  foto : string[]
}