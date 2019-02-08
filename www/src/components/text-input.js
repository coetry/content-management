import React from "react";

const TextInput = props => {
  return (
    <div className="input-wrapper">
      <input {...props} type="text" />
      <style jsx>{`
        .input-wrapper {
          display: block;
        }
        input {
          background-color: #fff;
          box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.12);
          border-radius: 5px;
          border: none;
          padding: 10px 30px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          transition: all 0.2 ease;
        }
      `}</style>
    </div>
  );
};

export default TextInput;
