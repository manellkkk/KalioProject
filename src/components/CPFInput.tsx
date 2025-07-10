import React, { useState, useEffect } from "react";

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
  placeholder?: string;
  value?: string;
}

export default function CPFInput({
  className,
  onChange,
  placeholder = "CPF",
  value,
}: CPFInputProps) {
  const [cpf, setCpf] = useState(value ?? "");

  // Atualiza o estado interno se `value` externo mudar
  useEffect(() => {
    if (value !== undefined) {
      setCpf(formatCPF(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (value === undefined) {
      // Se não é controlado externamente, atualiza o estado interno
      setCpf(formatted);
    }
    if (onChange) onChange(formatted);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      maxLength={14}
      value={cpf}
      onChange={handleChange}
      className={className}
    />
  );
}
