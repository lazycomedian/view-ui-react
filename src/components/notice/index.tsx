import { IVU } from '../../typings';
import NotificationFactory from '../../utils/notificationFactory';
import { NoticeOption } from '../../utils/notificationFactory/types';

const prefixCls = 'ivu-notice';

const prefixKey = 'ivu_notice_key_';

const transitionName = 'move-notice';

const iconTypes: Record<Exclude<IVU.NotificationType, 'loading'>, IVU.IconType> = {
  info: 'ios-information-circle',
  success: 'ios-checkmark-circle',
  warning: 'ios-alert',
  error: 'ios-close-circle',
};

const notificationFactory = new NotificationFactory({
  defaultConfig: { top: 24, duration: 4.5, right: 0 },
  prefixCls,
  prefixKey,
  iconTypes,
  transitionName,
});

export default {
  open: (options: NoticeOption) => notificationFactory.notice('normal', options),
  info: (options: NoticeOption) => notificationFactory.notice('info', options),
  success: (options: NoticeOption) => notificationFactory.notice('success', options),
  warning: (options: NoticeOption) => notificationFactory.notice('warning', options),
  error: (options: NoticeOption) => notificationFactory.notice('error', options),
  notice: notificationFactory.notice,
  config: notificationFactory.config,
  destroy: notificationFactory.destroy,
} as const;
