import classNames from 'classnames';
import React from 'react';
import { IVU } from '../../typings';
import ButtonGroup from '../ButtonGroup';
import Icon from '../Icon';

const prefixCls = 'ivu-btn';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export interface ButtonProps extends Omit<NativeButtonProps, 'type'> {
  /** 按钮类型，可选值为 default、primary、dashed、text、info、success、warning、error或者不设置 */
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'info' | 'success' | 'warning' | 'error';

  /** 按钮形状，可选值为 circle 或者不设置 */
  shape?: IVU.Shape;

  /** 按钮大小，可选值为 large、small、default 或者不设置  */
  size?: IVU.Size;

  /** 设置按钮为加载中状态 */
  loading?: boolean;

  /** 设置按钮为禁用状态 */
  disabled?: boolean;

  /** 幽灵属性，使按钮背景透明 */
  ghost?: boolean;

  /** 开启后，按钮的长度为 100% */
  long?: boolean;

  /** 设置 button 原生的 type，可选值为 button、submit、reset */
  htmlType?: 'button' | 'submit' | 'reset';

  /** 设置按钮的图标类型 从官方提供的图库中选择 */
  iconType?: IVU.IconType;

  /** 设置按钮的自定义图标 */
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> & { Group: typeof ButtonGroup } = props => {
  const {
    children,
    type,
    htmlType = 'button',
    shape,
    size = 'default',
    ghost,
    long = false,
    loading = false,
    disabled,
    className,
    iconType,
    icon,
    ...restProps
  } = props;

  const classes = classNames(
    `${prefixCls}`,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-long`]: long,
      [`${prefixCls}-${shape}`]: !!shape,
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-loading`]: loading != null && loading,
      [`${prefixCls}-icon-only`]: !children && (!!icon || !!iconType || loading),
      [`${prefixCls}-ghost`]: ghost,
    },
    className,
  );

  const prefixChildren: React.ReactNode[] = [
    loading && <Icon className="ivu-load-loop" key="loading" type="ios-loading" />,
    !icon && !!iconType && !loading && <Icon key="custom" type={iconType} />,
    icon && icon,
    !!children && <span key="placeholder"></span>,
  ].filter(Boolean);

  return (
    <button className={classes} type={htmlType} disabled={disabled} {...restProps}>
      {[...prefixChildren, children]}
    </button>
  );
};

Button.Group = ButtonGroup;

export default Button;
