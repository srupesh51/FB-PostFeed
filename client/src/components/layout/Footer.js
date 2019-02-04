import React from 'react';

export default () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      Copyright &copy; {new Date().getFullYear()} DevConnector .
      Please note your Session will expire ater every 2 hours. After that
      you need to login again.
    </footer>
  );
};
