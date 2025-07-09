import React, { useState } from "react";

function formatCPF(value: string) {
  const onlyDigits = value.replace(/\D/g, "");
  if (onlyDigits.length <= 3) return onlyDigits;
  if (onlyDigits.length <= 6)
    return onlyDigits.replace(/(\d{3})(\d+)/, "$1.$2");
  if (onlyDigits.length <= 9)
    return onlyDigits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return onlyDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
}

interface CPFInputProps {
  className?: string;
  onChange?: (value: string) => void;
}

export default function CPFInput({ className, onChange }: CPFInputProps) {
  const [cpf, setCpf] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (onChange) onChange(formatted);
  };

  return (
    <input
      type="text"
      placeholder="CPF"
      maxLength={14}
      value={cpf}
      onChange={handleChange}
      className={className}
    />
  );
}
