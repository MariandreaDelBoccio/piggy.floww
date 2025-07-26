import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css'
import type { DatePickerProps } from "../types/types";
import styled from "styled-components"; 
import theme from "../theme";
import { useState } from "react";

const InputContainer = styled.div`
    position: relative;
 
    input {
        font-family: 'Work Sans', sans-serif;
        box-sizing: border-box;
        background: ${theme.grisClaro};
        border: none;
        cursor: pointer;
        border-radius: 0.625rem; /* 10px */
        height: 5rem; /* 80px */
        width: 100%;
        padding: 0 1.25rem; /* 20px */
        font-size: 1.5rem; /* 24px */
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
    }
 
    .rdp-root {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.5rem;
        z-index: 10;
    }
 
    .rdp-months {
        display: flex;
        justify-content: center;
    }
 
    .rdp-month {
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 20px;
        border-radius: 10px;
    }
 
    @media (max-width: 60rem) {
        /* 950px */
        & > * {
            width: 100%;
        }
    }
`;

const DatePicker = ({date, changeDate}: DatePickerProps) => {
    const [show, changeVisible] = useState(false);

    const handleSelect = (selectedDate?: Date) => {
        if (selectedDate) {
            changeDate(selectedDate);
            changeVisible(false); 
        }
    };

    return (
        <InputContainer>
            <input onClick={() => changeVisible(!show)} type="text" readOnly value={new Date(date).toLocaleDateString('en-US', {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}  />
            {show && <DayPicker 
                mode="single" 
                onSelect={handleSelect} 
                selected={date}
                required={false}
            />}
        </InputContainer>
    )
}

export default DatePicker;