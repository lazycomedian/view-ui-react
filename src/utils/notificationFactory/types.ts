import React from 'react';
import { IVU } from '../../typings';

/** 仅允许ReactNode及string类型 */
export type ExtractStringReactNode = Exclude<React.ReactNode, number | boolean | null | undefined>;

export interface MessageOption {
  /**
   * 提示内容
   * 可传入ReactNode或者string类型的内容
   *
   * @override
   */
  content: React.ReactNode;

  /** 自动关闭的延时，单位秒，不关闭可以写 0 */
  duration?: number;

  /** 是否显示背景色 */
  background?: boolean;

  /** 关闭时的回调 */
  onClose?: () => void;

  /** 是否显示关闭按钮 */
  closable?: boolean;

  /** 自定义关闭图标 */
  closeIcon?: React.ReactNode;
}

export interface NoticeOption {
  /** 通知提醒的标题 */
  title?: React.ReactNode;

  /** 通知提醒的内容，为空或不填时，自动应用仅标题模式下的样式 */
  desc?: React.ReactNode;

  /** 自动关闭的延时，单位秒，不关闭可以写 0 */
  duration?: number;

  /** 当前通知的唯一标识 */
  name?: string;

  /** 关闭时的回调 */
  onClose?: () => void;
}

export interface DefaultConfig {
  /** 距离页面顶端的距离 */
  top: number;

  /** 距离页面右侧的距离 */
  right?: number;

  /** 提示停滞时间 单位：秒(s) */
  duration: number;

  /** 允许存在最大数量 */
  maxCount?: number;
}

export interface NotificationFactoryArgs {
  /** 实例默认配置 */
  readonly defaultConfig: DefaultConfig;

  /** css类样式前缀 */
  readonly prefixCls: string;

  /** 唯一key前缀 */
  readonly prefixKey: string;

  /** icon图标集合 */
  readonly iconTypes: Record<string, IVU.IconType>;

  /** 使用的 动画/过渡 名称 */
  readonly transitionName: string;
}
