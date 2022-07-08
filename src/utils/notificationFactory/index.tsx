import classNames from 'classnames';
import React, { isValidElement } from 'react';
import Notification, { NotificationInstance } from '../../lib/rc-notification';
import { NoticeContent } from '../../lib/rc-notification/Notification';
import { IVU } from '../../typings';
import type { DefaultConfig, MessageOption, NoticeOption, NotificationFactoryArgs } from './types';

class NotificationFactory implements NotificationFactoryArgs {
  private instance: NotificationInstance | null = null;

  /** 用于拼接唯一值；同时是当前子实例id */
  private key: number = 1;

  /** icon图标类名前缀 */
  public static readonly iconPrefixCls = 'ivu-icon';

  public readonly defaultConfig: DefaultConfig;

  public readonly prefixCls: string;

  public readonly prefixKey: string;

  public readonly iconTypes: Record<string, IVU.IconType>;

  public readonly transitionName: string;

  /**
   * 初始化实例基本配置
   *
   * @param {NotificationFactoryArgs} args
   */
  constructor(args: NotificationFactoryArgs) {
    this.defaultConfig = args.defaultConfig;
    this.prefixCls = args.prefixCls;
    this.prefixKey = args.prefixCls;
    this.iconTypes = args.iconTypes;
    this.transitionName = args.transitionName;
  }

  /**
   * 创建Notification实例
   *
   * @returns {NotificationInstance}
   */
  private async getInstance(): Promise<NotificationInstance> {
    if (this.instance) return this.instance;

    // 实例不存在则创建
    return new Promise<NotificationInstance>(resolve => {
      Notification.newInstance(
        {
          prefixCls: this.prefixCls,
          style: { top: `${this.defaultConfig.top}px`, right: `${this.defaultConfig.right}px` },
          transitionName: this.transitionName,
          maxCount: this.defaultConfig.maxCount,
        },
        notificationInstance => {
          // 在回调中二次判断实例是否已存在
          // 避免同时创建多个实例时引发的dom并发创建问题
          if (this.instance) return resolve(this.instance);

          this.instance = notificationInstance;
          resolve(notificationInstance);
        },
      );
    });
  }

  /**
   * 构建基本提示通用架子
   *
   * @param args
   * @returns close
   */
  private async create(args: NoticeContent) {
    const instance = await this.getInstance();

    instance.notice({
      key: `${this.prefixKey}${this.key}`,
      duration: args.duration ?? this.defaultConfig.duration,
      onClose: args.onClose,
      closable: args.closable,
      closeIcon: args.closeIcon || <i className="ivu-icon ivu-icon-ios-close"></i>,
      background: args.background,
      contentStruct: args.contentStruct,
      isLeaveHeightEffect: args.isLeaveHeightEffect,
    });

    // 用于手动消除
    return (() => {
      const target = this.key++;

      return () => instance.removeNotice(`${this.prefixKey}${target}`);
    })();
  }

  /**
   * 创建message成员主入口
   *
   * @param type 消息类型
   * @param options 配置项
   * @returns
   */
  public async message(type: IVU.NotificationType | 'loading', options: MessageOption | React.ReactNode) {
    const isMessageOption = !!options && typeof options === 'object' && !isValidElement(options);

    /** 自定义构建message content */
    const contentStruct: NoticeContent['contentStruct'] = ({ closeIcon, onRef }) => {
      const iconType = this.iconTypes[type];

      // if loading
      const loadCls = type === 'loading' ? ' ivu-load-loop' : '';

      const componentClass = `${this.prefixCls}-notice`;

      const messageContentClasses = classNames(`${componentClass}-content`, {
        [`${componentClass}-content-${type}`]: type,
        [`${componentClass}-content-background`]: isMessageOption && (options as MessageOption).background,
      });

      return (
        <div className={messageContentClasses} ref={e => onRef(e)}>
          <div className={`${componentClass}-content-text`}>
            <div className={`${this.prefixCls}-custom-content ${this.prefixCls}-${type}`}>
              <i className={`${NotificationFactory.iconPrefixCls} ${NotificationFactory.iconPrefixCls}-${iconType} ${loadCls}`} />
              <span>{isMessageOption ? (options as MessageOption).content : options}</span>
            </div>
          </div>
          <div className={`${componentClass}-content-text`}></div>
          {closeIcon}
        </div>
      );
    };

    const finalOptions = isMessageOption ? { ...options, contentStruct } : { contentStruct };

    return this.create({ ...finalOptions, isLeaveHeightEffect: true });
  }

  /**
   * 创建notice成员主入口
   *
   * @param type 消息类型
   * @param options 配置项
   * @returns
   */
  public async notice(type: IVU.NotificationType | 'normal', options: NoticeOption) {
    const iconType = this.iconTypes[type];

    /** 自定义构建notice content */
    const contentStruct: NoticeContent['contentStruct'] = ({ closeIcon, onRef }) => {
      const componentClass = `${this.prefixCls}-notice`;

      const contentClasses = classNames(
        `${componentClass}-content`,
        // options.render !== undefined ? `${componentClass}-content-with-render` : ''
      );
      const contentWithIcon = classNames(
        type === 'normal' ? `${this.prefixCls}-content-with-icon` : '',
        !options.title && type === 'normal' ? `${this.prefixCls}-content-with-render-notitle` : '',
      );

      const with_desc = options.desc ? ` ${this.prefixCls}-with-desc` : '';

      const outlineIcon = with_desc === '' ? '' : '-outline';

      return (
        <React.Fragment>
          <div className={contentClasses} ref={e => onRef(e)}>
            {type === 'normal' ? (
              <div className={`${this.prefixCls}-custom-content ${this.prefixCls}-with-normal ${with_desc}`}>
                <div className={`${this.prefixCls}-title`}>{options.title}</div>
                <div className={`${this.prefixCls}-desc`}>{options.desc}</div>
              </div>
            ) : (
              <div
                className={`${this.prefixCls}-custom-content ${this.prefixCls}-with-icon ${this.prefixCls}-with-${type} ${with_desc}`}
              >
                <span className={`${this.prefixCls}-icon ${this.prefixCls}-icon-${type}`}>
                  <i
                    className={`${NotificationFactory.iconPrefixCls} ${NotificationFactory.iconPrefixCls}-${iconType}${outlineIcon}`}
                  />
                </span>
                <div className={`${this.prefixCls}-title`}>{options.title}</div>
                <div className={`${this.prefixCls}-desc`}>{options.desc}</div>
              </div>
            )}
          </div>
          <div className={contentWithIcon}></div>
          {closeIcon}
        </React.Fragment>
      );
    };

    return this.create({ ...options, contentStruct });
  }

  /**
   * message修改基本配置的方法
   *
   * @param config 配置项
   * @returns
   */
  public config(config?: Partial<DefaultConfig>): void {
    if (!config) return console.warn('message.config未收到任何参数，请移除调用');

    if (config.top || config.top === 0) this.defaultConfig.top = config.top;

    if (config.duration || config.duration === 0) this.defaultConfig.duration = config.duration;

    if (config.maxCount || config.maxCount === 0) this.defaultConfig.maxCount = config.maxCount;
  }

  /**
   * 销毁所有实例的方法
   *
   * @returns
   */
  public async destroy(): Promise<void> {
    const instance = await this.getInstance();
    this.instance = null;
    instance.destroy();
  }
}

export default NotificationFactory;
