import classNames from 'classnames';
import * as React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { isClient } from '../../utils';

interface DivProps extends React.HTMLProps<HTMLDivElement> {
  // Ideally we would allow all data-* props but this would depend on https://github.com/microsoft/TypeScript/issues/28960
  'data-testid'?: string;
}

export interface NoticeProps {
  prefixCls: string;
  style?: React.CSSProperties;
  className?: string;
  duration?: number | null;
  children?: React.ReactNode;
  updateMark?: string;
  /** Mark as final key since set maxCount may keep the key but user pass key is different */
  noticeKey: React.Key;
  closeIcon?: React.ReactNode;
  closable?: boolean;
  props?: DivProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClose?: (key: React.Key) => void;
  msgType?: string;
  background?: boolean;

  /** 是否开启子消息实例销毁时高度变化过度 */
  isLeaveHeightEffect?: boolean;

  /**
   * 试用方法传入content
   */
  contentStruct?: (args: { closeIcon: React.ReactNode; onRef: (e: HTMLDivElement | null) => void }) => React.ReactNode;

  /** @private Only for internal usage. We don't promise that we will refactor this */
  holder?: HTMLDivElement;

  /** @private Provided by CSSMotionList */
  visible?: boolean;
}

interface NoticeState {
  withDesc: boolean;
}

export default class Notice extends Component<NoticeProps, NoticeState> {
  static defaultProps = {
    onClose() {},
    duration: 1.5,
  };

  closeTimer: NodeJS.Timeout | null = null;

  el: HTMLDivElement | null = null;

  contentRef: HTMLDivElement | null = null;

  state = {
    withDesc: false,
  };

  componentDidMount() {
    this.handleEnter();
    this.clearCloseTimer();
    this.startCloseTimer();

    // check if with desc in Notice component
    if (this.props.prefixCls === 'ivu-notice') {
      const desc = this.contentRef?.querySelectorAll(`.${this.props.prefixCls}-desc`)[0];
      this.setState({ withDesc: desc ? desc.innerHTML !== '' : false });
    }
  }

  componentDidUpdate(prevProps: NoticeProps) {
    if (
      this.props.duration !== prevProps.duration ||
      this.props.updateMark !== prevProps.updateMark ||
      // Visible again need reset timer
      (this.props.visible !== prevProps.visible && this.props.visible)
    ) {
      this.restartCloseTimer();
    }
  }

  handleEnter() {
    if (!this.props.isLeaveHeightEffect || !this.el) return;
    this.el.style.height = this.el.scrollHeight + 'px';
  }

  handleLeave() {
    if (!this.props.isLeaveHeightEffect || !this.el) return;
    // 优化一下，如果当前只有一个 Message，则不使用 js 过渡动画，这样更优美
    if (isClient && document.getElementsByClassName('ivu-message-notice').length !== 1) {
      this.el.style.height = '0px';
      this.el.style.paddingTop = '0px';
      this.el.style.paddingBottom = '0px';
    }
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  close = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    e && e.stopPropagation();

    this.handleLeave();
    this.clearCloseTimer();
    this.props.onClose && this.props.onClose(this.props.noticeKey);
  };

  startCloseTimer = () => {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  };

  clearCloseTimer = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  };

  restartCloseTimer() {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  get messageContentClasses() {
    const componentClass = `${this.props.prefixCls}-notice`;

    return classNames(`${componentClass}-content`, {
      [`${componentClass}-content-${this.props.msgType}`]: this.props.msgType,
      [`${componentClass}-content-background`]: this.props.background,
    });
  }

  render() {
    const { prefixCls, className, closable, closeIcon, style, onClick, children, holder } = this.props;
    const componentClass = `${prefixCls}-notice`;
    const dataOrAriaAttributeProps = Object.keys(this.props).reduce((acc: Record<string, string>, key: string) => {
      if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
        acc[key] = (this.props as any)[key];
      }
      return acc;
    }, {});
    const node = (
      <div
        className={classNames(componentClass, {
          [`${className}`]: !!className,
          [`${componentClass}-closable`]: closable,
          [`${componentClass}-with-desc`]: this.state.withDesc,
          [`${componentClass}-with-background`]: this.props.background,
        })}
        ref={e => (this.el = e)}
        style={style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={onClick}
        {...dataOrAriaAttributeProps}
      >
        {this.props.contentStruct ? (
          this.props.contentStruct({
            closeIcon: closable ? (
              <a tabIndex={0} onClick={this.close} className={`${componentClass}-close`}>
                {closeIcon || <span className={`${componentClass}-close-x`} />}
              </a>
            ) : null,
            onRef: e => (this.contentRef = e),
          })
        ) : (
          <div className={this.messageContentClasses} ref={e => (this.contentRef = e)}>
            <div className={`${componentClass}-content-text`}>{children}</div>

            <div className={`${componentClass}-content-text`}></div>

            {closable && (
              <a tabIndex={0} onClick={this.close} className={`${componentClass}-close`}>
                {closeIcon || <span className={`${componentClass}-close-x`} />}
              </a>
            )}
          </div>
        )}
      </div>
    );

    if (holder) {
      return ReactDOM.createPortal(node, holder);
    }

    return node;
  }
}
