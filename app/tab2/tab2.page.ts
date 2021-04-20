import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { data } from '../tab1/tab1.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  isiData : Observable<data[]>;
  isiDataCol: AngularFirestoreCollection<data>;

  topik : string = '';
  waktu : string = '';
  tanggal : string = '';
  foto : string[] = [];

  constructor(afs : AngularFirestore, private router: Router) {
    this.isiDataCol = afs.collection('todo');
    console.log(this.isiDataCol);
    this.isiData = this.isiDataCol.valueChanges();
  }

  toDetail(topik) {
    this.router.navigate(['/detail', topik]);
  }

  delete(topik) {
    console.log(topik);
    this.isiDataCol.doc(topik).delete();
  }
}
