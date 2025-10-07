import React from "react";

interface LogoProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ProdifyLogo = ({ className, width = "40", height = "40" }: LogoProps) => {
  return (
    <img
      src="/icons/prodify-new.png"
      alt="Prodify Logo"
      width={width}
      height={height}
      className={`object-contain ${className || ""}`}
      style={{ 
        backgroundColor: '#4727CD', 
        borderRadius: '8px',
        padding: '4px'
      }}
    />
  );
};

