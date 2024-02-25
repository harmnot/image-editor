'use client';

import { useState, useRef } from 'react';
import styles from './FileInput.module.css';

interface FileInputProps {
  accept: string;
  title: string;
  subTitle: string;
  onFileSelect: (file: File) => void;
}

export default function FileInput(props: FileInputProps) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    const filetype: string[] = props.accept.split(',')
    const isFileNameExtSame = () => {
      return filetype.some((ext) => {
        const fileTypeExt = ext.split('/')[1];
        if (!file) return false;
        return file.name.endsWith(fileTypeExt);
      });
    }
    // Check file type
    if (file && props.accept && (!filetype.includes(file.type) || !isFileNameExtSame())) {
      setError(`File type must be ${props.accept}`);
      return;
    } else {
      setError('');
    }

    if (file) {
      props.onFileSelect(file);
    }
  };

  const handleClick = (): void => {
    if (!fileInputRef.current) return;
    const fileInput = fileInputRef.current as HTMLInputElement;
    fileInput.click();
  }

  return (
    <>
      <div className={styles.fileWrapper} onClick={handleClick}>
        <input
          style={{display: 'none'}}
          type="file"
          accept={props.accept}
          ref={fileInputRef}
          onChange={handleChange}
        />
        <div className={styles.boxTitle}>
          <span> {props.title}</span>
          <small> {props.subTitle} </small>
        </div>
      </div>
      {
        error != '' && <p className={styles.error}>{error}</p>
      }
    </>
  );
}
