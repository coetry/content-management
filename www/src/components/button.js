import React from "react";

const Button = ({ children, ...props }) => (
  <button {...props}>
    {children}
    <style jsx>{`
      button {
        display: inline-flex;
        align-items: center;
        color: #fff;
        background: #000;
        width: 150px;
        height: 30px;
        padding: 0 25px;
        outline: none;
        border: 1px solid #000;
        font-size: 12px;
        jusitfy-content: center;
        text-transform: uppercase;
        cursor: pointer;
        text-align: center;
        user-select: none;
        font-weight: 100;
        position: relative;
        overflow: hidden;
        transition: border 0.2s, background 0.2s, color 0.2s ease-out;
        border-radius: 5px;
        white-space: nowrap;
        line-height: 0;
      }
    `}</style>
  </button>
);

export default Button;
