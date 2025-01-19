import React, { useEffect, useState } from 'react';
import './MultiDropdown.css'; //Your CSS
const DynamicList = ({ label, fieldName, initialValue, options, onChange, showValueInput = true, isItem=false}) => {
    const [list, setList] = useState(initialValue ? [...initialValue] : []);

    let parseListFromText;
    if (isItem === false) {
        parseListFromText = (text) => {
            if (!text) return [];
            return text.split(',').map(item => {
                const parts = item.trim().split(' ');

                // Initialize type and value
                let type = '';
                let value = '';

                // Function to check if a string is a number
                const isNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));

                // Handle parts accordingly
                if (parts.length > 0) {
                    type += parts[0]; // Always include the first part

                    for (let i = 1; i < parts.length; i++) {
                        if (parts[i]) {
                            if (!isNumber(parts[i])) {
                                // If the part is not a number, add it to type
                                type += ' ' + parts[i];
                            } else {
                                // Stop adding to type when we encounter the first number
                                value = parts.slice(i).join(' '); // Remaining parts go to value
                                break;
                            }
                        }
                    }
                }

                return { type: type.trim(), value: value.trim() }; // Return the constructed object
            }).filter(item => item.type !== '');
        };
    } else {
        parseListFromText = (text) => {
            return text ? text.split(',').map(item => ({ type: item.trim() })) : [];
        };
    }

    useEffect(() => {
        const parsedList = typeof initialValue === 'string' ? parseListFromText(initialValue) : initialValue || [];
        setList(parsedList);
    }, [initialValue]);

    const handleInputChange = (index, key, value) => {
        const updatedList = [...list];
        if (!updatedList[index]) {
            updatedList[index] = {}; // Ensure there's an object if none exists
        }
        updatedList[index][key] = value; // Update the value based on key
        setList(updatedList);
        onChange(updatedList);
    };

    const handleAddField = () => {
        setList([...list, { type: '', value: '' }]); // Add a default value for 'value'
    };

    return (
        <table style={{display: "inline-grid", border: "1px solid grey", padding: "2px"}}>
            <thead >
            <button type="button" onClick={handleAddField}>Add {label}</button></thead>

            <tbody style={{display: "inline-grid", border: "2px solid white"}}>
            {list.map((item, index) => (
                <div key={index} style={{marginBottom: '10px'}}>
                    <select
                        value={item.type || ''} // Handle undefined values
                        onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                    >
                        <option value="" hidden>Select</option>
                        {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {showValueInput && (
                        <input
                            style={{width: "4em"}}
                            type="number" // Changed to 'text' to accept strings
                            min={fieldName === "speed" ? "5" : (fieldName === "skills" ? "-100" : "0")}
                            step={fieldName === "speed" ? "5" : "1"} // Conditional step
                            value={item.value || ''} // Handle undefined values
                            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                            placeholder="Value"
                        />
                    )}
                    <button type="button" onClick={() => {
                        const updatedList = list.filter((_, i) => i !== index);
                        setList(updatedList);
                        onChange(updatedList);
                    }}>Delete
                    </button>
                </div>
            ))}
            </tbody>
        </table>
    );
};

export default DynamicList;