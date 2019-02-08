import React from "react";

const TextInput = props => {
  return (
    <div className="input-wrapper">
      <input {...props} type="text" />
      <style jsx>{`
        .input-wrapper {
          display: block;
          margin: 15px 0;
        }
        input {
          background-color: #fff;
          border-radius: 5px;
          border: 1px solid #e1e1e1;
          padding: 10px 30px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          transition: all 0.2 ease;
        }
        input:focus {
          border: 1px solid #888;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default TextInput;
