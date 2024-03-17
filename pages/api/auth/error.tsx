// pages/_error.tsx

import React from 'react';
import { NextPage } from 'next';

const ErrorPage: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  return (
    <div>
      <h1>Error {statusCode || 'Unknown'}</h1>
      <p>Oops! Something went wrong.</p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
