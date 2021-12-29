import React from 'react';
import cls from 'classnames';
import styles from './Column.module.scss';

const Column = (props) => {
  const { children, className, style, cols, colsMobile, colsTablet } = props;

  const fullClassName = cls(
    className,
    styles.Column,
    styles[`cols-${cols}`],
    { [styles[`colsTablet-${colsTablet}`]]: colsTablet != null },
    { [styles[`colsMobile-${colsMobile}`]]: colsMobile != null }
  );

  return (
    <div className={fullClassName} style={style}>
      {children}
    </div>
  );
};

export default Column;
