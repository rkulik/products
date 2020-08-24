import styled from '@emotion/styled';
import React, { ChangeEvent } from 'react';

const Container = styled.div`
  padding: 15px 15px 0;
`;

const Input = styled.input`
  font-size: 120%;
  padding: 10px;
  width: 100%;
`;

const Search = ({ value, onChange }: { value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) => (
  <Container>
    <Input type="text" placeholder="Search..." value={value} onChange={onChange} />
  </Container>
);

export default Search;
