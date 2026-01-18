import type { NotificationStatus } from "./NotificationStatus";

export interface Notification {
    id: string;
    from_uid: string;
    to_uid: string;
    contract_id: string;
    contract_title?: string;
    amount: number;
    status: NotificationStatus;
    created_at: string;
}