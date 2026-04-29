'use client';

import { useState } from 'react';

export default function CalculatorWindow() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const clear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => setDisplay(String(parseFloat(display) * -1));

  const percentage = () => setDisplay(String(parseFloat(display) / 100));

  const sqrt = () => {
    const val = Math.sqrt(parseFloat(display));
    setDisplay(String(val));
    setWaitingForOperand(true);
  };

  const performOp = (nextOp: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !waitingForOperand) {
      let result = prev;
      switch (op) {
        case '+': result = prev + cur; break;
        case '-': result = prev - cur; break;
        case '×': result = prev * cur; break;
        case '÷': result = cur !== 0 ? prev / cur : 0; break;
      }
      const str = String(parseFloat(result.toPrecision(12)));
      setDisplay(str);
      setPrev(result);
    } else {
      setPrev(cur);
    }
    setWaitingForOperand(true);
    setOp(nextOp === '=' ? null : nextOp);
  };

  const btnBase: React.CSSProperties = {
    fontFamily: 'Tahoma, sans-serif', fontSize: 13, cursor: 'pointer',
    border: '1px solid #555', borderRadius: 3,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 36, userSelect: 'none',
    transition: 'filter 0.1s',
  };

  const numBtn: React.CSSProperties = {
    ...btnBase,
    background: 'linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 50%, #b8b8b8 100%)',
    color: '#000', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
  };

  const opBtn: React.CSSProperties = {
    ...btnBase,
    background: 'linear-gradient(180deg, #d0d8e8 0%, #b0b8d0 50%, #a0a8c0 100%)',
    color: '#002060',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
  };

  const eqBtn: React.CSSProperties = {
    ...btnBase,
    background: 'linear-gradient(180deg, #80a8d8 0%, #4878b8 50%, #2858a0 100%)',
    color: '#fff', fontWeight: 'bold',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
  };

  return (
    <div style={{
      background: '#d4d0c8',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      gap: 6,
      fontFamily: 'Tahoma, sans-serif',
    }}>
      {/* Display */}
      <div style={{
        background: '#ffffff',
        border: '2px inset #888',
        borderRadius: 2,
        padding: '6px 10px',
        textAlign: 'right',
        fontSize: 22,
        fontFamily: '"Courier New", monospace',
        color: '#000',
        minHeight: 40,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {display}
      </div>

      {/* Buttons grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
        {/* Row 1 */}
        <button style={opBtn} onClick={clear}>C</button>
        <button style={opBtn} onClick={toggleSign}>±</button>
        <button style={opBtn} onClick={percentage}>%</button>
        <button style={opBtn} onClick={() => performOp('÷')}>÷</button>

        {/* Row 2 */}
        <button style={numBtn} onClick={() => inputDigit('7')}>7</button>
        <button style={numBtn} onClick={() => inputDigit('8')}>8</button>
        <button style={numBtn} onClick={() => inputDigit('9')}>9</button>
        <button style={opBtn} onClick={() => performOp('×')}>×</button>

        {/* Row 3 */}
        <button style={numBtn} onClick={() => inputDigit('4')}>4</button>
        <button style={numBtn} onClick={() => inputDigit('5')}>5</button>
        <button style={numBtn} onClick={() => inputDigit('6')}>6</button>
        <button style={opBtn} onClick={() => performOp('-')}>−</button>

        {/* Row 4 */}
        <button style={numBtn} onClick={() => inputDigit('1')}>1</button>
        <button style={numBtn} onClick={() => inputDigit('2')}>2</button>
        <button style={numBtn} onClick={() => inputDigit('3')}>3</button>
        <button style={opBtn} onClick={() => performOp('+')}>+</button>

        {/* Row 5 */}
        <button style={opBtn} onClick={sqrt}>√</button>
        <button style={numBtn} onClick={() => inputDigit('0')}>0</button>
        <button style={numBtn} onClick={inputDecimal}>.</button>
        <button style={eqBtn} onClick={() => performOp('=')}>=</button>
      </div>
    </div>
  );
}
