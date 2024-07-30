import { Fragment } from "react/jsx-runtime";

type SetStateFunction = (value: string | boolean) => void;

type RadioOptions = {
    label: string;
    value: string | boolean;
}

type RadioGroupProps = {
    name: string;
    options: RadioOptions[];
    onChange: SetStateFunction;
    value: string | boolean;
}

const RadioButtonGroup = ({value, onChange, name, options} : RadioGroupProps) => {


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value;
        onChange(newValue);
    };
    
    return (
        <Fragment>
            {options.map(option => (
                <Fragment key={option.label}>
                <label className="answer-label" key={option.label}>
                    {option.label}
                    <input type="radio" 
                        name={name}
                        value={String(option.value)}
                        checked={value === option.value}
                        onChange={handleOnChange}
                    />
                </label>
                <br />
                </Fragment>
            ))} 
        </Fragment>
    )
}

export default RadioButtonGroup