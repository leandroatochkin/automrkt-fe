import { toast } from "react-toastify"

interface INotification {
    send(msg: string, severity: 'info' | 'success' | 'warning' | 'error'): void;
}

class Toast implements INotification {
  send(message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') {
    return toast[severity](message);
  }
}

class NotificationFactory{
    static create(type: 'toast'){
        if(type === 'toast') return new Toast()
        throw new Error('Unknown notification type')
    }
}

const notifier = NotificationFactory.create('toast');

export const notify = (message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
     notifier.send(message, severity)
}