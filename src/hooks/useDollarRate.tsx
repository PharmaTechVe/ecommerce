import { useEffect, useState } from 'react';

export default function useDollarRate() {
  const [dollarRate, setDollarRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const response = await fetch(
          'https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd',
        );
        const data = await response.json();
        setDollarRate(data.price);
      } catch (err) {
        console.error('Error fetching dollar rate:', err);
        setError('No se pudo obtener la tasa del dólar');
      } finally {
        setLoading(false);
      }
    };

    fetchDollarRate();
  }, []);

  return { dollarRate, loading, error };
}
