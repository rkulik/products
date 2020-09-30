import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Card, { Info } from './components/card';
import Grid, { Item } from './components/grid';
import Search from './components/search';
import { Product } from './types';

const TIMEOUT_IN_MILLISECONDS = 200;

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

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(value);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    timeout.current = setTimeout(() => search(value), TIMEOUT_IN_MILLISECONDS);
  };

  return (
    <div>
      <Search value={searchTerm} onChange={handleChange} />
      <Grid>
        {products.map(({ id, name, image, price }, index) => (
          <Item key={index}>
            <Card>
              <img src={image} alt={`Product: ${id}`} />
              <Info>
                <h5>{name}</h5>
                <h6>${price}</h6>
              </Info>
            </Card>
          </Item>
        ))}
      </Grid>
    </div>
  );
};

export default App;
