import React, { useState } from 'react';
import './customselect.css'; //Your CSS

const CustomSelect = ({ options, onSelect, selectedSpell, setSelectedSpell }) => { // Pass selectedSpell and setSelectedSpell
    const [expandedSchools, setExpandedSchools] = useState({});

    const toggleSchool = (school) => { // Remove 'e' parameter
        setExpandedSchools((prevState) => ({
            ...prevState,
            [school]: !prevState[school],
        }));
    };

    const handleSpellSelect = (spell) => {
        setSelectedSpell(spell);
        onSelect(spell);
    };

    return (
        <div className="custom-select">
            {Object.entries(options.Arcane).map(([school, levels]) => (
                <div key={school} className="school-container">
                    <button className="school-button" onClick={() => toggleSchool(school)}>
                        {school}
                    </button>
                    {expandedSchools[school] && (
                        <div className="levels-container">
                            {Object.entries(levels).map(([level, spells]) => (
                                <div key={level} className="level-container">
                                    <div className="level-label">Level {level}:</div>
                                    <ul>
                                        {spells.map((spell) => (
                                            <li key={spell} onClick={() => handleSpellSelect(spell)}>
                                                {spell}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {selectedSpell && <div>Selected Spell: {selectedSpell}</div>} {/*Display selected spell*/}
        </div>
    );
};

export default CustomSelect;