import { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Loader from './components/sections/Loader';




function App() {

  const [isloading, setIsloading] = useState(true)
  const [ref, setRef] = useState('')

  useEffect(() => {
    GetData()
  }, [])



  const write_to_web_sql = (data: any) => {
    const db = window.openDatabase('data', '1.0', 'data', 100 * 1024 * 1024);
    db.transaction(t => {
      t.executeSql('DROP TABLE IF EXISTS covid')
      t.executeSql('CREATE TABLE IF NOT EXISTS covid (dateRep TEXT, day TEXT, month TEXT, year TEXT, cases INTEGER, deaths INTEGER, countriesAndTerritories TEXT, geoId TEXT, countryterritoryCode TEXT, popData2019 INTEGER, continentExp TEXT, "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" TEXT)');
      for (let d of data) {
        t.executeSql(`INSERT INTO covid (dateRep, day, month, year, cases, deaths, countriesAndTerritories, geoId, countryterritoryCode, popData2019, continentExp, "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000") VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`${d.year}-${d.month}-${d.day}`, d.day, d.month, d.year, d.cases, d.deaths, d.countriesAndTerritories, d.geoId, d.countryterritoryCode, d.popData2019, d.continentExp, d['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']]);
      }
      // console.log("done...")
      setIsloading(false)
      setRef('Written to sql')
    }, e => console.error(e));
  }

  const GetData = () => {
    axios.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/")
      .then((res) => {
        write_to_web_sql(res.data.records);
        // console.log(res);
        setIsloading(false);
        setRef('get_from_api')
      })
      .catch((err) => {
        // console.log(err);
        setIsloading(true)
      })
  }

  const style = {
    backgroundImage: 'url(./img/bg_image.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div className="App" style={style}>
      {isloading ? <Loader /> : ""}
      <Home props={ref} />
    </div>
  );
}

export default App;
