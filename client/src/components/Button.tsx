import React from "react";

function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-emerald-700 font-semibold text-white rounded-md px-30 py-3 flex items-center just"
      >
        {children}
      </button>
    </div>
  );
}
export default Button;
