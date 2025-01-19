import React, { useState } from 'react'; // Removed unnecessary useEffect
import './MultiDropdown.css';
import multiDropdown from "./MultiDropdown";

const DynamicListAttacks = ({
                                label,
                                actionOptions,
                                damageTypeOptions,
                                traitOptions,
                                rangedTraitOptions,
                                initialValue,
                                onChange
                            }) => {
    const [list, setList] = useState(() => {
        // Ensure initialValue is an array, even if it's null or undefined
        return Array.isArray(initialValue) ? [...initialValue] : [];
    });

    const handleInputChange = (index, field, value) => {
        const updatedList = [...list];
        updatedList[index] = { ...updatedList[index], [field]: value };
        setList(updatedList);
        onChange(updatedList);
    };

    const handleAddField = () => {
        setList([...list, {
            action: '',
            name: '',
            attackChance: '',
            traits: [],
            rangedTraits: [],
            rangedValues: [],
            damage: '',
            damageValue: '',
            damageType: '',
            abilities: []
        }]);
    };

    const handleTraitChange = (index, traitIndex, traitValue) => {
        const updatedList = [...list];
        updatedList[index].traits = updatedList[index].traits || [];
        updatedList[index].traits[traitIndex] = traitValue;
        setList(updatedList);
        onChange(updatedList);
    };

    const handleRangedTraitChange = (index, traitIndex, traitValue) => {
        const updatedList = [...list];
        updatedList[index].rangedTraits = updatedList[index].rangedTraits || [];
        updatedList[index].rangedTraits[traitIndex] = traitValue;
        setList(updatedList);
        onChange(updatedList);
    };

    const handleRangedValueChange = (index, valueIndex, value) => {
        const updatedList = [...list];
        updatedList[index].rangedValues = updatedList[index].rangedValues || [];
        updatedList[index].rangedValues[valueIndex] = value;
        setList(updatedList);
        onChange(updatedList);
    };

    const handleAbilityChange = (index, abilityIndex, value) => {
        const updatedList = [...list];
        updatedList[index].abilities = updatedList[index].abilities || [];
        updatedList[index].abilities[abilityIndex] = value;
        setList(updatedList);
        onChange(updatedList);
    };

    return (
        <div style={{display: "inline"}}>
            <button  type="button" onClick={handleAddField}>Add {label}</button><br/>
            {list.map((item, index) => ( // This line was causing the error
                <div key={index} >
                    <select
                        value={item.action || ''}
                        onChange={(e) => handleInputChange(index, 'action', e.target.value)}
                    >
                        <option  value="">Select action</option>
                        {actionOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <input
                        style={{width:"8em"}}
                        type="text"
                        placeholder="Attack name"
                        value={item.name || ''}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    />
                    <input style={{width:"8em"}}
                        type="number"
                        placeholder="Attack modifier"
                        value={item.attackChance || ''}
                        onChange={(e) => handleInputChange(index, 'attackChance', e.target.value)}
                    />
                    {/* Traits Section */}
                    <div style={{display: "inline", marginLeft: "5px"}}>
                        <button type="button" onClick={() => handleTraitChange(index, item.traits?.length || 0, '')}>
                            Add trait
                        </button>
                        {item.traits && item.traits.map((trait, traitIndex) => (
                            <div key={traitIndex} style={{display: "inline" }}>
                                <select style={{ marginLeft: "5px"}}
                                    value={trait || ''}
                                    onChange={e => handleTraitChange(index, traitIndex, e.target.value)}
                                >
                                    <option value="">Choose trait</option>
                                    {traitOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => {
                                    const updatedTraits = item.traits.filter((_, i) => i !== traitIndex);
                                    handleInputChange(index, 'traits', updatedTraits);
                                }}>Cancel Trait
                                </button>
                            </div>
                        ))}

                    </div>
                    {/* Ranged Traits Section */}
                    <div style={{display: "inline", marginLeft: "5px", marginRight: "5px"}}>
                        <button type="button" onClick={() => {
                            handleRangedTraitChange(index, item.rangedTraits?.length || 0, '');
                            handleRangedValueChange(index, item.rangedValues?.length || 0, '');
                        }}>
                            Add ranged trait
                        </button>
                        {item.rangedTraits && item.rangedTraits.map((rangedTrait, rangedTraitIndex) => (
                            <div key={rangedTraitIndex} style={{display: "inline" }}>
                                <select style={{ marginLeft: "5px"}}
                                        value={rangedTrait || ''}
                                        onChange={e => handleRangedTraitChange(index, rangedTraitIndex, e.target.value)}
                                >
                                    <option value="" >Choose trait</option>
                                    {rangedTraitOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <input style={{ width:"2.5em"}}
                                       type="number"
                                       step="5"
                                       min="10"
                                       placeholder="feet"
                                       value={item.rangedValues?.[rangedTraitIndex] || ''} //Safe access
                                       onChange={(e) => handleRangedValueChange(index, rangedTraitIndex, e.target.value)}
                                />
                                <button style={{display: "inline" , marginRight: "5px"}} type="button" onClick={() => {
                                    const updatedRangedTraits = item.rangedTraits.filter((_, i) => i !== rangedTraitIndex);
                                    handleInputChange(index, 'rangedTraits', updatedRangedTraits);
                                }}>Cancel trait
                                </button>
                            </div>
                        ))}
                    </div>

                    <input style={{display: "inline", width:"9.5em"}}
                           type="text"
                           placeholder="Damage dice ex.1d8"
                           value={item.damage || ''}
                           onChange={(e) => handleInputChange(index, 'damage', e.target.value)}
                    />
                    <input style={{display: "inline", width:"8.5em"}}
                           type="number"
                        placeholder="Damage modifier"
                        value={item.damageValue || ''}
                        onChange={(e) => handleInputChange(index, 'damageValue', e.target.value)}
                    />
                    <select value={item.damageType || ''}
                            onChange={(e) => handleInputChange(index, 'damageType', e.target.value)}
                    >
                        <option value="">Select damage type</option>
                        {damageTypeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    {/* Abilities Section */}
                    <div style={{display: "inline"}}>
                        <button type="button"
                                onClick={() => handleAbilityChange(index, item.abilities?.length || 0, '')}>
                            plus ability
                        </button>
                        {item.abilities && item.abilities.map((ability, abilityIndex) => (
                            <div  key={abilityIndex} style={{display: "inline", marginLeft:"5px"}}>
                                <input
                                    type="text"
                                    placeholder="Ability name"
                                    value={ability || ''}
                                    onChange={(e) => handleAbilityChange(index, abilityIndex, e.target.value)}
                                />
                                <button style={{display: "inline"}}  type="button"
                                onClick={() => {
                                    const updatedAbilities = item.abilities.filter((_, i) => i !== abilityIndex);
                                    handleInputChange(index, 'abilities', updatedAbilities);
                                }}>Cancel ability
                                </button>
                            </div>
                        ))}
                    </div>
                    <button style={{display: "inline", marginLeft:"5px"}} type="button" onClick={() => {
                        const updatedList = list.filter((_, i) => i !== index);
                        setList(updatedList);
                        onChange(updatedList);
                    }}>Cancel {label}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DynamicListAttacks;