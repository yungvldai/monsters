import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Row, Column } from '@components/Grid';

import styles from './Attributes.module.scss';

const attrColors = {
  strength: '#7B241C',
  intelligence: '#1A5276',
  dexterity: '#0E6655',
  luck: '#B7950B'
};

const circularBarStyles = (attr) => buildStyles({
  strokeLinecap: 'round',
  textSize: '24px',
  pathTransitionDuration: 0.7,

  pathColor: '#000',//attrColors[attr],
  textColor: '#000',
  trailColor: '#d6d6d6',
  backgroundColor: '#B3B6B7',
});

const Attributes = (props) => {
  const { 
    attrs,
    className
  } = props;

  const [state, setState] = useState({
    strength: 0,
    intelligence: 0,
    dexterity: 0,
    luck: 0
  });

  useEffect(() => {
    setState(attrs);
  }, []);

  return (
    <div className={className}>
      <Row>
        {Object.keys(attrs).map(attr => (
          <Column key={attr} cols={3} colsMobile={6}>
            <div className={styles.attr}>
              <div className={styles.chart}>
                <CircularProgressbar
                  strokeWidth={12}
                  value={state[attr]} 
                  text={attrs[attr]}
                  styles={circularBarStyles(attr)}
                />
              </div>
              <div className={styles.name}>{attr}</div>
            </div>
          </Column>
        ))}
      </Row>
    </div>
  );
}

export default Attributes;