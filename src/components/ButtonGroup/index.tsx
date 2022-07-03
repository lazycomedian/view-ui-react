import classNames from 'classnames';
import React from 'react';
import { IVU } from '../../typings';

const prefixCls = 'ivu-btn-group';

export interface ButtonGroupProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** 按钮组合大小，可选值为 large、small、default 或者不设置 */
  size?: IVU.Size;

  /** 按钮组合形状，可选值为 circle 或者不设置 */
  shape?: IVU.Shape;

  vertical?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = props => {
  const { size = 'default', shape, vertical, className, ...restProps } = props;

  const classes = classNames(
    `${prefixCls}`,
    {
      [`${prefixCls}-${size}`]: !!size,
      [`${prefixCls}-${shape}`]: !!shape,
      [`${prefixCls}-vertical`]: vertical,
    },
    className,
  );

  return (
    <div className={classes} {...restProps}>
      {props.children}
    </div>
  );
};

export default ButtonGroup;
