import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline';
};

const Button: React.FC<Props> = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'rounded-full font-semibold transition-all duration-300';
  const styles = variant === 'primary'
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/25'
    : 'border border-purple-400 text-white hover:bg-purple-400/10';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export default Button;


