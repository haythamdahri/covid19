import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Traffic } from "../models/traffic.model";
import { Observable, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TrafficService {
  private TRAFFIC_APP_ID = 1;
  private firebaseSubscription: Subscription;

  constructor(private db: AngularFireDatabase) {}

  public getViews() {
    return this.db.object<Traffic>("traffic").valueChanges();
  }

  public incrementViews() {
    // Retrieve latest value
    const trafficRef = this.db.object<Traffic>("traffic");
    this.firebaseSubscription = trafficRef.snapshotChanges().subscribe((action) => {
      // Increment views
      const views = action.payload.val() == null ? 1 : ++action.payload.val().views;
      // Persist data
      trafficRef.set({views: views, lastUpdate: Date.now()});
      // Finish subscription
      this.firebaseSubscription.unsubscribe();
    });
  }
}
