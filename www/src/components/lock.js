import React from "react";

const Lock = ({ type, ...props }) => (
  <span {...props}>
    {type === "sign-in" ? "🔐" : "🔒"}
    <style jsx>{`
      span {
        cursor: pointer;
        font-size: 40px;
      }
    `}</style>
  </span>
);

export default Lock;
