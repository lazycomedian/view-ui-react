import classNames from 'classnames';
import React from 'react';
import { IVU } from '../../typings';
import Divider from '../Divider';

const prefixCls = 'ivu-space';

const spaceSize: Record<IVU.Size, number> = { small: 8, default: 16, large: 24 };

const getSize = (s: SpaceProps['size']) => `${typeof s === 'string' ? spaceSize[s] : s || 0}px`;

export interface SpaceProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** 间距大小，当类型为 String 时，可选值有：small、large、default 默认为small ; 作为数组传入时遵循 [x,y] */
  size?: IVU.Size | [number, number] | number;

  /** 布局方向，可选值有：horizontal、vertical */
  direction?: IVU.Direction;

  /** 对齐方式，可选值有：start、end、center、baseline、stretch */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /** 是否自动换行 */
  wrap?: boolean;

  /** 是否显示分隔符，值为 true 时显示默认的分隔符 */
  split?: boolean;

  /** Flex 布局类型，可选值有：inline-flex、flex，值为 flex 时，align 的默认值为 stretch */
  type?: 'inline-flex' | 'flex';
}

const Space: React.FC<SpaceProps> = props => {
  const {
    size = 'small',
    direction = 'horizontal',
    wrap = false,
    split = false,
    type = 'inline-flex',
    align = !!props.align ? props.align : direction === 'horizontal' ? 'center' : type === 'flex' ? 'stretch' : undefined,
    className,
    style,
    children,
    ...restProps
  } = props;

  const classes = classNames(
    `${prefixCls}`,
    `${prefixCls}-${direction}`,
    {
      [`${prefixCls}-flex`]: type === 'flex',
      [`${prefixCls}-wrap`]: wrap,
      [`${prefixCls}-${align}`]: align,
    },
    className,
  );

  const styles = React.useMemo<React.CSSProperties>(() => {
    const styleSheet: React.CSSProperties = {};

    if (['number', 'string'].includes(typeof size)) styleSheet.gap = getSize(size);

    try {
      if (Array.isArray(size)) {
        styleSheet.columnGap = getSize(size[0]);
        styleSheet.rowGap = getSize(size[1]);
      }
    } catch (error: any) {
      console.error('View UI React:[props.size] 请传入合法的两位数组');
    }

    return { ...styleSheet, ...style };
  }, [size, style]);

  const finalChildren = React.useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        const item = (
          <div className="ivu-space-item" key={i}>
            {child}
          </div>
        );
        if (split && i + 1 < children.length) {
          const divider = <div className="ivu-space-split">{<Divider direction="vertical" />}</div>;
          return [item, divider];
        }
        return item;
      });
    }

    return <div className="ivu-space-item">{children}</div>;
  }, [children]);

  return (
    <div className={classes} style={styles} {...restProps}>
      {finalChildren}
    </div>
  );
};

export default Space;
