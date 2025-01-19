import React, {useContext, useEffect, useState} from 'react';
import {makeRequest} from '../apiService'; //Your API service
import AuthContext from '../AuthContext';
import {useNavigate, useSearchParams} from 'react-router-dom';
import './Table.css'; //Your CSS
import DynamicList from './DynamicList';
import DynamicListAbilities from './DynamicListAbilities';
import MultiDropdown from "./MultiDropdown";
import DynamicListAttacks from "./DynamicListAttacks";
import { TooltipHighlighterWeapons } from './TooltipHighlighterWeapons';

function BestiaryPage() {
    const { user } = useContext(AuthContext);
    const [bestiaryPublic, setBestiaryPublic] = useState([]);
    const [bestiaryPrivate, setBestiaryPrivate] = useState([]);
    const [error, setError] = useState(null);
    const [editingPrivate, setEditingPrivate] = useState(false);
    const [showAddPrivateForm, setShowAddPrivateForm] = useState(false);
    // ... (other state variables for searching, sorting, etc.) ...
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaignId');
    const navigate = useNavigate();
    const [activeTable, setActiveTable] = useState('');

    const [traitsData, setTraitsData] = useState({}); // New state for trait data
    const [spellsData, setSpellsData] = useState({}); // New state for trait data

    const [spellOptions, setSpellOptions] = useState({
        arcane: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
        primal: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
        divine: {abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: []},
        elemental: {abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: []},
        occult: {abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: []}
    });
    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


    const [weaponsAllData, setWeaponsAllData] = useState({}); // New state for trait data
    const [armorAllData, setArmorAllData] = useState({}); // New state for trait data
    const [equipmentAllData, setEquipmentAllData] = useState({}); // New state for trait data


    useEffect(() => {
        const fetchData = async () => {
            try {
                const publicData = await makeRequest('/api/bestiary/public', 'GET', null, user.token);
                const privateData = await makeRequest(`/api/bestiary/private/${campaignId}`, 'GET', null, user.token);
                setBestiaryPublic(publicData);
                setBestiaryPrivate(privateData);

                const traits = await makeRequest('/api/bestiary/public/traits', 'GET',null, user.token); // Fetch trait data
                const traitsMap = {};
                traits.forEach(trait => traitsMap[trait.name] = `${trait.summary} ${trait.sourceRaw}`);
                setTraitsData(traitsMap);

                const spells = await makeRequest('/api/items/spells/public', 'GET', null, user.token);
                const spellsMap = {};

                const tempSpellOptions = {
                    arcane: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
                    primal: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
                    divine: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
                    elemental: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] },
                    occult: { abjuration: [], divination: [], enchantment: [], illusion: [], evocation: [], necromancy: [], transmutation: [], conjuration: [] }
                };

                spells.forEach(spell => {
                    spellsMap[spell.name] = `${spell.summary} ${spell.school} ${spell.level}`;

                    const traditions = spell.tradition.split(',').map(item => item.trim());

                    // Check for Arcane traditions
                    traditions.forEach(tradition => {
                        const traditionKey = tradition.toLowerCase();
                        if (tempSpellOptions[traditionKey]) {
                            const schoolKey = spell.school.toLowerCase();
                            if (tempSpellOptions[traditionKey][schoolKey] && levels.includes(spell.level)) {
                                tempSpellOptions[traditionKey][schoolKey][spell.level - 1] = [
                                    ...(tempSpellOptions[traditionKey][schoolKey][spell.level - 1] || []),
                                    spell.name
                                ];
                            }
                        }
                    });
                });

                setSpellOptions(tempSpellOptions);

                setSpellsData(spellsMap);

                const weaponPublicData = await makeRequest('/api/items/weapons/public', 'GET', null, user.token);

                const weaponPublicMap = {};
                weaponPublicData.forEach(weapon => {
                    weaponPublicMap[weapon.name] = {
                        damage: weapon.damage,
                        text: weapon.text,
                        itemCategory: weapon.itemCategory,
                        private: false // Indicate this is public
                    };
                });

                const weaponPrivateData = await makeRequest(`/api/items/weapons/private/${campaignId}`, 'GET', null, user.token);


                const weaponPrivateMap = {};
                weaponPrivateData.forEach(weapon => {
                    weaponPrivateMap[weapon.name] = {
                        damage: weapon.damage,
                        text: weapon.text,
                        itemCategory: weapon.itemCategory,
                        private: true // Indicate this is private
                    };
                });
// Combine both maps
                const combinedWeaponData = { ...weaponPublicMap };

// Overwrite public data with private data if it exists
                Object.keys(weaponPrivateMap).forEach(key => {
                    combinedWeaponData[key] = weaponPrivateMap[key];
                });

// Set the combined data to state
                setWeaponsAllData(combinedWeaponData);

                // Create a comma-separated string of weapon names
                const allWeaponNames = Object.keys(combinedWeaponData).join(', ');




                const armorPublicData = await makeRequest('/api/items/armors/public', 'GET', null, user.token);

                const armorPublicMap = {};
                armorPublicData.forEach(armor => {
                    armorPublicMap[armor.name] = {
                        ac: armor.ac,
                        text: armor.text,
                        private: false // Indicate this is public
                    };
                });

                const armorPrivateData = await makeRequest(`/api/items/armors/private/${campaignId}`, 'GET', null, user.token);


                const armorPrivateMap = {};
                armorPrivateData.forEach(armor => {
                    armorPrivateMap[armor.name] = {
                        ac: armor.ac,
                        text: armor.text,
                        private: true // Indicate this is private
                    };
                });

                const combinedArmorData = { ...armorPublicMap };

                Object.keys(armorPrivateMap).forEach(key => {
                    combinedArmorData[key] = armorPrivateMap[key];
                });

                setArmorAllData(combinedArmorData);

                const equipmentPublicData = await makeRequest('/api/items/equipment/public', 'GET', null, user.token);


                const equipmentPublicMap = {};
                equipmentPublicData.forEach(equipment => {
                    equipmentPublicMap[equipment.name] = {
                        text: equipment.text,
                        private: false // Indicate this is public
                    };
                });

                const equipmentPrivateData = await makeRequest(`/api/items/equipment/private/${campaignId}`, 'GET', null, user.token);


                const equipmentPrivateMap = {};
                equipmentPrivateData.forEach(equipment => {
                    equipmentPrivateMap[equipment.name] = {
                        text: equipment.text,
                        private: true // Indicate this is private
                    };
                });
// Combine both maps
                const combinedEquipmentData = { ...equipmentPublicMap };

// Overwrite public data with private data if it exists
                Object.keys(equipmentPrivateMap).forEach(key => {
                    combinedEquipmentData[key] = equipmentPrivateMap[key];
                });

                setEquipmentAllData(combinedEquipmentData);

            } catch (error) {
                setError(error.message);
            }

        };

        if (user.token && campaignId) {
            fetchData();
        }
    }, [user.token, campaignId]);


    // Default state for the form
    const defaultPrivateState = {
        name: '',
        ac: '',
        hp: '',
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: '',
        size: '',
        type: '',
        alignment: '',
        category: '',
        rarity: '',
        vision: '',
        sense: '',
        text: '',
        trait: [],
        fortitudeSave: '',
        reflexSave: '',
        willSave: '',
        perception: '',
        creatureAbility: '',
        strongestSave: '',
        weakestSave: '',
        sourceRaw: '',
        spell:'',
        melee:[],
        ranged:[],
        abilityDescription:[],
        resistance: [],
        immunity: [],
        weakness: [],
        language: [],
        speed: [],
        speedRaw: [],
        skill: [],
        items: [],
        weaponsName: [],
        armorName: [],
        equipmentName: [],
        arcane: [],
        primal: [],
        divine: [],
        elemental: [],
        occult: [],
        npc: false

    };
    const [newPrivate, setNewPrivate] = useState(defaultPrivateState);

    const handlePrivateInputChange = (e) => {
        setNewPrivate({ ...newPrivate, [e.target.name]: e.target.value });
    };

    const handleDynamicListChange = (fieldName, newList) => {
        setNewPrivate({...newPrivate, [fieldName]: newList});
    };


    const handleDynamicListAdd = () => {
        // optional: you could add specific handling here, if needed
    };

    const handleDynamicListDelete = (fieldName, newList) => {
        setNewPrivate({ ...newPrivate, [fieldName]: newList });
    };
    const handleTraitChange = (traitType, selectedOptions) => {
        const updatedTraits = [...newPrivate.trait];
        const existingIndex = updatedTraits.findIndex(trait => trait.type === traitType);
        if (existingIndex !== -1) {
            updatedTraits[existingIndex] = { type: traitType, values: selectedOptions };
        } else {
            updatedTraits.push({ type: traitType, values: selectedOptions });
        }
        setNewPrivate({ ...newPrivate, trait: updatedTraits });
    };
    const handleTraitEditChange = (traitType, selectedOptions) => {
        const updatedTraits = [...editingPrivate.trait];
        const existingIndex = updatedTraits.findIndex(trait => trait.type === traitType);
        if (existingIndex !== -1) {
            updatedTraits[existingIndex] = { type: traitType, values: selectedOptions };
        } else {
            updatedTraits.push({ type: traitType, values: selectedOptions });
        }
        setNewPrivate({ ...editingPrivate, trait: updatedTraits });
    };

// Add BestiaryPrivate
    const handleAddPrivate = async (e) => {
        e.preventDefault();
        console.log("newPrivate before submit:", newPrivate); // Add this log

        const formatAttacks = (attackType) =>{
            if (!attackType || attackType.length === 0) {
                return ''; // Return empty string if no attacks
            }

            return attackType.map(attack => {
                const { action, name, attackChance, traits, rangedTraits, rangedValues, damage, damageValue, damageType, abilities } = attack;

                // Format traits and ranged traits, handling empty cases
                const formattedTraits = traits.length > 0 ? traits.join(', ') : '';
                const formattedRangedTraits = rangedTraits.length > 0 ? rangedTraits.map((rangedTrait, index) => `${rangedTrait} ${rangedValues[index]} feet`).join(', ') : '';

                // Construct the attack string, handling empty cases
                let attackString = `${action}, ${name}`;
                if (attackChance) {
                    attackString += ` +${attackChance}:`;
                }
                if (formattedTraits || formattedRangedTraits) {
                    attackString += `(${formattedTraits ? formattedTraits + (formattedRangedTraits ? ', ' : '') : ''}${formattedRangedTraits})`;
                }
                if (damage) {
                    attackString += ` Damage ${damage}`;
                }
                if (damageValue) {
                    attackString += ` +${damageValue}`;
                }
                attackString += ` ${damageType}`;
                if (abilities && abilities.length > 0) {
                    attackString += ` plus ${abilities.join(' and ')}`;
                }
                return attackString;
            }).join(';');
        }

        const creatureData = {
            ...newPrivate,
            campaignId,
            // Format list data here instead of in the function argument.
            resistance: newPrivate.resistance.map(item => `${item.type} ${item.value}`).join(', '),
            skill: newPrivate.skill.map(item => `${item.type} ${item.value}`).join(', '),
            speedRaw: newPrivate.speedRaw.map(item => `${item.type} ${item.value}`).join(', '),
            immunity: newPrivate.immunity.map(item => item.type).join(', '), // Access only the type
            items: newPrivate.items.map(item => item.type).join(', '), // Access only the type


            weaponsName: newPrivate.weaponsName.map(item => item.type).join(', '), // Access only the type
            armorName: newPrivate.armorName.map(item => item.type).join(', '), // Access only the type
            equipmentName: newPrivate.equipmentName.map(item => item.type).join(', '), // Access only the type

            //this arcaneName: newPrivate.arcaneName.map(item => item.type).join(', '), // Access only the type


            arcane: newPrivate.arcane.map(item => `${item.type} ${item.value}`).join(', '),
            primal: newPrivate.primal.map(item => `${item.type} ${item.value}`).join(', '),
            divine: newPrivate.divine.map(item => `${item.type} ${item.value}`).join(', '),
            elemental: newPrivate.elemental.map(item => `${item.type} ${item.value}`).join(', '),
            occult: newPrivate.occult.map(item => `${item.type} ${item.value}`).join(', '),

            trait: newPrivate.trait.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
            //arcane: newPrivate.arcane.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
            /*            primal: newPrivate.primal.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        divine: newPrivate.divine.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        elemental: newPrivate.elemental.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        occult: newPrivate.occult.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data*/
            weakness: newPrivate.weakness.map(item => `${item.type} ${item.value}`).join(', '),
            language: newPrivate.language.map(item => item.type).join(', '),  //Simplified
            speed: (newPrivate.speed || []).map(item => `${item.type} ${item.value ? (item.value + ' feet') : ''}`).join(', '),

            abilityDescription: (newPrivate.abilityDescription || []).join('.;'), // Corrected line

            melee: formatAttacks(newPrivate.melee),


            ranged: formatAttacks(newPrivate.ranged)



        };
        console.log("creatureData:", creatureData); // Add this log

        try {
            const data = await makeRequest(`/api/bestiary/private/${campaignId}`, 'POST', creatureData, user.token);
            setBestiaryPrivate([...bestiaryPrivate, data]);
            setNewPrivate(defaultPrivateState);
            setShowAddPrivateForm(false); // Close the form
            setShowItems(false)
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDynamicListEditChange = (fieldName, newList) => {
        setEditingPrivate({ ...editingPrivate, [fieldName]: newList });
    };
    const handleEditPrivateChange = (e) => {
        setEditingPrivate({ ...editingPrivate, [e.target.name]: e.target.value });
    };


// Update BestiaryPrivate
    const handleUpdatePrivate = async (e) => {
        e.preventDefault();
        const sanitizeList = (list, listType) => {  // Added listType parameter
            if (Array.isArray(list)) return list;
            if (typeof list === 'string') {
                if (listType === 'abilityDescription') {
                    try {
                        return list.split('.;').map(item => item.trim()); // Simplified string parsing
                    } catch (error) {
                        console.error("Error parsing abilityDescription:", error);
                        return [];
                    }
                }else if (listType === 'melee' || listType === 'ranged') {
                    try {
                        return list.split(';').map(item => item.trim());
                    } catch (error) {
                        console.error(`Error parsing ${listType}:`, error);
                        return [];
                    }
                } else if (listType === 'weaponsName' || listType === 'armorName' || listType === 'equipmentName' ) {
                    try {
                        return list ? list.split(",").map(item => ({ type: item.trim() })) : []; // Parsing to object format
                    } catch (error) {
                        console.error("Error parsing abilityDescription:", error);
                        return [];
                    }
                } else {
                    try {
                        return list.split(',').map(item => {
                            const parts = item.trim().split(' ');
                            return { type: parts[0], value: parts.slice(1).join(' ') };
                        });
                    } catch (error) {
                        console.error("Error parsing list:", error);
                        return [];
                    }
                }
            }
            return [];
        };



        console.log("Before creatureData:", editingPrivate.abilityDescription); // Log before processing

        const creatureData = {
            ...editingPrivate,
            // Format list data here instead of in the function argument.
            /*
                        resistance: editingPrivate.resistance.map(item => `${item.type} ${item.value}`).join(', '),
            */
            resistance: sanitizeList(editingPrivate.resistance, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            arcane: sanitizeList(editingPrivate.arcane, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            primal: sanitizeList(editingPrivate.primal, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            divine: sanitizeList(editingPrivate.divine, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            elemental: sanitizeList(editingPrivate.elemental, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            occult: sanitizeList(editingPrivate.occult, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),

            immunity: sanitizeList(editingPrivate.immunity, 'immunity').map(item => item.type || '').join(', '),
            items: sanitizeList(editingPrivate.items, 'items').map(item => item.type || '').join(', '),
            weaponsName: sanitizeList(editingPrivate.weaponsName, 'weaponsName').map(item => item.type || '').join(', '),
            armorName: sanitizeList(editingPrivate.armorName, 'armorName').map(item => item.type || '').join(', '),
            equipmentName: sanitizeList(editingPrivate.equipmentName, 'equipmentName').map(item => item.type || '').join(', '),
            abilityDescription: sanitizeList(editingPrivate.abilityDescription, 'abilityDescription').join('.;'),
            melee: sanitizeList(editingPrivate.melee, 'melee').join(';'),
            ranged: sanitizeList(editingPrivate.ranged, 'ranged').join(';'),
            trait: sanitizeList(editingPrivate.trait, 'trait').map(item => item.type || '').join(', '),
            weakness: sanitizeList(editingPrivate.weakness, "weakness").map(item => `${item.type} ${item.value}`).join(', '),
            language: sanitizeList(editingPrivate.language, "language").map(item => item.type).join(', '),  //Simplified

            speed: sanitizeList(editingPrivate.speed ,"speed").map(item => `${item.type} ${item.value ? (item.value + ' feet') : ''}`).join(', '),

            skill: sanitizeList(editingPrivate.skill,"skill").map(item => `${item.type} ${item.value}`).join(', '),
            speedRaw: sanitizeList(editingPrivate.speedRaw,"speedRaw").map(item => `${item.type} ${item.value}`).join(', '),


        };
        console.log("creatureData:", creatureData.abilityDescription); // Log after processing

        try {
            const updated = await makeRequest(`/api/bestiary/private/${editingPrivate.id}`, 'PUT', creatureData, user.token);
            setBestiaryPrivate(bestiaryPrivate.map(b => b.id === updated.id ? updated : b));
            setEditingPrivate(null);
            setShowItems(false)
        } catch (error) {
            setError(error.message);
        }
    };

// Delete BestiaryPrivate
    const handleDeletePrivate = async (id) => {
        try {
            await makeRequest(`/api/bestiary/private/${id}`, 'DELETE', null, user.token);
            setBestiaryPrivate(bestiaryPrivate.filter(b => b.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };
    const [searchTerm, setSearchTerm] = useState('');

    const filterCreature = (creatures) =>
        creatures.filter(creature => {
            return creature.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

    const [sortDirection, setSortDirection] = useState(0); // 0=default 1=ascending 2=descending
    const [sortCriteria, setSortCriteria] = useState('');

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            setSortDirection((prev) => (prev === 2 ? 0 : prev + 1));
        } else {
            setSortCriteria(criteria);
            setSortDirection(1);
        }
    };
    const sortCreatures = (creatures) => {
        if (sortDirection === 0) return creatures;

        // Mapping of sort criteria to property names
        const sortBy = {
            level: (creature) => creature.level,
            ac: (creature) => creature.ac,
            fort: (creature) => creature.fortitudeSave,
            ref: (creature) => creature.reflexSave,
            will: (creature) => creature.willSave,
            hp: (creature) => creature.hp,
            str: (creature) => creature.strength,
            dex: (creature) => creature.dexterity,
            con: (creature) => creature.constitution,
            int: (creature) => creature.intelligence,
            wis: (creature) => creature.wisdom,
            cha: (creature) => creature.charisma,
            perception: (creature) => creature.perception
        };

        const sortedItems = [...creatures].sort((a, b) => {
            const sortFunction = sortBy[sortCriteria];
            if (sortFunction) {
                return sortFunction(a) - sortFunction(b);
            }
            return 0;
        });

        return sortDirection === 1 ? sortedItems : sortedItems.reverse();
    };

    const filteredCreaturesPrivate = filterCreature(bestiaryPrivate);

    const allCreatures = [
        ...filterCreature(bestiaryPublic).map(w => ({...w, isPrivate: false, compositeKey: `publicCreature-${w.id}` })),
        ...filterCreature(bestiaryPrivate).map(w => ({...w, isPrivate: true, compositeKey: `privateCreature-${w.id}` }))
    ];

    const sortedBestiaryPublic = sortCreatures(allCreatures);
    const sortedBestiaryPrivate = sortCreatures(filteredCreaturesPrivate);

    const formatChar = (str, dex, con, int, wis, cha) => {

        const formatWithSign = (value, label) => {
            return `${value > 0 ? '+' : ''}${value} ${label}`;
        };
        const parts = [];
        parts.push(formatWithSign(str, 'Str,'));
        parts.push(formatWithSign(dex, 'Dex,'));
        parts.push(formatWithSign(con, 'Con,'));
        parts.push(formatWithSign(int, 'Int,'));
        parts.push(formatWithSign(wis, 'Wis,'));
        parts.push(formatWithSign(cha, 'Cha'));

        return parts.join(' ');

    };

    const [npc, setNpc] = useState(null); // new state to handle npc selection
    const [showNpcMonsterSelection, setShowNpcMonsterSelection] = useState(false); // control visibility of new buttons

    const handleTableClick = (tableName) => {
        setActiveTable(tableName);
        setSearchTerm('');
        setShowNpcMonsterSelection(tableName === 'bestiaryPublic' || tableName === 'bestiaryPrivate');
        // Reset the NPC/Monster selection whenever a new table is clicked
        setShowAddPrivateForm(false);
        setNewPrivate(defaultPrivateState)
        setEditingPrivate(null);
        setNpc('');
    };
    const RarityDropdown = ({ value, onChange }) => (
        <>Rarity:
            <select name="rarity" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="">Select Rarity</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="unique">Unique</option>
            </select>
        </>
    );

    const VisionDropdown = ({ value, onChange }) => (
        <>
            <select name="vision" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="">Normal vision</option>
                <option value="Low-light vision">Low-light vision</option>
                <option value="Darkvision">Darkvision</option>
                <option value="Greater darkvision">Greater darkvision</option>
            </select>
        </>
    );


    /*    {
        marginBottom: '10px',
            border: '1px solid lightgrey',
        padding: '8px',
        borderRadius: '4px',
        width: `300px`
    }*/



    const ContentSeparator = ({ header, column, label, separator = ";",
                                  additionalText = "", tooltip = false, contentStyle={} }) => {
        const dataToRender = header && header[column];

        return (
            <td>
                {dataToRender && dataToRender.length > 0 ? (
                    dataToRender.split(separator).map((data, index) => (
                        <div key={index} className="content-bubble" style={contentStyle}
                        >
                            {tooltip ? (
                                <TooltipHighlighterWeapons
                                    text={data.trim() + additionalText}
                                    traitsData={traitsData}
                                    textStyles={{
                                        color: 'green',
                                        fontWeight: "bold",
                                        cursor: "help"
                                    }}
                                    tooltipStyles={{
                                        backgroundColor: 'darkred',
                                        color: 'white',
                                        fontWeight: "normal",
                                        borderRadius: '10px'
                                    }}
                                    object={"trait"}
                                />
                            ) : (
                                <span>{data.trim() + additionalText}</span>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No {label}</div>
                )}
            </td>
        );
    };


    const handleMultiDropdownChange = (newList) => {
        setNewPrivate(prev => ({...prev, trait: newList})); // Correctly update newPrivate.trait
    };

    const bigOptions = ["Aasimar", "Anadi", "Android", "Aphorite", "Giant", "Humanoid", "Monitor", "Negative", "Ooze", "Petitioner", "Plant", "Positive", "Spirit", "Time", "Undead", "Wild", "Hunt", "Wraith", "Wyrwood", "Xulgath", "Zombie", "Air", "Earth", "Erratic", "Finite", "Fire", "Chaotic", "Lawful"];

    const ancestryOptions = [ "Human",  "Dwarf", "Gnome", "Halfling", "Elf", "Half-Elf",  "Tiefling", "Aasimar", "Orc", "Half-Orc",  "Android", "Automaton", "Azarketi", "Beastkin", "Catfolk", "Changeling", "Dhampir", "Dragonblood", "Duskwalker", "Goblin", "Fleshwarp", "Geniekin", "Gnoll", "Hobgoblin", "Kitsune", "Kobold", "Lizardfolk"];

    const creatureTypeOptions = ["Aberration", "Animal", "Astral", "Beast", "Celestial", "Construct", "Dragon", "Dream", "Elemental", "Ethereal", "Fey", "Fiend", "Fungus", "Giant", "Humanoid", "Monitor", "Ooze", "Petitioner", "Plant", "Spirit", "Undead"];

    const monsterOptions = ["Aasimar", "Acid", "Aeon", "Alchemical", "Amphibious", "Angel", "Aquatic", "Arcane", "Archon", "Asura", "Azata", "Boggard", "Bugbear", "Catfolk", "Centaur", "Changeling", "Cold", "Demon", "Devil", "Dhampir", "Dinosaur", "Drow", "Duergar", "Duskwalker", "Electricity", "Fetchling", "Genie", "Ghoran", "Ghost", "Ghoul", "Gnoll", "Golem", "Gremlin", "Hag", "Herald", "Ifrit", "Ikeshti", "Illusion", "Incorporeal", "Kaiju", "Kobold", "Leshy", "Lizardfolk", "Merfolk", "Mindless", "Morlock", "Mortic", "Mummy", "Mutant", "Nymph", "Oread", "Phantom", "Protean", "Psychopomp", "Ratfolk", "Serpentfolk", "Shapechanger", "Skeleton", "Sonic", "Soulbound", "Sporeborn", "Spriggan", "Sprite", "Suli", "Swarm", "Sylph", "Tengu", "Tiefling", "Titan", "Troll", "Troop", "Undine", "Vampire", "Werecreature", "Wight", "Wild", "Hunt", "Wraith", "Wyrwood", "Zombie"];

    const planarOptions = ["Air", "Earth", "Fire", "Water", "Negative", "Positive", "Shadow", "Gravity", "Time"];

    const alignmentOptions = ["Evil", "Good", "Chaotic", "Lawful"];

    const damageOptions = ["slashing", "piercing", "bludgeoning", "fire", "cold", "electricity", "acid", "sonic", "positive", "negative", "force", "evil", "good", "chaotic", "lawful", "mental", "poison", "bleed", "precision", "cold iron"];
    const immunityOptions = ["disease","magical attacks","non-magical attacks","paralysis","poison","unconscious","slashing", "piercing", "bludgeoning", "fire", "cold", "electricity", "acid", "sonic", "positive", "negative", "force", "evil", "good", "chaotic", "lawful", "mental", "poison", "bleed", "precision", "cold iron"];
    const speedOptions = ["walk", "fly", "swim", "burrow", "climb"];
    const skillOptions = ["Acrobatics", "Arcana", "Athletics", "Crafting", "Deception", "Diplomacy", "Intimidation", "Lore","Medicine" ,"Nature","Occultism","Performance","Religion" ,"Society" ,"Stealth","Survival" ,"Thievery"];
    const languageOptions = ["Common ", "Draconic", "Dwarven", "Elven", "Fey", "Gnomish", "Goblin", "Halfling","Jotun" ,"Orcish","Sakvroth","Aklo","Alghollthu" ,"Daemonic" ,"Infernal","Empyrean" ,"Thalassic"];


    const actionOptions = ["Single Action", "Two Actions", "Three Actions"];

    const traitOptions = ["Agile", "Magical", "Reach", "Bonus"];

    const traitMeleeOptions = ["Agile", "Attached", "Backstabber", "Backswing", "Brace", "Climbing", "Concealable", "Concussive", "Deadly", "Finesse", "Forceful", "Free-Hand", "Grapple", "Nonlethal", "Shove", "Sweep", "Tethered", "Trip", "Two-Hand", "Venomous"];
    const traitRangedOptions = ["Brutal", "Capacity", "Cobbled", "Concealable", "Deadly", "Double Barrel", "Kickback", "Propulsive", "Recovery"];
    const traitRangedValueOptions = ["Range", "Range Increment", "Volley"];
    const traitMeleeValueOptions = ["Reach", "Close"];

    /*
        const allWeaponNames = Object.keys(weaponsAllData);
    */


    const [showItems, setShowItems] = useState(false); // State to control checkbox for items
    const [showSpells, setShowSpells] = useState(false); // State to control checkbox for items


    const [selectedTraditions, setSelectedTraditions] = useState([]);
    const [selectedSchools, setSelectedSchools] = useState({});
    const [selectedLevels, setSelectedLevels] = useState({});

    const handleTraditionChange = (tradition) => {
        setSelectedTraditions((prev) =>
            prev.includes(tradition) ? prev.filter(t => t !== tradition) : [...prev, tradition]
        );
        // Reset schools and levels when traditions change
        setSelectedSchools((prev) => ({ ...prev, [tradition]: [] }));
        setSelectedLevels({});
    };

    const handleSchoolChange = (tradition, school) => {
        setSelectedSchools((prev) => {
            const schools = prev[tradition] || [];
            return { ...prev, [tradition]: schools.includes(school) ? schools.filter(s => s !== school) : [...schools, school] };
        });
    };

    const handleLevelChange = (tradition, school, level) => {
        setSelectedLevels((prev) => {
            const key = `${tradition}-${school}`;
            const levels = prev[key] || [];
            return { ...prev, [key]: levels.includes(level) ? levels.filter(l => l !== level) : [...levels, level] };
        });
    };




    const [startIndex, setStartIndex] = useState(0);
    const creaturesPerPage = 100; // Change this to 50 for the new requirement

    const handleNext = () => {
        setStartIndex(startIndex + creaturesPerPage);
    };

    const handlePrevious = () => {
        setStartIndex(Math.max(0, startIndex - creaturesPerPage));
    };

// Calculate the paginated creatures
    const paginatedBestiaryPublic = sortedBestiaryPublic.slice(startIndex, startIndex + creaturesPerPage);

    return (
        <div>
            <h1>Bestiary</h1>

            <button onClick={() => navigate('/dashboard?campaignId=' + campaignId)}>Dashboard</button>
            {/* Buttons to switch between Public, Private, and Actions tables */}
            <button onClick={() => handleTableClick('bestiaryPublic')}>Public Bestiary</button>
            <button onClick={() => handleTableClick('bestiaryPrivate')}>Private Bestiary</button>

            {showNpcMonsterSelection && (
                <div>
                    <button
                        onClick={() => setNpc(false) || setShowAddPrivateForm(false) || setNewPrivate(defaultPrivateState) || setEditingPrivate(null)}>Monster
                    </button>
                    <button
                        onClick={() => setNpc(true) || setShowAddPrivateForm(false) || setNewPrivate(defaultPrivateState) || setEditingPrivate(null)}>NPC
                    </button>
                    <button
                        onClick={() => setNpc(null) || setShowAddPrivateForm(false) || setNewPrivate(defaultPrivateState) || setEditingPrivate(null)}>All
                    </button>
                </div>
            )}

            {error && <p style={{color: 'red'}}>{error}</p>}
            {/* Tables for Public, Private, and Actions, similar to ItemsPage.  Use your filtering and sorting functions */}
            {activeTable === 'bestiaryPublic' && (
                <>
                    <h2>Search Bestiary</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>Public Bestiary</h2>
                    <div>
                        {startIndex}---{startIndex+100}<br/>
                        <button onClick={handlePrevious} disabled={startIndex === 0}>&lt; Previous</button>
                        <button onClick={handleNext}
                                disabled={startIndex + creaturesPerPage >= sortedBestiaryPublic.length}>Next &gt;</button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('perception')}>
                                    Perception {sortCriteria === 'perception' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}<br/>
                                </span>
                            </th>
                            <th>Defenses:<br/>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('ac')}>
                                    AC {sortCriteria === 'ac' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}<br/>
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('fort')}>
                                    Fortitude {sortCriteria === 'fort' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                    <br/>
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('ref')}>
                                    Reflex {sortCriteria === 'ref' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                    <br/>
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('will')}>
                                    Will {sortCriteria === 'will' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('hp')}>
                                    HP {sortCriteria === 'hp' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th>Characteristics:<br/>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('str')}>
                                    Str {sortCriteria === 'str' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('dex')}>
                                    Dex {sortCriteria === 'dex' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('con')}>
                                    Con {sortCriteria === 'con' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},<br/>
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('int')}>
                                    Int {sortCriteria === 'int' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('wis')}>
                                    Wis {sortCriteria === 'wis' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('cha')}>
                                    Cha {sortCriteria === 'cha' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                            </th>
                            <th>Speed</th>
                            <th>Skills</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                    Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Languages</th>

                            <th>Melee</th>
                            <th>Ranged</th>
                            <th>Abilities</th>

                            <th>Traits</th>
                            <th>Summary</th>
                            <th>Source</th>

                            <th>Modify</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedBestiaryPublic.length > 0 ? (
                            paginatedBestiaryPublic.filter(creature => npc === null || creature.npc === npc).map(creature => (
                                <tr key={creature.compositeKey}>
                                    <td>{creature.name}</td>
                                    <td>{`+${creature.perception}${creature.vision !== null ? '; ' + creature.vision : ''}`}</td>
                                    <td>{[
                                        "AC " + creature.ac,
                                        "Fort +" + creature.fortitudeSave,
                                        "Ref +" + creature.reflexSave,
                                        "Will +" + creature.willSave]
                                        .filter(Boolean) // Only keep non-null values
                                        .map((item, index) => (
                                            <React.Fragment key={index}>
                                                {item}
                                                {/* Add double breaks after each specific item */}
                                                {index === 0 && <><br/><br/></>} {/* After hp */}
                                                {index === 1 && <><br/><br/></>} {/* After immunities */}
                                                {index === 2 && <><br/><br/></>} {/* After resistances */}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td className="what-cell">
                                        {[
                                            `HP  ${creature.hp};`,
                                            creature.immunity !== null ? `Immunities  ${creature.immunity};` : null,
                                            creature.resistance !== '' ? `Resistances ${creature.resistance};` : null,
                                            creature.weakness !== '' ? `Weaknesses ${creature.weakness};` : null,
                                        ]
                                            .map((item, index) => (
                                                <React.Fragment key={index}>
                                                    {item}
                                                    {index === 0 && <><br/><br/></>}
                                                    {index === 1 && <><br/><br/></>}
                                                    {index === 2 && <><br/><br/></>}
                                                </React.Fragment>
                                            ))}
                                    </td>
                                    <td>{formatChar(
                                        creature.strength,
                                        creature.dexterity,
                                        creature.constitution,
                                        creature.intelligence,
                                        creature.wisdom,
                                        creature.charisma
                                    )}
                                    </td>
                                    <ContentSeparator
                                        header={creature}
                                        column={"speedRaw"}
                                        label={"movement"}
                                        separator={","}
                                        additionalText={""}
                                    />

                                    <td>{creature.skill}</td>
                                    <td>{creature.level}</td>
                                    <td className="whatever-cell">{creature.language}</td>

                                    <ContentSeparator
                                        header={creature}
                                        column={"melee"}
                                        label={"melee attacks"}
                                        additionalText={""}
                                        tooltip={true}
                                    />


                                    <ContentSeparator
                                        header={creature}
                                        column={"ranged"}
                                        label={"ranged attacks"}
                                        additionalText={""}
                                        tooltip={true}
                                    />

                                    <ContentSeparator
                                        header={creature}
                                        column={"abilityDescription"}
                                        label={"abilities"}
                                        separator={".;"}
                                        additionalText={""}
                                    />


                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={creature.trait}
                                            traitsData={traitsData}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here
                                            object="trait"
                                        />
                                    </td>
                                    <td className="summary-cell">{creature.text}</td>
                                    <td>{creature.sourceRaw}</td>

                                    {/* Add other data cells here */}
                                    {creature.isPrivate && (
                                        <td>
                                            <button onClick={() => setEditingPrivate(creature)}>Edit</button>
                                            <button onClick={() => handleDeletePrivate(creature.id)}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No creatures found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
            )}

            {
                activeTable === 'bestiaryPrivate' && (
                    <>
                        <h2>Search Private Bestiary</h2>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm} // Assuming you have a separate search term for private bestiary
                            onChange={(e) => setSearchTerm(e.target.value)} // And a setter for it
                        />
                        <h2>Private Bestiary</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('perception')}>
                                    Perception {sortCriteria === 'perception' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}<br/>
                                </span>
                                </th>
                                <th>Defenses:<br/>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('ac')}>
                                    AC {sortCriteria === 'ac' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}<br/>
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('fort')}>
                                    Fortitude {sortCriteria === 'fort' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                        <br/>
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('ref')}>
                                    Reflex {sortCriteria === 'ref' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                        <br/>
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('will')}>
                                    Will {sortCriteria === 'will' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                                </th>
                                <th>
                                <span style={{cursor: 'pointer'}} onClick={() => handleSort('hp')}>
                                    HP {sortCriteria === 'hp' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                                </th>
                                <th>Characteristics:<br/>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('str')}>
                                    Str {sortCriteria === 'str' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('dex')}>
                                    Dex {sortCriteria === 'dex' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('con')}>
                                    Con {sortCriteria === 'con' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},<br/>
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('int')}>
                                    Int {sortCriteria === 'int' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('wis')}>
                                    Wis {sortCriteria === 'wis' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''},
                                </span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleSort('cha')}>
                                    Cha {sortCriteria === 'cha' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                                </span>
                                </th>
                                <th>Speed</th>
                                <th>Skills</th>
                                <th>Level</th>
                                <th>Languages</th>

                                <th>Melee</th>
                                <th>Ranged</th>
                                <th>Abilities</th>
                                <th>Items</th>
                                <th>Spells</th>

                                <th>Traits</th>
                                <th>Summary</th>
                                <th>Source</th>

                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedBestiaryPrivate.length > 0 ? (
                                sortedBestiaryPrivate.filter(creature => npc === null || creature.npc === npc).map((creature) => (
                                    <tr key={creature.id}>
                                        <td>{creature.name}</td>
                                        <td>{`+${creature.perception}${creature.vision !== null ? '; ' + creature.vision : ''}`}</td>
                                        <td>{[
                                            "AC " + creature.ac,
                                            "Fort +" + creature.fortitudeSave,
                                            "Ref +" + creature.reflexSave,
                                            "Will +" + creature.willSave]
                                            .filter(Boolean) // Only keep non-null values
                                            .map((item, index) => (
                                                <React.Fragment key={index}>
                                                    {item}
                                                    {/* Add double breaks after each specific item */}
                                                    {index === 0 && <><br/><br/></>} {/* After hp */}
                                                    {index === 1 && <><br/><br/></>} {/* After immunities */}
                                                    {index === 2 && <><br/><br/></>} {/* After resistances */}
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td className="what-cell">
                                            {[
                                                `HP  ${creature.hp};`,
                                                creature.immunity !== null ? `Immunities  ${creature.immunity};` : null,
                                                creature.resistance !== '' ? `Resistances ${creature.resistance};` : null,
                                                creature.weakness !== '' ? `Weaknesses ${creature.weakness};` : null,
                                            ]
                                                .map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        {item}
                                                        {index === 0 && <><br/><br/></>}
                                                        {index === 1 && <><br/><br/></>}
                                                        {index === 2 && <><br/><br/></>}
                                                    </React.Fragment>
                                                ))}
                                        </td>
                                        <td>{formatChar(
                                            creature.strength,
                                            creature.dexterity,
                                            creature.constitution,
                                            creature.intelligence,
                                            creature.wisdom,
                                            creature.charisma
                                        )}
                                        </td>


                                        <ContentSeparator
                                            header={creature}
                                            column={"speedRaw"}
                                            label={"movement"}
                                            separator={","}
                                            additionalText={" feet"}
                                        />
                                        <td>{creature.skill}</td>
                                        <td>{creature.level}</td>
                                        <td className="whatever-cell">{creature.language}</td>

                                        <ContentSeparator
                                            header={creature}
                                            column={"melee"}
                                            label={"melee attacks"}
                                            additionalText={""}
                                            tooltip={true}
                                        />
                                        <ContentSeparator
                                            header={creature}
                                            column={"ranged"}
                                            label={"ranged attacks"}
                                            additionalText={""}
                                            tooltip={true}
                                        />

                                        <ContentSeparator
                                            header={creature}
                                            column={"abilityDescription"}
                                            label={"abilities"}
                                            contentStyle={{width: '200px'}}
                                        />

                                        <td>
                                            <TooltipHighlighterWeapons
                                                text={creature.weaponsName}  // Assuming creature.items is an array of weapon names
                                                traitsData={weaponsAllData} // This holds your combined weapon data
                                                textStyles={{color: 'red'}}
                                                tooltipStyles={{ color: 'purple' ,backgroundColor:`red`}} // Customize styling here
                                                object={"weapon"}
                                            />
                                            <br/>
                                            <TooltipHighlighterWeapons
                                                text={creature.armorName}  // Assuming creature.items is an array of weapon names
                                                traitsData={armorAllData} // This holds your combined weapon data
                                                object={"armor"}
                                            />
                                            <br/>
                                            <TooltipHighlighterWeapons
                                                text={creature.equipmentName}  // Assuming creature.items is an array of weapon names
                                                traitsData={equipmentAllData} // This holds your combined weapon data
                                                textStyles={{color: 'purple'}}
                                                tooltipStyles={{ color: 'purple' }} // Customize styling here
                                                object={"equipment"}
                                            />
                                            <br/>
                                        </td>
                                        <td>
                                            arcane:
                                            <TooltipHighlighterWeapons
                                                text={creature.arcane}  // Assuming creature.items is an array of weapon names
                                                traitsData={spellsData} // This holds your combined weapon data
                                                textStyles={{color: 'green'}}
                                                tooltipStyles={{color: 'purple'}} // Customize styling here
                                                object={"trait"}
                                            /><br/>
                                            primal:
                                            <TooltipHighlighterWeapons
                                                text={creature.primal}  // Assuming creature.items is an array of weapon names
                                                traitsData={spellsData} // This holds your combined weapon data
                                                textStyles={{color: 'green'}}
                                                tooltipStyles={{color: 'purple'}} // Customize styling here
                                                object={"trait"}
                                            /><br/>
                                            divine:
                                            <TooltipHighlighterWeapons
                                                text={creature.divine}  // Assuming creature.items is an array of weapon names
                                                traitsData={spellsData} // This holds your combined weapon data
                                                textStyles={{color: 'green'}}
                                                tooltipStyles={{color: 'purple'}} // Customize styling here
                                                object={"trait"}
                                            /><br/>
                                            elemental:
                                            <TooltipHighlighterWeapons
                                                text={creature.elemental}  // Assuming creature.items is an array of weapon names
                                                traitsData={spellsData} // This holds your combined weapon data
                                                textStyles={{color: 'green'}}
                                                tooltipStyles={{color: 'purple'}} // Customize styling here
                                                object={"trait"}
                                            /><br/>
                                            occult:
                                            <TooltipHighlighterWeapons
                                                text={creature.occult}  // Assuming creature.items is an array of weapon names
                                                traitsData={spellsData} // This holds your combined weapon data
                                                textStyles={{color: 'green'}}
                                                tooltipStyles={{color: 'purple'}} // Customize styling here
                                                object={"trait"}
                                            />
                                        </td>
                                        <td>
                                            <TooltipHighlighterWeapons
                                                text={creature.trait}  // Assuming creature.items is an array of weapon names
                                                traitsData={traitsData} // This holds your combined weapon data
                                                object={"trait"}
                                            />
                                        </td>

                                        <td className="summary-cell">{creature.text}</td>
                                        <td>{creature.sourceRaw}</td>
                                        <td>
                                            <button onClick={() => setEditingPrivate(creature)}>Edit</button>
                                            <button onClick={() => handleDeletePrivate(creature.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No creatures found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <button onClick={() => setShowAddPrivateForm(true)}>Create creature</button>
                    </>
                )}


            {/* Add forms for creating and editing entries  */}

            {showAddPrivateForm && (

                <form onSubmit={handleAddPrivate}>
                    spells?
                    <input
                        type="checkbox"
                        name="spell"
                        checked={showSpells}
                        onChange={(e) => setShowSpells(e.target.checked)} // Inline update the items state
                    />
                    {showSpells && (
                        <>
                            <h3>Select Traditions</h3>
                            {["Arcane", "Primal","Elemental","Occult","Divine"].map(tradition => (
                                <div key={tradition}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTraditions.includes(tradition)}
                                        onChange={() => handleTraditionChange(tradition)}
                                    />
                                    {tradition}
                                </div>
                            ))}

                            {selectedTraditions.map(tradition => (
                                <div key={tradition}>
                                    <h4>{tradition} Schools</h4>
                                    {Object.keys(spellOptions[tradition.toLowerCase()]).map(school => (
                                        <div key={school}>
                                            <input
                                                type="checkbox"
                                                checked={selectedSchools[tradition]?.includes(school)}
                                                onChange={() => handleSchoolChange(tradition, school)}
                                            />
                                            {school}
                                        </div>
                                    ))}

                                    {selectedSchools[tradition]?.map(school => (
                                        <div key={school}>
                                            <h5>{school} Levels</h5>
                                            {levels.map(level => (
                                                <div key={level}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLevels[`${tradition}-${school}`]?.includes(level)}
                                                        onChange={() => handleLevelChange(tradition, school, level)}
                                                    />
                                                    Level {level}
                                                </div>
                                            ))}

                                            Show spells for selected levels
                                            {selectedLevels[`${tradition}-${school}`]?.map(level => (
                                                /*                                            <MultiDropdown
                                                                                                key={`${tradition}-${school}-${level}`}
                                                                                                label={`${tradition} ${school} Level ${level}`}
                                                                                                initialValue={newPrivate.arcaneName}
                                                                                                options={spellOptions[tradition.toLowerCase()][school][level - 1] || []}
                                                                                                onChange={(newList) => handleDynamicListChange('arcaneName', newList)}
                                                                                            />*/
                                                <DynamicList
                                                    key={`${tradition}-${school}-${level}`}
                                                    label={`${tradition} ${school} Level ${level}`}
                                                    options={spellOptions[tradition.toLowerCase()][school][level - 1] || []}
                                                    onChange={(newList) => handleDynamicListChange([tradition.toLowerCase()], newList)}
                                                    showValueInput={true}
                                                />


                                                /*                                           <MultiDropdown
                                                                                           label="creature type"
                                                                                           fieldName="creatureType"
                                                                                           initialValue={newPrivate.trait.find(t => t.type === 'creatureType')?.values || []}
                                                                                           options={creatureTypeOptions}
                                                                                           onChange={handleTraitChange}
                                                                                            />*/
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}


                    Name:
                    <input type="text" name="name" value={newPrivate.name} onChange={handlePrivateInputChange}/>
                    Perception:
                    <input className="wh-cell" type="number" name="perception" value={newPrivate.perception}
                           onChange={handlePrivateInputChange}/>
                    <VisionDropdown
                        value={newPrivate.vision || ''}
                        onChange={handlePrivateInputChange}
                    />
                    Defenses:
                    AC:
                    <input className="wh-cell" type="number" name="ac" value={newPrivate.ac}
                           onChange={handlePrivateInputChange} min={"0"}/>
                    Fortitude:<input className="wh-cell" type="number" name="fortitudeSave"
                                     value={newPrivate.fortitudeSave}
                                     onChange={handlePrivateInputChange}/>
                    Reflex:<input className="wh-cell" type="number" name="reflexSave" value={newPrivate.reflexSave}
                                  onChange={handlePrivateInputChange}/>
                    Will:<input className="wh-cell" type="number" name="willSave" value={newPrivate.willSave}
                                onChange={handlePrivateInputChange}/>
                    <br/>
                    HP:
                    <input className="wh-cell" type="number" name="hp" value={newPrivate.hp}
                           onChange={handlePrivateInputChange} min={"1"}/>
                    <DynamicList
                        label="resistances"
                        fieldName="resistance"
                        initialValue={newPrivate.resistance || []} // Ensure it's an array
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListChange('resistance', newList)}
                    />
                    <DynamicList
                        label="weaknesses"
                        fieldName="weakness"
                        initialValue={newPrivate.weakness}
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListChange('weakness', newList)}
                    />
                    <DynamicList
                        label="immunities"
                        fieldName="immunity"
                        initialValue={newPrivate.immunity}
                        options={immunityOptions}
                        onChange={(newList) => handleDynamicListChange('immunity', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Characteristics:
                    <input className="wh-cell" type="number" name="strength" value={newPrivate.strength}
                           onChange={handlePrivateInputChange} placeholder={"Str"}/>
                    <input className="wh-cell" type="number" name="dexterity" value={newPrivate.dexterity}
                           onChange={handlePrivateInputChange} placeholder={"Dex"}/>
                    <input className="wh-cell" type="number" name="constitution" value={newPrivate.constitution}
                           onChange={handlePrivateInputChange} placeholder={"Con"}/>
                    <input className="wh-cell" type="number" name="intelligence" value={newPrivate.intelligence}
                           onChange={handlePrivateInputChange} placeholder={"Int"}/>
                    <input className="wh-cell" type="number" name="wisdom" value={newPrivate.wisdom}
                           onChange={handlePrivateInputChange} placeholder={"Wis"}/>
                    <input className="wh-cell" type="number" name="charisma" value={newPrivate.charisma}
                           onChange={handlePrivateInputChange} placeholder={"Char"}/>
                    <label></label>
                    <DynamicList
                        label="skills"
                        fieldName="skills"
                        initialValue={newPrivate.skill}
                        options={skillOptions}
                        onChange={(newList) => handleDynamicListChange('skill', newList)}
                    />
                    <DynamicList
                        label="movement"
                        fieldName="speed"
                        initialValue={newPrivate.speedRaw}
                        options={speedOptions}
                        onChange={(newList) => handleDynamicListChange('speedRaw', newList)}
                    />
                    <DynamicList
                        label="languages"
                        fieldName="language"
                        initialValue={newPrivate.language}
                        options={languageOptions}
                        onChange={(newList) => handleDynamicListChange('language', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Level:
                    <input style={{marginRight: "5px", width: "50px"}} type="number" name="level"
                           value={newPrivate.level}
                           onChange={handlePrivateInputChange}/>
                    <DynamicListAbilities
                        label="ability"
                        initialValue={newPrivate.abilityDescription}
                        onChange={(newList) => handleDynamicListChange('abilityDescription', newList)}
                    />
                    <br/>
                    NPC?:
                    <input
                        type="checkbox"
                        name="npc"
                        checked={newPrivate.npc}
                        onChange={(e) => setNewPrivate({...newPrivate, npc: e.target.checked})}
                    />
                    {newPrivate.npc ? (
                        <MultiDropdown
                            label="ancestry"
                            fieldName="ancestry"
                            initialValue={newPrivate.trait.find(t => t.type === 'ancestry')?.values || []}
                            options={ancestryOptions}
                            onChange={handleTraitChange}
                        />
                    ) : (
                        <>
                            <MultiDropdown
                                label="creature type"
                                fieldName="creatureType"
                                initialValue={newPrivate.trait.find(t => t.type === 'creatureType')?.values || []}
                                options={creatureTypeOptions}
                                onChange={handleTraitChange}
                            />
                            <MultiDropdown
                                label="monster"
                                fieldName="monster"
                                initialValue={newPrivate.trait.find(t => t.type === 'monster')?.values || []}
                                options={monsterOptions}
                                onChange={handleTraitChange}
                            />
                        </>)}
                    <MultiDropdown label="planar" fieldName="planar"
                                   initialValue={newPrivate.trait.find(t => t.type === 'planar')?.values || []}
                                   options={planarOptions} onChange={handleTraitChange}/>
                    <MultiDropdown label="alignment" fieldName="alignment"
                                   initialValue={newPrivate.trait.find(t => t.type === 'alignment')?.values || []}
                                   options={alignmentOptions} onChange={handleTraitChange}/>
                    <br/>
                    Items?
                    <input
                        type="checkbox"
                        name="item"
                        checked={showItems}
                        onChange={(e) => setShowItems(e.target.checked)} // Inline update the items state
                    />
                    {showItems && (
                        <>
                            <DynamicList
                                label="weapons"
                                fieldName="weaponsName"
                                initialValue={newPrivate.weaponsName}
                                options={Object.keys(weaponsAllData)}
                                onChange={(newList) => handleDynamicListChange('weaponsName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="weapons"
                                fieldName="armorName"
                                initialValue={newPrivate.armorName}
                                options={Object.keys(armorAllData)}
                                onChange={(newList) => handleDynamicListChange('armorName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="weapons"
                                fieldName="equipmentName"
                                initialValue={newPrivate.equipmentName}
                                options={Object.keys(equipmentAllData)}
                                onChange={(newList) => handleDynamicListChange('equipmentName', newList)}
                                showValueInput={false}
                            />
                        </>)}

                    <br/>
                    <div className="multi-dropdown-container">
                        Summary:
                        <div className="multi-dropdown-item"><textarea name="text" value={newPrivate.text}
                                                                       onChange={handlePrivateInputChange}
                                                                       placeholder={"Summary"}

                        /></div></div>
                    Source:<input type="text" name="sourceRaw" value={newPrivate.sourceRaw}
                                  onChange={handlePrivateInputChange} placeholder={"Source"}/>


                    <br/>
                    <DynamicListAttacks
                        label="melee attack"
                        actionOptions={actionOptions}
                        damageTypeOptions={damageOptions}
                        traitOptions={traitMeleeOptions}
                        rangedTraitOptions={traitMeleeValueOptions}
                        initialValue={newPrivate.melee}
                        onChange={(newList) => handleDynamicListChange('melee', newList)}
                    />
                    <DynamicListAttacks
                        label="ranged attack"
                        actionOptions={actionOptions}
                        damageTypeOptions={damageOptions}
                        traitOptions={traitRangedOptions}
                        rangedTraitOptions={traitRangedValueOptions}
                        initialValue={newPrivate.ranged}
                        onChange={(newList) => handleDynamicListChange('ranged', newList)}
                    />
                    {/* Add input fields for ALL other BestiaryPrivate fields */}
                    <button type="submit">Add</button>
                    <button type="button"
                            onClick={() => setShowAddPrivateForm(false) || setNewPrivate(defaultPrivateState) || setShowItems(false)}>Cancel
                    </button>
                </form>
            )}


            {editingPrivate && (
                <form onSubmit={handleUpdatePrivate}>
                    <input type="hidden" name="id" value={editingPrivate.id}/>
                    Name:
                    <input type="text" name="name" value={editingPrivate.name} onChange={handleEditPrivateChange}/>

                    Perception:
                    <input className="wh-cell" type="number" name="perception" value={editingPrivate.perception}
                           onChange={handlePrivateInputChange}/>
                    <VisionDropdown
                        value={editingPrivate.vision || ''}
                        onChange={handlePrivateInputChange}
                    />
                    Defenses:
                    AC:
                    <input className="wh-cell" type="number" name="ac" value={editingPrivate.ac}
                           onChange={handlePrivateInputChange}/>
                    Fortitude:<input className="wh-cell" type="number" name="fortitudeSave"
                                     value={editingPrivate.fortitudeSave}
                                     onChange={handlePrivateInputChange}/>
                    Reflex:<input className="wh-cell" type="number" name="reflexSave" value={editingPrivate.reflexSave}
                                  onChange={handlePrivateInputChange}/>
                    Will:<input className="wh-cell" type="number" name="willSave" value={editingPrivate.willSave}
                                onChange={handlePrivateInputChange}/>
                    <br/>
                    HP:
                    <input className="wh-cell" type="number" name="hp" value={editingPrivate.hp}
                           onChange={handlePrivateInputChange}/>
                    <DynamicList
                        label="resistances"
                        fieldName="resistance"
                        initialValue={editingPrivate.resistance || []} // Ensure it's an array
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListEditChange('resistance', newList)}
                    />
                    <DynamicList
                        label="weaknesses"
                        fieldName="weakness"
                        initialValue={editingPrivate.weakness}
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListEditChange('weakness', newList)}
                    />
                    <DynamicList
                        label="immunities"
                        fieldName="immunity"
                        initialValue={editingPrivate.immunity}
                        options={immunityOptions}
                        onChange={(newList) => handleDynamicListEditChange('immunity', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Characteristics:
                    <input className="wh-cell" type="number" name="strength" value={editingPrivate.strength}
                           onChange={handlePrivateInputChange} placeholder={"Str"}/>
                    <input className="wh-cell" type="number" name="dexterity" value={editingPrivate.dexterity}
                           onChange={handlePrivateInputChange} placeholder={"Dex"}/>
                    <input className="wh-cell" type="number" name="constitution" value={editingPrivate.constitution}
                           onChange={handlePrivateInputChange} placeholder={"Con"}/>
                    <input className="wh-cell" type="number" name="intelligence" value={editingPrivate.intelligence}
                           onChange={handlePrivateInputChange} placeholder={"Int"}/>
                    <input className="wh-cell" type="number" name="wisdom" value={editingPrivate.wisdom}
                           onChange={handlePrivateInputChange} placeholder={"Wis"}/>
                    <input className="wh-cell" type="number" name="charisma" value={editingPrivate.charisma}
                           onChange={handlePrivateInputChange} placeholder={"Char"}/>
                    <label></label>
                    <DynamicList
                        label="skills"
                        fieldName="skills"
                        initialValue={editingPrivate.skill}
                        options={skillOptions}
                        onChange={(newList) => handleDynamicListEditChange('skill', newList)}
                    />
                    <DynamicList
                        label="speed"
                        fieldName="speed"
                        initialValue={editingPrivate.speedRaw}
                        options={speedOptions}
                        onChange={(newList) => handleDynamicListEditChange('speedRaw', newList)}
                    />
                    <DynamicList
                        label="languages"
                        fieldName="language"
                        initialValue={editingPrivate.language}
                        options={languageOptions}
                        onChange={(newList) => handleDynamicListEditChange('language', newList)}
                        showValueInput={false}
                    />
                    NPC?:<input
                    type="checkbox"
                    name="npc"
                    checked={editingPrivate.npc} // Use checked for controlled components
                    onChange={(e) => setEditingPrivate({...editingPrivate, npc: e.target.checked})}/>
                    <DynamicList
                        label="traits"
                        fieldName="trait"
                        initialValue={editingPrivate.trait}
                        options={bigOptions}
                        onChange={(newList) => handleDynamicListEditChange('trait', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    spells?
                    <input
                        type="checkbox"
                        name="spell"
                        checked={showSpells}
                        onChange={(e) => setShowSpells(e.target.checked)} // Inline update the items state
                    />
                    {showSpells && (
                        <>
                            <h3>Select Traditions</h3>
                            {["Arcane", "Primal","Elemental", "Occult", "Divine"].map(tradition => (
                                <div key={tradition}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTraditions.includes(tradition)}
                                        onChange={() => handleTraditionChange(tradition)}
                                    />
                                    {tradition}
                                </div>
                            ))}

                            {selectedTraditions.map(tradition => (
                                <div key={tradition}>
                                    <h4>{tradition} Schools</h4>
                                    {Object.keys(spellOptions[tradition.toLowerCase()]).map(school => (
                                        <div key={school}>
                                            <input
                                                type="checkbox"
                                                checked={selectedSchools[tradition]?.includes(school)}
                                                onChange={() => handleSchoolChange(tradition, school)}
                                            />
                                            {school}
                                        </div>
                                    ))}

                                    {selectedSchools[tradition]?.map(school => (
                                        <div key={school}>
                                            <h5>{school} Levels</h5>
                                            {levels.map(level => (
                                                <div key={level}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLevels[`${tradition}-${school}`]?.includes(level)}
                                                        onChange={() => handleLevelChange(tradition, school, level)}
                                                    />
                                                    Level {level}
                                                </div>
                                            ))}

                                            {/* Show spells for selected levels */}
                                            {selectedLevels[`${tradition}-${school}`]?.map(level => (
                                                <DynamicList
                                                    key={`${tradition}-${school}-${level}`}
                                                    label={`${tradition} ${school} Level ${level}`}
                                                    options={spellOptions[tradition.toLowerCase()][school][level - 1] || []}
                                                    initialValue={editingPrivate[tradition.toLowerCase()]}
                                                    onChange={(newList) => handleDynamicListEditChange([tradition.toLowerCase()], newList)}
                                                    showValueInput={true}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                    Items?
                    <input
                        type="checkbox"
                        name="item"
                        checked={showItems}
                        onChange={(e) => setShowItems(e.target.checked)} // Inline update the items state
                    />
                    {showItems && (
                        <>
                            <DynamicList
                                label="weapon"
                                fieldName="weaponsName"
                                initialValue={editingPrivate.weaponsName}
                                options={Object.keys(weaponsAllData)}
                                onChange={(newList) => handleDynamicListEditChange('weaponsName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="armor"
                                fieldName="armorName"
                                initialValue={editingPrivate.armorName}
                                options={Object.keys(armorAllData)}
                                onChange={(newList) => handleDynamicListEditChange('armorName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="equipment"
                                fieldName="equipmentName"
                                initialValue={editingPrivate.equipmentName}
                                options={Object.keys(equipmentAllData)}
                                onChange={(newList) => handleDynamicListEditChange('equipmentName', newList)}
                                showValueInput={false}
                            />
                        </>)}

                    <br/>
                    Level:
                    <input type="number" name="level" value={editingPrivate.level}
                           onChange={handleEditPrivateChange}/>

                    <DynamicListAbilities
                        label="creature ability"
                        initialValue={editingPrivate.abilityDescription}
                        onChange={(newList) => handleDynamicListEditChange('abilityDescription', newList)}
                    />
                    <br/>
                    <DynamicListAbilities
                        label="melee attack"
                        initialValue={editingPrivate.melee}
                        onChange={(newList) => handleDynamicListEditChange('melee', newList)}
                        separator={";"}
                    />
                    <DynamicListAbilities
                        label="ranged attack"
                        initialValue={editingPrivate.ranged}
                        onChange={(newList) => handleDynamicListEditChange('ranged', newList)}
                        separator={";"}
                    /><br/>

                    <div className="multi-dropdown-container">
                        Summary:
                        <div className="multi-dropdown-item">
                            <textarea name="text" value={editingPrivate.text}
                                      onChange={handleEditPrivateChange} placeholder={"Summary"}
                            /></div></div>

                    Source:<input type="text" name="sourceRaw" value={editingPrivate.sourceRaw}
                                  onChange={handleEditPrivateChange} placeholder={"Source"}/>


                    {/* Add input fields for ALL other BestiaryPublic fields, pre-filled with editingPublic values */}
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingPrivate(null) || setShowItems(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
}

export default BestiaryPage;