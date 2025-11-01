import React from "react";

function Button({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-lime-500 font-semibold text-white rounded-md px-30 py-3"
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
