import React from 'react';
import { Block } from './Block';
import './index.scss';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [fromCurrency, setFromCurrency] = useState('BYN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  // const [rates, setRates] = useState({});
  const ratesRef = useRef({});

  useEffect(() => {
    fetch('https://v6.exchangerate-api.com/v6/541e28726fca8f543e94e04e/latest/USD')
    .then((res) => res.json())
    .then((json) => {
      ratesRef.current = json.conversion_rates;
      onChangeToPrice(1);
    })
    .catch(err => {
      console.warn(err);
      alert('Не удалось получить данные из api');
    });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency];
    setToPrice(result.toFixed(3));

    console.log(value);
    {value < 0 && (value = 0)}
    {(value[0] == 0 && value.length > 1 && value[1] != '.') && (value = value.slice(1))}
    setFromPrice(value);
  }

  const onChangeToPrice = (value) => {
    const result = (value / ratesRef.current[toCurrency]) * ratesRef.current[fromCurrency];
    setFromPrice(result.toFixed(3));

    {value < 0 && (value = 0)}
    {(value[0] == 0 && value.length > 1 && value[1] != '.') && (value = value.slice(1))}
    setToPrice(value);
  }

  useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency]);

  useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency]);

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice}/>
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice}/>
    </div>
  );
}

export default App;
