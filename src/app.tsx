import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Product } from './types';

const MILLISECONDS = 200;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const timeout = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();

  useEffect(() => search(''), []);

  const search = (searchTerm: string) => {
    abortController.current = new AbortController();

    fetch(
      'https://latency-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=6be0576ff61c053d5f9a3225e2a90f76&x-algolia-application-id=latency',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ indexName: 'ikea', params: `query=${searchTerm}&hitsPerPage=16` }] }),
        signal: abortController.current.signal,
      },
    )
      .then(response => response.json())
      .then(response => setProducts(response.results[0]?.hits ?? []));
  };

  const handleChange = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(value);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    timeout.current = setTimeout(() => search(value), MILLISECONDS);
  };

  return (
    <div>
      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleChange} />

      {products.map(({ id, name, image }, index) => (
        <div key={index}>
          <p>{name}</p>
          <img src={image} alt={`Product: ${id}`} />
        </div>
      ))}
    </div>
  );
};

export default App;
