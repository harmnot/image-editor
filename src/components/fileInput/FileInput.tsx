'use client';

import { useState, useRef } from 'react';
import styles from './FileInput.module.css';

export default function FileInput({accept, title, subTitle, onFileSelect}) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    const filetype = accept.split(',')
    const isFileNameExtSame = () => {
      return filetype.some((ext) => {
        const fileTypeExt = ext.split('/')[1];
        return file.name.endsWith(fileTypeExt);
      });
    }
    // Check file type
    if (file && accept && (!file.type.includes(filetype) || !isFileNameExtSame())) {
      setError(`File type must be ${accept}`);
      return;
    } else {
      setError('');
    }

    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current.click();
  }

  return (
    <>
      <div className={styles.fileWrapper} onClick={handleClick}>
        <input
          style={{display: 'none'}}
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleChange}
        />
        <div className={styles.boxTitle}>
          <span> {title}</span>
          <small> {subTitle} </small>
        </div>
      </div>
      {
        error != '' && <p className={styles.error}>{error}</p>
      }
    </>
  );
}
