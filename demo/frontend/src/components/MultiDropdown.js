import React, { useState, useEffect } from 'react';
const MultiDropdown = ({ label, fieldName, initialValue, options, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState(initialValue || []);

    useEffect(() => {
        setSelectedOptions(initialValue || []);
    }, [initialValue]);

    const handleChange = (index, e) => {
        const newOptions = [...selectedOptions];
        newOptions[index] = e.target.value;
        setSelectedOptions(newOptions);
        onChange(fieldName, newOptions);
    };

    const handleAddField = () => {
        setSelectedOptions([...selectedOptions, ""]); // Add an empty string
    };

    const handleDeleteField = (index) => {
        const newOptions = selectedOptions.filter((_, i) => i !== index);
        setSelectedOptions(newOptions);
        onChange(fieldName, newOptions);
    };

    return (
        <table style={{display:"inline-grid", border: "1px solid grey", padding: "2px"}}>
            <thead>
                <tr>
                    <button type="button" onClick={handleAddField}>Add {label} trait</button>
                </tr>
            </thead>
            <tbody>
                {selectedOptions.map((option, index) => (
                    <tr key={index}>
                        <td>
                            <select value={option} onChange={(e) => handleChange(index, e)}>
                                <option value="">Select {label}</option>
                                {options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button type="button" onClick={() => handleDeleteField(index)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MultiDropdown;