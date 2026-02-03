type EnumSelectProps<T extends string> = {
    value?: T;
    onChange: (value: T | undefined) => void;
    options: readonly T[];
    placeholder?: string;
};

export const EnumSelect = <T extends string>({
                                                 value,
                                                 onChange,
                                                 options,
                                                 placeholder = "Select value",
                                             }: EnumSelectProps<T>) => {
    return (
        <select
            className="w-full border px-3 py-2"
            value={value ?? ""}
            onChange={(e) =>
                onChange(
                    e.target.value === ""
                        ? undefined
                        : (e.target.value as T)
                )
            }
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option}>
                    {option.toUpperCase()}
                </option>
            ))}
        </select>
    );
};
