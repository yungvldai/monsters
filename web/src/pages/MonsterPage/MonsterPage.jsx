import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { wait } from "../../utils";
import api from '../../services/api';

import Card from "@components/Card";

import Attributes from "./blocks/Attributes";

import styles from './MonsterPage.module.scss';

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  })
}

const fetchByToken = async (token) => {
  try {
    const [response] = await Promise.all([
      api.get(`monsters/${token}?for_web=true`), 
      wait(500) // wait 500 ms to avoid skeleton blinking
    ]);

    if (response.ok) {
      const result = await response.json();
      const { imageUrl } = result;

      await loadImage(imageUrl); 
      // image will load, after we take it from cache
      // also we check image availability here

      return {
        isError: false,
        monster: result
      };
    }

    return {
      isError: true
    };
  } catch (e) {
    return {
      isError: true
    };
  }
}

const MonsterPage = () => {
  const [state, setState] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    fetchByToken(token).then(setState);
  }, [token]);

  const contentNode = useMemo(() => {
    if (!state) {
      return (
        <div>
          Skeleton
        </div>
      )
    }

    const { isError } = state;

    if (isError) {
      return (
        <div>
  
        </div>
      );
    }

    const { 
      monster: {
        imageUrl,
        name,
        attrs,
        rarity,
        race,
        _h
      }
    } = state;

    return (
      <>
        <div className={styles.imageContainer}>
          <img className={styles.monsterImage} src={imageUrl} />
        </div>
        <Card className={styles.monsterCard}>
          <div className={styles.monsterInfo}>
            <div className={styles.gap} />
            <div className={styles.textInfo}>
              <h1 className={styles.name}>{name}</h1>
              <div>
                <a href={imageUrl} download={`${_h}.png`}>Download</a>
              </div>
              <div className={styles.subheader}>
                <span className={styles.rarity}>{rarity}</span>&nbsp;
                <span className={styles.race}>{race}</span>
              </div>
              <Attributes attrs={attrs} className={styles.attributes} />
              <div>
                https://mosaic.monster/{token}
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  }, [state]);


  return (
    <div className={styles.MonsterPage}>
      <div className={styles.contentCard}>
        {contentNode}
      </div>
    </div>
  );
}

export default MonsterPage;