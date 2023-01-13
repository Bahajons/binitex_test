import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSelector } from "react-redux";

interface DataType {
  country: string;
  case_num: number;
  death_num: number;
  case_count: number;
  death_count: number;
  per_case_1000: number;
  per_death_1000: number;
  // onFilter: boolean;
}
export interface Props {
  props: string
}


const data: DataType[] = [
  {
    country: 'Uzbekistan',
    case_num: 1212,
    death_num: 234,
    case_count: 12332,
    death_count: 33232,
    per_case_1000: 2121,
    per_death_1000: 12432,
    // onFilter: true
  }
];

const TableTs: React.FC<Props> = () => {
  const selector: any = useSelector(state => state)

  const columns: ColumnsType<DataType> = [
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      // filterSearch: true,
      // filteredValue: [selector.country_name],
      // onFilter: (value: any, record: DataType) => {
      //   return String(record.country).toLowerCase().includes(value.toLowerCase())
      // }
    },
    {
      title: 'Number of cases',
      dataIndex: 'case_num',
      key: 'case_num',
      // filterSearch: true,
      // filteredValue: [selector.from, selector.to],
      // onFilter: (value: any, record: DataType) => {

      //   switch (selector.column) {
      //     case 1:
      //       return ((record.case_num > selector.from) && (record.case_num < selector.to))

      //       break;
      //     case 2:
      //       return ((record.death_num > selector.from) && (record.death_num < selector.to))

      //       break;
      //     case 3:
      //       return ((record.case_count > selector.from) && (record.case_count < selector.to))

      //       break;
      //     case 4:
      //       return ((record.death_count > selector.from) && (record.death_count < selector.to))

      //       break;
      //     case 5:
      //       return ((record.per_case_1000 > selector.from) && (record.per_case_1000 < selector.to))

      //       break;
      //     case 6:
      //       return ((record.per_death_1000 > selector.from) && (record.per_death_1000 < selector.to))

      //       break;

      //     default:
      //       return (true)
      //       break;
      //   }

      // },
    },
    {
      title: 'Number of deaths',
      dataIndex: 'death_num',
      key: 'death_num',
    },
    {
      title: 'Number of case total',
      dataIndex: 'case_count',
      key: 'case_count',
    },
    {
      title: 'Number of deaths total',
      dataIndex: 'death_count',
      key: 'death_count',
    },
    {
      title: 'Number of cases per 1000 residents',
      dataIndex: 'per_case_1000',
      key: 'per_case_1000',
    },
    {
      title: 'Number of deaths per 1000 residents',
      dataIndex: 'per_death_1000',
      key: 'per_death_1000',
    }
  ];

  return (
    <>
      <Table columns={columns} dataSource={selector?.list} key={selector.list.lenght} bordered={true} />
      {/* {console.log(selector)} */}
    </>
  )
}

export default TableTs;