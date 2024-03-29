import React, { useEffect, useState } from 'react'
import '../styles/card.scss'
import { ReactComponent as Sun } from '../assets/sun.svg';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
// chart imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

function Card() {
    const [geo, setGeo] = useState<any>({})
    const [date, setDate] = useState<Dayjs>(dayjs())
    const datasetNames: string[] = ['Humidity', 'Temperature', 'Pressure']
    const [datasets, setDatasets] = useState<any[]>([
        [], [], []
    ])
    const [timestamps, setTimestamps] = useState<string[]>([])
    const [currentDataset, setCurrentDataset] = useState<number>(0)

    // set cords and address
    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        function success(pos: any) {
            const crd = pos.coords;
            // pollub cords
            // axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${51.23573679993434}&lon=${22.54812586350462}&accept-language=en`).then((response) => {
            //     setGeo(response.data)
            // })
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${crd.latitude}&lon=${crd.longitude}&accept-language=en`).then((response) => {
                setGeo(response.data)
                // console.log(response.data)
            })
        }

        function error(err: any) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options)
    }, [])

    // set data
    useEffect(() => {
        setTimeout(() => {
            setDate(dayjs())
            setTimestamps((old) => [...old, dayjs().format('hh:mm:ss')])
            axios.get(`http://192.168.153.53/data`).then((response) => {
                const newDatasets = [...datasets]
                newDatasets[1].push(response.data[0].value)
                newDatasets[0].push(response.data[1].value)
                newDatasets[2].push(response.data[2].value)
                setDatasets(newDatasets)
            })
        }, 5000)
    }, [timestamps])

    // change dataset
    const nextDataset = () => {
        if (currentDataset === 2) setCurrentDataset(0)
        else setCurrentDataset(currentDataset + 1)
    }

    const previousDataset = () => {
        if (currentDataset === 0) setCurrentDataset(2)
        else setCurrentDataset(currentDataset - 1)
    }

    // chart config
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Filler,
    );

    const options = {
        responsive: true,
    };

    const data = {
        labels: timestamps,
        datasets: [
            {
                fill: true,
                label: datasetNames[currentDataset],
                data: datasets[currentDataset],
                borderColor: '#279AF1',
                backgroundColor: 'rgba(39, 154, 241, 0.5)',
                tension: 0.25
            },
        ],
    };

    return (
        <div className='card'>
            <div className='card__parameters'>
                <div className='card__parameters__date'>
                    <div>{date.format('dddd')}</div>
                    <div>{date.format('DD MMMM YYYY')}</div>
                    <div>{geo?.address?.city ? geo?.address?.city : geo?.address?.village}, {geo?.address?.country}</div>
                </div>
                <div className='card__parameters__time'>
                    {date.format('HH:mm')}
                </div>
                <div className='card__parameters__data'>
                    <Sun className='card__parameters__data__sun' />
                    <div>
                        <div>Humidity: {(datasets[0].reduce((a: any, b: any) => a + b, 0) / datasets[0].length || 0).toFixed(2)}%</div>
                        <div>Temperature: {(datasets[1].reduce((a: any, b: any) => a + b, 0) / datasets[1].length || 0).toFixed(2)}°C</div>
                        <div>Pressure: {(datasets[2].reduce((a: any, b: any) => a + b, 0) / datasets[2].length || 0).toFixed(2)}hPa</div>
                    </div>
                </div>
            </div>
            <div className='card__visualization'>
                <h1 className='card__visualization__title'>
                    <span onClick={previousDataset}>🡠</span>
                    <span>{datasetNames[currentDataset]}</span>
                    <span onClick={nextDataset}>🡢</span>
                </h1>
                <Line options={options} data={data} />
            </div>
        </div>
    )
}

export default Card