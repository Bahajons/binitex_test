import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Select } from 'antd';
import Item from 'antd/es/list/Item';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart of Covid19',
    },
  },
};


export function Chart() {

  const selector = useSelector(state => state)
  const dispatch = useDispatch()
  const labels = selector.chart.map((item, index) => { return index });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Cases',
        data: selector.chart.map((item) => { return item.case_count }),
        borderColor: 'rgb(190, 255, 78)',
        fill: true,
        backgroundColor: 'rgba(193, 235, 53, 0.5)',
        tension: 0.4
      },
      {
        label: 'Death',
        data: selector.chart.map((item) => { return item.death_count }),
        fill: false,
        borderColor: 'rgb(255, 0, 55)',
        backgroundColor: 'rgba(255, 30, 79, 0.5)',
        tension: 0.3
      },
    ],

  };

  return (
    <>
      {console.log("Chart==>", selector)}
      <div className="d-flex align-items-center">
        <h3 style={{ fontWeight: '400', fontSize: '18px' }} className='pr-2 m-0'>Country</h3>
        <Select className='select'
          showSearch
          size={'middle'}
          placeholder='Select'
          name='column'
          onChange={(e) => {
            console.log("select = > ", e);
            dispatch({ type: 'COUNTRY_NAME', action: e })
          }}
          // value={filterBy}
          style={{
            width: '50%',
          }}
          options={selector?.country}
        />
      </div>
      <Line options={options} data={data} />
    </>)
}
