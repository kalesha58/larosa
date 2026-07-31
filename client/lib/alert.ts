import { Alert as RNAlert, Platform } from 'react-native';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  cancelable?: boolean;
  onDismiss?: () => void;
};

/**
 * Cross-platform alert helper.
 * Uses React Native Alert on iOS/Android and window.confirm/alert on web.
 */
function alert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
  _options?: AlertOptions,
): void {
  if (Platform.OS !== 'web') {
    RNAlert.alert(title, message, buttons, _options);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const actions = buttons?.length
    ? buttons
    : [{ text: 'OK', onPress: undefined as (() => void) | undefined }];

  const cancelBtn = actions.find(b => b.style === 'cancel');
  const confirmBtns = actions.filter(b => b.style !== 'cancel');
  const primary = confirmBtns[confirmBtns.length - 1] ?? actions[0];

  if (actions.length <= 1) {
    window.alert(text);
    primary?.onPress?.();
    return;
  }

  // Multi-button: confirm for the primary action, cancel otherwise
  const labels = actions.map(b => b.text || 'OK').join(' / ');
  const confirmed = window.confirm(`${text}\n\n(${labels})`);
  if (confirmed) {
    primary?.onPress?.();
  } else {
    cancelBtn?.onPress?.();
  }
}

export const Alert = { alert };
