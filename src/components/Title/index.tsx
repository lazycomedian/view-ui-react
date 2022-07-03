import React from 'react';

export interface TitleProps {
  color?: string;
  title: string;
}

const Title: React.FC<TitleProps> = props => {
  return <div style={{ color: props.color }}>{props.title}</div>;
};

export default Title;
