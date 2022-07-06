import classNames from 'classnames';
import React from 'react';

const prefixCls = 'ivu-card';

type NativeCardProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'title'>;

export interface CardProps extends NativeCardProps {
  /** 是否显示边框，建议在灰色背景下使用 */
  bordered?: boolean;

  /** 禁用鼠标悬停显示阴影 */
  hoverable?: boolean;

  /** 卡片阴影，建议在灰色背景下使用 */
  shadow?: boolean;

  /** 卡片内部间距，单位 px */
  padding?: number;

  /** 卡片标题 */
  title?: React.ReactNode;

  /** 额外显示的内容，默认位置在右上角 */
  extra?: React.ReactNode;
}

const Card: React.FC<CardProps> = props => {
  const { bordered = true, hoverable, shadow, padding = 16, title, extra, className, children, ...restProps } = props;

  const classes = classNames(
    `${prefixCls}`,
    {
      [`${prefixCls}-bordered`]: bordered && !shadow,
      [`${prefixCls}-dis-hover`]: !hoverable || shadow,
      [`${prefixCls}-shadow`]: shadow,
    },
    className,
  );

  return (
    <div className={classes} {...restProps}>
      {(!!title || !!extra) && (
        <div className={`${prefixCls}-head`}>
          <div className={`${prefixCls}-head-title`}>{title}</div>
          {!!extra && <div>{extra}</div>}
        </div>
      )}
      <div className={`${prefixCls}-body`} style={props.padding ? { padding } : {}}>
        {children}
      </div>
    </div>
  );
};

export default Card;
