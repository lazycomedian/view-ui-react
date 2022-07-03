import classNames from 'classnames';
import React from 'react';
import { IVU } from '../../typings';

const prefixCls = 'ivu-icon';

export interface IconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  /** 图标的名称 */
  type?: IVU.IconType;

  /** 图标的大小，单位是 px */
  size?: number | string;

  /** 图标的颜色  */
  color?: string;

  /** 自定义图标 */
  custom?: string;
}

const Icon: React.FC<IconProps> = props => {
  const { type, size, color, custom, className, style, ...restProps } = props;

  const classes = classNames(
    `${prefixCls}`,
    {
      [`${prefixCls}-${type}`]: !!type,
      [`${custom}`]: !!custom,
    },
    className,
  );

  const getStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (size) styles.fontSize = `${size}px`;

    if (color) styles.color = color;

    return { ...styles, ...style };
  };

  return <i className={classes} style={getStyles()} {...restProps}></i>;
};

export default Icon;
