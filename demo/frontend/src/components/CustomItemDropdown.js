import React, { useEffect, useState } from 'react';
import './MultiDropdown.css'; // Your CSS

const CustomItemDropdown = ({ label, initialValue, options, onChange }) => {
    const [list, setList] = useState(initialValue ? [...initialValue] : []);

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
        setList([...list, {}]); // Add an empty object
    };

    const parseListFromText = (text) => {
        return text ? text.split(",").map(item => ({ type: item.trim() })) : []; // Parsing to object format
    };

    const handleRemoveField = (index) => {
        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList);
        onChange(updatedList);
    };


    return (
        <div>
            <label>{label}</label>
            <button type="button" onClick={handleAddField}>Add {label}</button>
            {list.map((item, index) => (
                <div key={index}>
                    <select
                        value={item.type || ''} // Access the type property of the item
                        onChange={(e) => handleInputChange(index, 'type', e.target.value)} // Pass 'type' as the key
                    >
                        <option value="" disabled>Select</option>
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => handleRemoveField(index)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default CustomItemDropdown;