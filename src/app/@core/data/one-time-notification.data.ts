export interface UserNotifications {
    showNotification(id: NOTIFICATION_ITEM): void;
    showNotificationIfNotShown(id: NOTIFICATION_ITEM): void;
}

export enum NOTIFICATION_ITEM {
    SET_CITY_BOUNDING_BOX = 'SET_CITY_BOUNDING_BOX',
}

export class NotificationItem {
    id: NOTIFICATION_ITEM;
    title: string;
    text: string;
}