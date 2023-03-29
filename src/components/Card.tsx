import React from 'react'
import '../styles/card.scss'
import { ReactComponent as Sun } from '../assets/sun.svg';

function Card() {
    return (
        <div className='card'>
            <div className='card__parameters'>
                <div className='card__parameters__date'>
                    <div>{'Monday'}</div>
                    <div>{'27 March 2023'}</div>
                    <div>{'Lublin, Poland'}</div>
                </div>
                <div className='card__parameters__time'>
                    {'18:00'}
                </div>
                <div className='card__parameters__data'>
                    <Sun className='card__parameters__data__sun' />
                    <div>
                        <div>{'Humidity: 40%'}</div>
                        <div>{'Temperature: 24°C'}</div>
                    </div>
                </div>
            </div>
            <div className='card__visualization'></div>
        </div>
    )
}

export default Card