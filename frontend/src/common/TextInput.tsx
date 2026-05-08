type TextInputProps = {
  label: string;
  type?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  Icon?: string | any;
};

const TextInput = ({
  label,
  type = "text",
  className,
  value,
  onChange,
  placeholder,
  disabled,
  onClick,
  Icon,
}: TextInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-start text-gray-300 mb-2">
        {label}
      </label>
      {Icon ? (
        <div
          className={`flex justify-between items-center w-full rounded-lg bg-gcs-dark border border-gray-700 px-4 py-3 text-gray-100 ${
            disabled && "cursor-not-allowed"
          } ${className}`}>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`placeholder-gray-500 w-full outline-none border-none bg-transparent focus:ring-0 focus:outline-none`} // Removed focus:ring
            disabled={disabled}
          />
          <Icon
            size={20}
            className="cursor-pointer text-label_color ml-[.5rem] text-lg"
            onClick={onClick}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-gcs-dark border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none
            ${disabled && "cursor-not-allowed"}
            ${className}`}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default TextInput;
