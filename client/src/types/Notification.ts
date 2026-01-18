import { NotificationStatus } from "./NotificationStatus";

export interface Notification {
    n_id: string;
    from_uid: string;
    to_uid: string;
    contract_id: string;
    amount: number;
    status: NotificationStatus;
    created_at: string;
}