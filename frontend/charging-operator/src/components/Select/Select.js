import { useEffect, useLayoutEffect, useState } from 'react';
import { my_includes } from '../../utils/usefulFunctions';
import './select.css';

const Select = ({initialText, options, selected, setSelected, label,
            width, widthSelect, tabIndex, reset, error, setError, setPrevSelected}) => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    }
    const handleClick = (e) => {
        if (setPrevSelected) {
            setPrevSelected(selected)
        }
        setSelected(e.target.outerText)
        setShow(false);
        setError(false);
    }
    const close = (e) => {
        setShow(false);
    }

    useLayoutEffect(() => {
        if (!my_includes(options, selected)) setSelected("");
    }, reset)

    return (
        <div className="select-div-0" style={width ? {width: width} : {width: "300px"}} tabIndex={tabIndex} onBlur={close}>
            {label ? <h4>{label}</h4> : null}
            <div className="select-div-1" style={widthSelect ? {width: widthSelect} : {width: "300px"}}>
                <div className={"select-div-2" + " " + (error ? "error-selected" : "")} onClick={handleShow}>
                    {selected ? <p>{selected}</p> : <p>{initialText}</p>}
                    <img src="/img/arrow-down-sign-to-navigate.png" alt="" />
                </div>
                <ul className={show ? "options-show" : "options-no-show"}>
                    {options.map(option => {
                        return <li key={option.id} onClick={handleClick}>{option.name}</li>
                    })}
                </ul>
            </div>
        </div>
    );
}
 
export default Select;
