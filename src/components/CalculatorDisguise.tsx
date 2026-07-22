'use client';
import { useState } from 'react';

export default function CalculatorDisguise({ onExit }: { onExit: () => void }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === '=') {
      if (equation === '1234') {
        // Secret code sequence matched! Return to real SafeHer App UI
        onExit();
        return;
      }
      try {
        // Safe evaluation for basic UI calculator operations
        const res = eval(equation);
        setDisplay(String(res));
        setEquation(String(res));
      } catch {
        setDisplay('Error');
        setEquation('');
      }
      return;
    }

    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }

    const nextEq = equation === '' ? val : equation + val;
    setEquation(nextEq);
    setDisplay(nextEq);
  };

  const buttons = [
    'C', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col justify-end p-4">
      <div className="bg-slate-800 text-white text-right p-6 rounded-t-2xl text-4xl font-mono tracking-widest overflow-x-auto">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-4 rounded-b-2xl pb-10">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => handlePress(btn)}
            className={`p-5 text-xl font-bold rounded-xl transition ${
              btn === '=' ? 'bg-amber-500 hover:bg-amber-600 col-span-1 text-white' : 
              ['/', '*', '-', '+', 'C'].includes(btn) ? 'bg-slate-700 text-amber-400' : 'bg-slate-800 text-white'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}