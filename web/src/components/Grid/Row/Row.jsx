import React from 'react';
import cls from 'classnames';
import styles from './Row.module.scss';

const Row = ({ children, style, className }) => (
  <div className={cls(styles.Row, className)} style={style}>
    {children}
  </div>
);

export default Row;
