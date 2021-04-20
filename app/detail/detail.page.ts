import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { FotoService } from '../foto.service';
import { Observable } from 'rxjs';
import { data } from '../tab1/tab1.page';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  
  isiData : Observable<data[]>;
  isiDataCol: AngularFirestoreCollection<data>;

  topik : string = '';
  waktu : string = '';
  tanggal : string = '';

  dataImage : any = [];

  constructor(public afs : AngularFirestore, activatedRoute: ActivatedRoute, public fotoService: FotoService, private afStorage : AngularFireStorage) { 
    this.topik = activatedRoute.snapshot.paramMap.get('topik');
    this.isiDataCol = afs.collection('todo', ref => ref.where('topik', '==', this.topik));
    this.isiData = this.isiDataCol.valueChanges();
  }

  async ngOnInit() {}

  update() {
    this.isiDataCol.doc(this.topik).update({
      topik : this.topik,
      waktu : new Date().toLocaleTimeString(),
      tanggal : this.tanggal
    })
  }

}
