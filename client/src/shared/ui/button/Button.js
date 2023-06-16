import React, { useEffect, useState } from 'react';

import styles from './button.module.css' 

export default function Button({children, type='', variant='main', size='', disabled=false, bottom, onClick=f=>f}){

    const [btnVariant, setBtnVariant] = useState('main')

    useEffect(()=> {
        switch(variant){
            case('second'):
                setBtnVariant('second');
                break;
            case('control'):
                setBtnVariant('control');
                break;
            default:
                setBtnVariant('main');
                break;
        }

    }, [variant])

    const style = {
        marginBottom: bottom,
    }

    return (
        <button
            className={`
                ${styles.btn} ${
                    // variant === 'main' ? styles['btn-main'] : 
                    styles['btn-'+btnVariant]}
                ${styles['btn-'+ size] }
            `} 
            onClick={onClick}
            type={type}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
}

