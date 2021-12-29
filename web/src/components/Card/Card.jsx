import React from 'react';
import cls from 'classnames';
import styles from './Card.module.scss';

const Card = (props) => {
  const { 
    children, 
    className, 
    style, 
    noPadding = false, 
    stopClick = true
  } = props;

  const fullClassName = cls(
    className,
    { [styles['isNoPadding']]: noPadding },
    styles.Card
  );

  const handleClick = event => {
    if (stopClick) {
      event.stopPropagation();
    }
  }

  return (
    <div className={fullClassName} style={style} onClick={handleClick}>
      {children}
    </div>
  );
};

export default Card;
