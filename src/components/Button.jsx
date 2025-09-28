import React from "react";

export default function Button({ text, link, onClick, color }) {
  return (
    <a
      href={link || "#"}
      onClick={onClick}
      target={link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="btn"
      style={{ backgroundColor: color }}
    >
      {text}
    </a>
  );
}