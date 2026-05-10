interface FormErrorProps {
  errors?: string[];
}

export function FormError({ errors }: FormErrorProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-1.5 space-y-1">
      {errors.map((error, index) => (
        <p key={index} className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      ))}
    </div>
  );
}
