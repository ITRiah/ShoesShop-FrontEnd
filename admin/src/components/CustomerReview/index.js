import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const CustomerReview = () => {
    const [options, setOptions] = useState({
        chart: {
            id: 'line-chart',
        },
        xaxis: {
            categories: ['1⭐', '2⭐', '3⭐', '4⭐', '5⭐'],
        },
        yaxis: {
            title: {
                text: 'Customer Reviews',
            },
        },
    });

    const [series, setSeries] = useState([
        {
            name: 'All',
            data: [100, 200, 300, 500, 600],
        },
        {
            name: 'January',
            data: [10, 20, 30, 40, 900],
        },
        {
            name: 'February',
            data: [20, 30, 40, 50, 60],
        },
        {
            name: 'March',
            data: [30, 40, 50, 60, 70],
        },
    ]);

    return <ReactApexChart options={options} series={series} type="area" height={250} width={360} />;
};

export default CustomerReview;
