import React, { useEffect, useState } from 'react'
import { DatePicker, Select } from 'antd'
import { StyledHome } from './StyledHome'
import { Input } from 'antd';
import { Button } from 'antd';
import TableTs from './sections/TableTs';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Chart as ChartJS,
} from 'chart.js';
import { Chart } from './sections/Chart';

export default function Home(props) {

  const select_option = [
    {
      label: 'Number of cases',
      value: 'case_num'
    },
    {
      label: 'Number of deaths',
      value: 'death_num'
    },
    {
      label: 'Number of case total',
      value: 'case_count'
    },
    {
      label: 'Number of death total',
      value: 'death_count'
    },
    {
      label: 'Number of cases per 1000 residents',
      value: 'per_case_1000'
    },
    {
      label: 'Number of deaths per 1000 residents',
      value: 'per_death_1000'
    }
  ]

  const selector = useSelector(state => state)
  const dispatch = useDispatch()

  const { Search } = Input;
  // Period data from 
  const [period_from_date, setPeriod_from_date] = useState()

  // Period data to 
  const [period_to_date, setPeriod_to_date] = useState()

  // Option
  const [option, setOption] = useState(true);

  // search country
  const [inputCountry, setInputCountry] = useState('')

  // Filter by
  const [filterBy, setFilterBy] = useState()
  // Value from
  const [valFrom, setValFrom] = useState()
  const [valTo, setValTo] = useState()

  const [sortBy, setSortBy] = useState('country') // country, case_num, death_num, case_count, death_count, per_case_1000, per_death_1000
  const [sortType, setSortType] = useState('') // '','DESC'


  const reset_filtr = () => {
    setInputCountry('')
    setFilterBy('')
    setValFrom('')
    setValTo('')
  }



  useEffect(() => {
    get_data_covid_group_for_main_table()
  }, [props.props, period_from_date, period_to_date, inputCountry, filterBy, valFrom, valTo, selector?.country_name])

  function containsNumbers(str) {
    return /\d/.test(str);
  }

  function get_data_covid_group_for_main_table(
    filter_field = filterBy,
    from_date = period_from_date,
    to_date = period_to_date,
    value_from = valFrom,
    value_to = valTo,
    filter_text = inputCountry
  ) {


    setSortBy('country')
    setSortType('')

    let filter_sql_where_date = 'WHERE '
    let filter_sql_where_count = 'WHERE '
    if (from_date && to_date) {
      filter_sql_where_date += `dateRep BETWEEN date('${from_date}') AND date('${to_date}')`
    } else if (from_date) {
      filter_sql_where_date += `dateRep > date('${from_date}')`
    } else if (to_date) {
      filter_sql_where_date += `dateRep < date('${to_date}')`
    }

    if (filter_text) {
      filter_sql_where_count += (filter_sql_where_count.length > 6) ? ' AND ' : ''
      filter_sql_where_count += ` country LIKE '%${filter_text}%'  ${filter_field ? ' and' : ''}`
    }

    if (value_from) {
      filter_sql_where_count += ` ${filter_field} > ${value_from}`
    }

    if (value_to) {
      filter_sql_where_count += (filter_sql_where_count.length > 7) ? ' AND ' : ''
      filter_sql_where_count += ` ${filter_field} < ${value_to} `
    }
    let sql_query = `
    Select * from 
    (SELECT countriesAndTerritories as country, 
        SUM(cases) as case_num , 
        rowid as key,
        SUM(deaths) as death_num from covid
        ${(filter_sql_where_date.length > 6) ? filter_sql_where_date : ''}
        GROUP BY countriesAndTerritories
        ) as result
        RIGHT JOIN 
        (SELECT countriesAndTerritories as country_total, SUM(cases) as case_count, SUM(deaths) as death_count, ROUND((SUM(CAST(cases AS real))*1000)/popData2019,5) as per_case_1000,
        ROUND((SUM(CAST(deaths AS real))*1000)/popData2019,5) as per_death_1000 FROM covid
        GROUP BY countriesAndTerritories
        ) AS total_result
        ON result.country = total_result.country_total
        
        ${(filter_sql_where_count.length > 7) ? filter_sql_where_count + ' and country is not null' : 'where country is not null'} 

        ORDER BY ${sortBy} ${sortType}
        `
    // console.log(' --where-- ', filter_sql_where_date)

    // console.log(' --having--  ', filter_sql_where_count)
    // console.log(' -- sql -- ', sql_query)
    const db = window.openDatabase('data', '1.0', 'data', 100 * 1024 * 1024);
    db.transaction(t => {
      t.executeSql(sql_query, [], function (tx, results) {
        // console.log(results.rows)
        // console.log('/////', Object.values(results.rows))

        dispatch({ type: 'DATA', action: Object.values(results.rows) })
        get_data_covid_group_by_cases_deaths_for_chart()
      }, null)
      // console.log("done...")
    }, e => console.error(e));
  }



  function get_data_covid_group_by_cases_deaths_for_chart(
    from_date = period_from_date,
    to_date = period_to_date,
    country = selector?.country_name
  ) {

    let filter_sql_where_date = 'WHERE '
    if (from_date && to_date) {
      filter_sql_where_date += `dateRep > date('${from_date}') AND dateRep < date('${to_date}')`
    } else if (from_date) {
      filter_sql_where_date += `dateRep > date('${from_date}')`
    } else if (to_date) {
      filter_sql_where_date += `dateRep < date('${to_date}')`
    }
    if (country) {
      if (filter_sql_where_date.length < 7) {
        filter_sql_where_date += `countriesAndTerritories = '${country}'`
      }
      else {
        filter_sql_where_date += ` and countriesAndTerritories = '${country}'`

      }
    }

    let sql = `
    Select dateRep, SUM(cases) as case_count, SUM(deaths) as death_count from covid
    ${filter_sql_where_date.length > 6 ? filter_sql_where_date : ''}

    GROUP by dateRep
   `
    // console.log('-----sql---', sql)
    const db = window.openDatabase('data', '1.0', 'data', 100 * 1024 * 1024);
    db.transaction(t => {
      t.executeSql(sql, [], function (tx, results) {
        dispatch({ type: 'CHART', action: Object.values(results.rows) })
        // console.log(results.rows)
        // console.log("For chart = > ", Object.values(results.rows))

      }, null)
      // console.log("done...")
    }, e => console.error(e));
    get_country_from_covid()
  }

  function get_country_from_covid() {
    let sql = `
    Select countriesAndTerritories as label, countriesAndTerritories as value from covid
    GROUP by countriesAndTerritories
   `
    const db = window.openDatabase('data', '1.0', 'data', 100 * 1024 * 1024);
    db.transaction(t => {
      t.executeSql(sql, [], function (tx, results) {
        dispatch({ type: 'COUNTRY', action: Object.values(results.rows) })
        // console.log("For country = > ", Object.values(results.rows))
      }, null)
      // console.log("done...")
    }, e => console.error(e));
  }


  return (
    <div>
      <StyledHome>
        <div className='container'>
          <div className='date'>
            <h3>Period from</h3>
            <DatePicker format={['YYYY-MM-DD']}
              status={(period_from_date > period_to_date) ? "error" : 'success'}
              onSelect={e => setPeriod_from_date(moment(e.$d).format('YYYY-MM-DD'))}
            />
            <h3>to</h3>
            <DatePicker format={['YYYY-MM-DD']}
              status={(period_from_date > period_to_date) ? "error" : 'success'}
              onSelect={e => setPeriod_to_date(moment(e.$d).format('YYYY-MM-DD'))} />
            {/* {console.log('From=>', period_from_date, 'To =>', period_to_date)} */}
          </div>
          {/* {console.log(props)} */}
          <div>
            <div className="option">
              <ul>
                <li className={option ? 'active' : 'inactive'} onClick={() => setOption(true)}>Table</li>
                <li className={option ? 'inactive' : 'active'} onClick={() => setOption(false)}>Chart</li>
              </ul>
            </div>
            {option ? <div className='Table'>
              <div className="row">
                <div className="col-6 col-sm-3 my-2">
                  <Input placeholder="Country"
                    status={containsNumbers(inputCountry) ? 'error' : 'success'}
                    onChange={(e) => {
                      setInputCountry(e.target.value)
                    }}
                    name='country_name'
                    value={inputCountry}
                  />
                </div>
                <div className="col-6 col-sm-3 my-2">
                  <Select className='select'
                    size={'middle'}
                    placeholder='Select'
                    name='column'
                    onChange={(e) => {
                      dispatch({ type: 'column', action: e });
                      setFilterBy(e)
                    }}
                    value={filterBy}
                    style={{
                      width: '100%',
                    }}
                    options={select_option}
                  />
                </div>
                <div className="col-6 col-sm-3 my-2">
                  <Input placeholder="Value from"
                    onChange={(e) => { setValFrom(e.target.value) }}
                    value={valFrom}
                    type='number'
                    name='from'
                    status={(valFrom > valTo) ? 'error' : 'sucess'}
                    readOnly={filterBy ? false : true}
                  />
                </div>
                <div className="col-6 col-sm-3 my-2">
                  <Input placeholder="Value to"
                    onChange={(e) => { setValTo(e.target.value) }}
                    value={valTo}
                    type='number'
                    name='to'
                    status={(valFrom > valTo) ? 'error' : 'sucess'}
                    readOnly={valFrom ? false : true}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-1 mb-2 reset" >
                {(inputCountry || filterBy || valFrom || valTo) ?
                  <Button size='small'
                    onClick={() => {
                      reset_filtr()
                    }}>
                    Reset filter
                  </Button> : <></>
                }
              </div>
              <div>
                <div className='table_scroll'>
                  <TableTs />
                </div>
              </div>
            </div>
              :
              <div className='chart'>
                <div>
                  <Chart />
                </div>
              </div>
            }
          </div>
        </div>
      </StyledHome>
    </div>

  )
}
