import classNames from 'classnames';
import React from 'react';
import { IVU } from '../../typings';

const prefixCls = 'ivu-divider';

export interface DividerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** 水平还是垂直类型，可选值为 horizontal 或 vertical */
  direction?: IVU.Direction;

  /** 分割线标题的位置，可选值为 left、right 或 center */
  orientation?: 'left' | 'right' | 'center';

  /** 是否虚线 */
  dashed?: boolean;

  /** 文字是否显示为普通正文样式 */
  plain?: boolean;

  /** 尺寸，可选值为 small 或 default */
  size?: Extract<IVU.Size, 'small' | 'default'>;
}

const Divider: React.FC<DividerProps> = props => {
  const {
    direction = 'horizontal',
    orientation = 'center',
    dashed = false,
    plain = false,
    size = 'default',
    className,
    children,
    ...restProps
  } = props;

  const classes = classNames(
    `${prefixCls}`,
    `${prefixCls}-${direction}`,
    `${prefixCls}-${size}`,
    {
      [`${prefixCls}-with-text`]: !!children && orientation === 'center',
      [`${prefixCls}-with-text-${orientation}`]: !!children,
      [`${prefixCls}-dashed`]: !!dashed,
      [`${prefixCls}-plain`]: plain,
    },
    className,
  );

  return (
    <div className={classes} {...restProps}>
      {!!children && <span className={`${prefixCls}-inner-text`}>{children}</span>}
    </div>
  );
};

export default Divider;
