import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxIndexedDBService, ObjectStoreSchema } from 'ngx-indexed-db';
import { NOTIFICATION_ITEM, NotificationItem, UserNotifications } from '../data/one-time-notification.data';
import { Observable } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

@Injectable()
export class UserNotificationsService implements UserNotifications {

  private static storeName = 'OnetimeNotifications';

  public static store(): string {
    return this.storeName;
  }

  public static storeSchema(): ObjectStoreSchema[] {
    return [
     {
      name: 'isAlreadyShown',
      keypath: 'isAlreadyShown',
      options: {
        unique: false
      }
     }
    ];
  }

  public static storeConfig(): {
    keyPath: string | string[];
    autoIncrement: boolean;
    [key: string]: any} {
    return { keyPath: 'id', autoIncrement: true };
  }

  private notificationsMap: Map<NOTIFICATION_ITEM, NotificationItem> = new Map([
    [NOTIFICATION_ITEM.SET_CITY_BOUNDING_BOX, {
      id: NOTIFICATION_ITEM.SET_CITY_BOUNDING_BOX,
      title: 'common.training',
      text: 'oneTimeNotifications.setCityBoundingBox'
    }]
  ]);

  constructor(
    private translateService: TranslateService,
    private dbService: NgxIndexedDBService,
    private toastrService: NbToastrService) {
  }


  private getAlreadyShownById(id: NOTIFICATION_ITEM): Observable<boolean | undefined> {
    return this.dbService.getByID<boolean | undefined>(UserNotificationsService.store(), id);
  }

  private setAlreadyShown(id: NOTIFICATION_ITEM): Observable<any> {
    return this.dbService.add<any>(UserNotificationsService.store(), {id: id, isAlreadyShown: true});
  }

  showNotificationIfNotShown(id: NOTIFICATION_ITEM): void {
    const notificationToShow = this.notificationsMap.get(id);
    if (notificationToShow) {
      this.getAlreadyShownById(id).subscribe(alreadyShown => {
        if (!alreadyShown) {
          this.toastrService.info(
            this.translateService.instant(notificationToShow.text),
            this.translateService.instant(notificationToShow.title), {duration: 0}
          );
          this.setAlreadyShown(id).subscribe();
        }
      });

    }
  }

  showNotification(id: NOTIFICATION_ITEM): void {
    const notificationToShow = this.notificationsMap.get(id);
    if (notificationToShow) {
      this.toastrService.info(
        this.translateService.instant(notificationToShow.text),
        this.translateService.instant(notificationToShow.title), {duration: 0}
      );
    }
  }

}
