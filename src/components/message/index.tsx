import { IVU } from '../../typings';
import NotificationFactory from '../../utils/notificationFactory';
import { MessageOption } from '../../utils/notificationFactory/types';

const prefixCls = 'ivu-message';

const prefixKey = 'ivu_message_key_';

const transitionName = 'move-up';

const iconTypes: Record<IVU.NotificationType | 'loading', IVU.IconType> = {
  info: 'ios-information-circle',
  success: 'ios-checkmark-circle',
  warning: 'ios-alert',
  error: 'ios-close-circle',
  loading: 'ios-loading',
};

const notificationFactory = new NotificationFactory({
  defaultConfig: { top: 24, duration: 1.5 },
  prefixCls,
  prefixKey,
  iconTypes,
  transitionName,
});

type Options = MessageOption | React.ReactNode;

export default {
  info: (options: Options) => notificationFactory.message('info', options),
  success: (options: Options) => notificationFactory.message('success', options),
  warning: (options: Options) => notificationFactory.message('warning', options),
  error: (options: Options) => notificationFactory.message('error', options),
  loading: (options: Options) => notificationFactory.message('loading', options),
  message: notificationFactory.message,
  config: notificationFactory.config,
  destroy: notificationFactory.destroy,
} as const;
