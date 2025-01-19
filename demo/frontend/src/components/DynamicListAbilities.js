import React, { useEffect, useState } from 'react';
import './MultiDropdown.css';
import multiDropdown from "./MultiDropdown"; //Your CSS

const DynamicListAbilities = ({ label, initialValue, onChange, separator = ".;",options}) => {
    const [list, setList] = useState(initialValue ? [...initialValue] : []);

    useEffect(() => {
        // No need for parsing in this version.
        const parsedList = typeof initialValue === 'string' ? parseListFromText(initialValue) : initialValue || [];

        setList(parsedList || []);
    }, [initialValue]);

    const handleInputChange = (index, value) => {
        const updatedList = [...list];
        updatedList[index] = value; // Directly assign the value
        setList(updatedList);
        onChange(updatedList);
    };

    const handleAddField = () => {
        setList([...list, '']); // Add an empty string
    };



    const parseListFromText = (text) => {
        if (!text) return [];
        return text.split(separator); // Corrected: Only split by '.;'
    };


    return (
        <div className="multi-dropdown-container">
            <button type="button" onClick={handleAddField}>Add {label}</button>
            {list.map((item, index) => (
                <div key={index} className="multi-dropdown-item" >
                    <textarea
                        value={item}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={`${label} description`}
                    />
                    <button type="button" onClick={() => {
                        const updatedList = list.filter((_, i) => i !== index);
                        setList(updatedList);
                        onChange(updatedList);
                    }}>Cancel
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DynamicListAbilities;