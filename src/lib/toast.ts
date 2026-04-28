type ToastMsg = { title: string; body: string; icon?: string };
type ToastListener = (msg: ToastMsg) => void;

const listeners: ToastListener[] = [];

export const toastEmitter = {
  emit: (msg: ToastMsg) => listeners.forEach((l) => l(msg)),
  subscribe: (l: ToastListener) => {
    listeners.push(l);
    return () => {
      const i = listeners.indexOf(l);
      if (i > -1) listeners.splice(i, 1);
    };
  },
};

export const showToast = (msg: ToastMsg) => toastEmitter.emit(msg);
