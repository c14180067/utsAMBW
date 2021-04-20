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
    this.tampilkanData();
  }

  tampilkanData() {
    this.dataImage = [];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then(url => {
            var data = {
              'nama': itemRef.name,
              'url': url
            }
            this.dataImage.unshift(data)
          })
        })
      }).catch((error) =>{
        console.log(error)
      })
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
        urlPhoto.push(this.selectedPhoto[i].filePath)
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

interface data {
  topik : string,
  tanggal : string,
  waktu : string,
  foto : string[]
}