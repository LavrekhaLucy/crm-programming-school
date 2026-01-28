import type {FC, ButtonHTMLAttributes} from "react";

const buttonClass = `
px-4 py-2
text-sm
rounded-lg
bg-gray-200
hover:bg-gray-300
`;

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<Props> = ({ className = "", ...props }) => {
    return (
        <button
            {...props}
    className={`${buttonClass} ${className}`}
    />
);
};

export default Button;
