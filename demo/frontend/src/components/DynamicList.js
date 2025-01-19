import React, { useEffect, useState } from 'react';
import './MultiDropdown.css';

const DynamicSpellList = ({ label, fieldName, initialValue, options, onChange, showValueInput = true, isItem=false}) => {
    const [list, setList] = useState(initialValue ? [...initialValue] : []);
    const traditionData = options[fieldName] || {}; // Access data based on fieldName

    useEffect(() => {
        const parsedList = typeof initialValue === 'string' ? parseListFromText(initialValue) : initialValue || [];
        setList(parsedList);
    }, [initialValue]);

    let parseListFromText;
    if (isItem === false) {
        parseListFromText = (text) => {
            if (!text) return [];
            return text.split(',').map(item => {
                const parts = item.trim().split('');

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
                                type += '' + parts[i];
                            } else {
                                // Stop adding to type when we encounter the first number
                                value = parts.slice(i).join(''); // Remaining parts go to value
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
    const handleInputChange = (index, key, value) => {
        const updatedList = [...list];
        if (!updatedList[index]) {
            updatedList[index] = {};
        }
        updatedList[index][key] = value;
        setList(updatedList);
        onChange(updatedList);
    };

    const handleAddField = () => {
        setList([...list, { type: '', value: '' }]);
    };

    return (
        <div style={{display: "inline-grid" }}>
            <button style={{width: "10.5em"}} type="button" onClick={handleAddField}>Add {label}</button>
            <table  style={{ border: '1px solid grey', padding: '2px' }}>
                <tbody>
                {list.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <select style={{width: "10em"}} value={item.type || ''} onChange={(e) => handleInputChange(index, 'type', e.target.value)}>
                                <option value="" hidden>Select</option>
                                {Object.entries(traditionData).map(([school, levels]) => ( // Use traditionData
                                    <optgroup key={school} label={school} className="dyna">
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map(level => {
                                            if (levels[level] && levels[level].length > 0) {
                                                return (
                                                    <>
                                                        <option  className="level-option" key={`${school}-${level}`} disabled>{`Level ${level}:`}</option>
                                                        {levels[level].map((spell, spellIndex) => ( // Add spellIndex
                                                            <option style={{ fontSize: "12px", paddingLeft: "20px" }}
                                                                    key={`${school}-${level}-${spell}-${spellIndex}`} // Add spellIndex to key
                                                                    value={spell}>{`${spell}`}</option>
                                                        ))}
                                                    </>
                                                );
                                            }
                                            return null;
                                        })}
                                    </optgroup>
                                ))}
                            </select>
                        </td>
                        {showValueInput && (
                            <td>
                                <input
                                    style={{width: "3.5em"}}
                                    type="number"
                                    min={0}
                                    value={item.value || ''}
                                    onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                                    placeholder="Slots"
                                />
                            </td>
                        )}
                        <td>
                            <button type="button" onClick={() => {
                                const updatedList = list.filter((_, i) => i !== index);
                                setList(updatedList);
                                onChange(updatedList);
                            }}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicSpellList;