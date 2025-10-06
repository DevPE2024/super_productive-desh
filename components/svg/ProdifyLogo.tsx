import { SvgProps } from "@/types/props";

export const ProdifyLogo = ({ ...props }: SvgProps) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background Circle */}
      <circle cx="20" cy="20" r="18" fill="#4727CD" stroke="#FAA72C" strokeWidth="2"/>
      
      {/* Productivity Symbol - Arrow Up with Lines */}
      <path d="M20 8L26 14H23V24H17V14H14L20 8Z" fill="#EAEAF0"/>
      <rect x="12" y="26" width="16" height="2" rx="1" fill="#FAA72C"/>
      <rect x="14" y="29" width="12" height="2" rx="1" fill="#FAA72C" opacity="0.7"/>
      <rect x="16" y="32" width="8" height="2" rx="1" fill="#FAA72C" opacity="0.4"/>
    </svg>
  );
};