import { useState, useEffect } from 'react';
import { quotes } from '../data/quotes';

export function useQuotes() {
  const [quoteObj, setQuoteObj] = useState<{ current: string; fadeOut: string | null }>(() => ({
    current: quotes[Math.floor(Math.random() * quotes.length)],
    fadeOut: null
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteObj(prev => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * quotes.length);
        } while (quotes[newIndex] === prev.current && quotes.length > 1);

        return { fadeOut: prev.current, current: quotes[newIndex] };
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return quoteObj;
}
