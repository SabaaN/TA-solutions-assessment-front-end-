import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState({});
  const [from, setFrom] = useState('JPY');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('conversionHistory')) || [];
  });

  useEffect(() => {
    fetch(`https://ta-solutions-assessment-back-end-production.up.railway.app/api/convert?...`)
      .then((res) => res.json())
      .then((data) => setCurrencies(data.data))
      .catch(console.error);
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://ta-solutions-assessment-back-end-production.up.railway.app/api/convert?...`)

      const data = await res.json();
      setResult(data.result);

      const record = {
        from,
        to,
        amount,
        result: data.result,
        rate: data.rate,
        date: new Date().toLocaleString(),
      };

      const updatedHistory = [record, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Conversion failed', err);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1 style={{color: 'blue'}}>CURRENCY CONVERTER</h1>
      <h3 style={{color: 'black', fontStyle: "italic"}}>TA Solutions Assessment - By Saba Naveed</h3>
      <div className="converter">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {Object.entries(currencies).map(([code, info]) => (
            <option key={code} value={code}>
              {code} - {info.name}
            </option>
          ))}
        </select>

        <span style={{fontWeight: 'bold'}}>convert to</span>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {Object.entries(currencies).map(([code, info]) => (
            <option key={code} value={code}>
              {code} - {info.name}
            </option>
          ))}
        </select>

        <button onClick={handleConvert} disabled={loading}>
          {loading ? 'Converting...' : 'Convert'}
        </button>

        {result && (
          <h2>
            {amount} {from} = {result.toFixed(2)} {to}
          </h2>
        )}
      </div>

      <div className="history">
        <h3 style={{color: "blue"}}>HISTORY</h3>
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              {item.amount} {item.from} → {item.result.toFixed(2)} {item.to}, 
              {item.rate.toFixed(4)} on {item.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;