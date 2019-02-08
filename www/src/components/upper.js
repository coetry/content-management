import React from "react";

const Upper = ({ children }) => (
  <span>
    {children}
    <style jsx>{`
      span {
        text-transform: uppercase;
        margin: 0 5px;
      }
    `}</style>
  </span>
);

export default Upper;
