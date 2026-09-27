import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  padding = 'md',
  elevation = 'none',
  as: Component = 'div',
  ...rest
}) => {
  const cardClasses = [
    'card',
    `card-p-${padding}`,
    `card-elev-${elevation}`,
    bordered ? 'card-bordered' : '',
    hoverable ? 'card-hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={cardClasses} {...rest}>
      {children}
    </Component>
  );
};

export default Card;
