import React, {useContext, useEffect, useState} from 'react';
import {makeRequest} from '../apiService'; //Your API service
import AuthContext from '../AuthContext';
import {useNavigate, useSearchParams} from 'react-router-dom';
import './Table.css'; //Your CSS
import DynamicListAbilities from './DynamicListAbilities';
import MultiDropdown from "./MultiDropdown";
import DynamicListAttacks from "./DynamicListAttacks";
import { TooltipHighlighterWeapons } from './TooltipHighlighterWeapons';
import DynamicSpellList from "./DynamicList";
import DynamicList from "./DynamicLisBackup";
import {TooltipHighlighterMutliple} from "./TooltipHighlighterMultiple"; // Import the new component

function BestiaryPage() {

    const { user, logout } = useContext(AuthContext);
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
    const [arcaneData, setArcaneData] = useState({}); // New state for trait data
    const [primalData, setPrimalData] = useState({}); // New state for trait data
    const [divineData, setDivineData] = useState({}); // New state for trait data
    const [occultData, setOccultData] = useState({}); // New state for trait data
    const [elementalData, setElementalData] = useState({}); // New state for trait data

    const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN');



    const [weaponsAllData, setWeaponsAllData] = useState({}); // New state for trait data
    const [weaponsAllMultipleData, setWeaponsAllMultipleData] = useState({}); // New state for trait data
    const [armorAllData, setArmorAllData] = useState({}); // New state for trait data
    const [equipmentAllData, setEquipmentAllData] = useState({}); // New state for trait data

    const processSpellsByTradition = (spells, tradition) => {
        const traditionData = { [tradition]: {} };
        let maxLevel = 0;
        spells.forEach((spell) => {
            if (spell.tradition.split(',').map((item) => item.trim()).includes(tradition)) {
                maxLevel = Math.max(maxLevel, spell.level);
            }
        });

        spells.forEach((spell) => {
            if (spell.tradition.split(',').map((item) => item.trim()).includes(tradition)) {
                const school = spell.school;
                const level = spell.level;
                if (!traditionData[tradition][school]) {
                    traditionData[tradition][school] = {};
                    for (let i = 1; i <= maxLevel; i++) {
                        traditionData[tradition][school][i] = [];
                    }
                }
                traditionData[tradition][school][level].push(spell.name);
            }
        });
        return traditionData;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const publicData = await makeRequest('/api/admin/getBestiary', 'GET', null, user.token);
                const privateData = await makeRequest(`/api/bestiary/private/${campaignId}`, 'GET', null, user.token);
                setBestiaryPublic(publicData);
                setBestiaryPrivate(privateData);

                const traits = await makeRequest('/api/admin/getTraits', 'GET',null, user.token); // Fetch trait data
                const traitsMap = {};
                traits.forEach(trait => traitsMap[trait.name] = `${trait.summary}  ${trait.sourceRaw}`);
                setTraitsData(traitsMap);

                const spells = await makeRequest('/api/admin/getSpells', 'GET', null, user.token);
                const spellsMap = {};
                spells.forEach(spell => {
                    spellsMap[spell.name] = `${spell.summary} Components ${spell.component}, School of ${spell.school},  ${spell.level} Circle`;
                });

                setSpellsData(spellsMap);

                const traditions = ['Arcane', 'Primal', 'Divine', 'Occult', 'Elemental'];
                const traditionData = {};
                for (const tradition of traditions) {
                    traditionData[tradition] = processSpellsByTradition(spells, tradition);
                }


                setArcaneData(processSpellsByTradition(spells, "Arcane"));
                setPrimalData(processSpellsByTradition(spells, "Primal"));
                setDivineData(processSpellsByTradition(spells, "Divine"));
                setOccultData(processSpellsByTradition(spells, "Occult"));
                setElementalData(processSpellsByTradition(spells, "Elemental"));





                const weaponPublicData = await makeRequest('/api/admin/getWeapons', 'GET', null, user.token);

                const weaponPublicMap = {};
                const weaponPublicMultipleMap = {};
                weaponPublicData.forEach(weapon => {
                    weaponPublicMultipleMap[weapon.name] =
                        ` Damage ${weapon.damage},
                         ${weapon.text}`

                    weaponPublicMap[weapon.name] = {
                        damage:weapon.damage,
                        text:weapon.text,
                        category:weapon.itemCategory,
                        private: false
                    }

                });

                const weaponPrivateData = await makeRequest(`/api/items/weapons/private/${campaignId}`, 'GET', null, user.token);


                const weaponPrivateMap = {};
                const weaponPrivateMultipleMap = {};
                weaponPrivateData.forEach(weapon => {
                    weaponPrivateMultipleMap[weapon.name] =
                        ` ${weapon.damage},
                         ${weapon.text}}`
                    weaponPrivateMap[weapon.name] = {
                        damage:weapon.damage,
                        text:weapon.text,
                        category:weapon.itemCategory,
                        private: false
                    }

                });
// Combine both maps
                const combinedWeaponData = { ...weaponPublicMap };
                const combinedWeaponMultipleData = { ...weaponPublicMultipleMap };

// Overwrite public data with private data if it exists
                Object.keys(weaponPrivateMap).forEach(key => {
                    combinedWeaponData[key] = weaponPrivateMap[key];
                    combinedWeaponMultipleData[key] = weaponPrivateMultipleMap[key];

                });

// Set the combined data to state
                setWeaponsAllData(combinedWeaponData);
                setWeaponsAllMultipleData(combinedWeaponMultipleData);

                // Create a comma-separated string of weapon names




                const armorPublicData = await makeRequest('/api/admin/getArmor', 'GET', null, user.token);

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

                const equipmentPublicData = await makeRequest('/api/admin/getEquipment', 'GET', null, user.token);


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


   /* // Default state for the form
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















    const defaultPublicState = {
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
        weaponsName: [],
        armorName: [],
        equipmentName: [],
        spells: '',
        arcane: [],
        primal: [],
        divine: [],
        elemental: [],
        occult: [],
        npc: false

    };
    const [newPublic, setNewPublic] = useState(defaultPublicState);*/

    // Base default state for shared fields
    const baseDefaultState = {
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
        spell: '',
        melee: [],
        ranged: [],
        abilityDescription: [],
        resistance: [],
        immunity: [],
        weakness: [],
        language: [],
        speed: [],
        speedRaw: [],
        skill: [],
        weaponsName: [],
        armorName: [],
        equipmentName: [],
        arcane: [],
        primal: [],
        divine: [],
        elemental: [],
        occult: [],
        npc: false,
    };

// Function to create the specific state based on type
    const createDefaultState = (isPrivate) => {
        return {
            ...baseDefaultState,
            ...(isPrivate ? { items: [] } : { spells: '' }) // Add 'items' for private or 'spells' for public
        };
    };

    const defaultPrivateState= createDefaultState(true)
    const defaultPublicState= createDefaultState(false)
// Usage of the state
    const [newPrivate, setNewPrivate] = useState(defaultPrivateState); // Private state
    const [newPublic, setNewPublic] = useState(defaultPublicState); // Public state


    const [ShowAddPublicForm, setShowAddPublicForm] = useState(false);


    const handlePublicTraitChange = (traitType, selectedOptions) => {
        const updatedTraits = [...newPublic.trait];
        const existingIndex = updatedTraits.findIndex(trait => trait.type === traitType);
        if (existingIndex !== -1) {
            updatedTraits[existingIndex] = { type: traitType, values: selectedOptions };
        } else {
            updatedTraits.push({ type: traitType, values: selectedOptions });
        }
        setNewPublic({ ...newPublic, trait: updatedTraits });
    };


    const handlePublicInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublic({ ...newPublic, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleDynamicPublicListChange = (fieldName, newList) => {
        setNewPublic({...newPublic, [fieldName]: newList});
    };
// Delete BestiaryPublic
    const handleDeletePublic = async (id) => {
        try {
            await makeRequest(`/api/admin/deleteBestiary/${id}`, 'DELETE', null, user.token);
            setBestiaryPublic(bestiaryPublic.filter(b => b.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };
    const handleAddPublic = async (e) => {
        e.preventDefault();
        console.log("newPublic before submit:", newPublic); // Add this log



        const errors = {}; // Initialize errors object for each validation
        // Check against both public and private bestiaries
        const existingCreature = bestiaryPublic.find(
            (creature) => creature.name.toLowerCase() === newPublic.name.toLowerCase()
        ) || bestiaryPublic.find(
            (creature) => creature.name.toLowerCase() === newPublic.name.toLowerCase()
        );

        if (existingCreature) {
            errors.name = "A creature with that name already exists.";
        }

        setFormErrors(errors); // Set errors for validation

        if (Object.keys(errors).length > 0) {
            return; // Prevent submission if errors exist
        }

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
            ...newPublic,
            // Format list data here instead of in the function argument.
            resistance: newPublic.resistance.map(item => `${item.type} ${item.value}`).join(', '),
            skill: newPublic.skill.map(item => `${item.type} ${item.value}`).join(', '),
            speedRaw: newPublic.speedRaw.map(item => `${item.type} ${item.value}`).join(', '),
            immunity: newPublic.immunity.map(item => item.type).join(', '), // Access only the type

            weaponsName: newPublic.weaponsName.map(item => item.type).join(', '), // Access only the type
            armorName: newPublic.armorName.map(item => item.type).join(', '), // Access only the type
            equipmentName: newPublic.equipmentName.map(item => item.type).join(', '), // Access only the type

            //this arcaneName: newPrivate.arcaneName.map(item => item.type).join(', '), // Access only the type


            arcane: newPublic.arcane.map(item => `${item.type} ${item.value}`).join(', '),
            primal: newPublic.primal.map(item => `${item.type} ${item.value}`).join(', '),
            divine: newPublic.divine.map(item => `${item.type} ${item.value}`).join(', '),
            elemental: newPublic.elemental.map(item => `${item.type} ${item.value}`).join(', '),
            occult: newPublic.occult.map(item => `${item.type} ${item.value}`).join(', '),

            trait: newPublic.trait.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
            //arcane: newPrivate.arcane.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
            /*            primal: newPrivate.primal.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        divine: newPrivate.divine.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        elemental: newPrivate.elemental.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data
                        occult: newPrivate.occult.map(t => `${t.values.join(', ')}`).join(', '), // Format trait data*/
            weakness: newPublic.weakness.map(item => `${item.type} ${item.value}`).join(', '),
            language: newPublic.language.map(item => item.type).join(', '),  //Simplified
            speed: (newPublic.speed || []).map(item => `${item.type} ${item.value ? (item.value + ' feet') : ''}`).join(', '),

            abilityDescription: (newPublic.abilityDescription || []).join('.;'), // Corrected line

            melee: formatAttacks(newPublic.melee),


            ranged: formatAttacks(newPublic.ranged)



        };
        console.log("creatureData:", creatureData); // Add this log

        try {
            const data = await makeRequest('/api/admin/addBestiary', 'POST', creatureData, user.token);
            setBestiaryPublic([...bestiaryPublic, data]);
            setNewPublic(defaultPublicState);
            setShowAddPublicForm(false); // Close the form
            setShowItems(false);
            setShowSpells(false);
        } catch (error) {
            setError(error.message);
        }
    };


    const [editingPublic, setEditingPublic] = useState(null);

    const handleDynamicListEditPublicChange = (fieldName, newList) => {
        setEditingPublic({ ...editingPublic, [fieldName]: newList });
    };

    const handleEditPublicChange = (e) => {
        const { name, value } = e.target;
        setEditingPublic({ ...editingPublic, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleUpdatePublic = async (e) => {
        e.preventDefault();  // Prevents the default form submission behavior

        const errors = {}; // Initialize errors object for validation

        //Check for duplicate names excluding the creature being edited
        if(editingPublic.name){
            const existingCreature = bestiaryPrivate.find(
                (creature) => creature.name.toLowerCase() === editingPublic.name.toLowerCase() && creature.id !== editingPublic.id
            ) || bestiaryPublic.find(
                (creature) => creature.name.toLowerCase() === editingPublic.name.toLowerCase() && creature.id !== editingPublic.id
            );

            if (existingCreature) {
                errors.name = "A creature with that name already exists.";
            }
        }

        setFormErrors(errors); // Set errors for validation

        if (Object.keys(errors).length > 0) {
            return; // Prevent submission if errors exist
        }

        console.log("Before creatureData:", editingPublic.abilityDescription); // Log before processing

        const creatureData = {
            ...editingPublic,
            // Format list data here instead of in the function argument.
            /*
                        resistance: editingPrivate.resistance.map(item => `${item.type} ${item.value}`).join(', '),
            */
            resistance: sanitizeList(editingPublic.resistance, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            arcane: sanitizeList(editingPublic.arcane, 'arcane').map(item => `${item.type} ${item.value || ''}`).join(', '),
            primal: sanitizeList(editingPublic.primal, 'primal').map(item => `${item.type} ${item.value || ''}`).join(', '),
            divine: sanitizeList(editingPublic.divine, 'divine').map(item => `${item.type} ${item.value || ''}`).join(', '),
            elemental: sanitizeList(editingPublic.elemental, 'elemental').map(item => `${item.type} ${item.value || ''}`).join(', '),
            occult: sanitizeList(editingPublic.occult, 'occult').map(item => `${item.type} ${item.value || ''}`).join(', '),

            immunity: sanitizeList(editingPublic.immunity, 'immunity').map(item => item.type || '').join(', '),
            items: sanitizeList(editingPublic.items, 'items').map(item => item.type || '').join(', '),
            weaponsName: sanitizeList(editingPublic.weaponsName, 'weaponsName').map(item => item.type || '').join(', '),
            armorName: sanitizeList(editingPublic.armorName, 'armorName').map(item => item.type || '').join(', '),
            equipmentName: sanitizeList(editingPublic.equipmentName, 'equipmentName').map(item => item.type || '').join(', '),
            abilityDescription: sanitizeList(editingPublic.abilityDescription, 'abilityDescription').join('.;'),

            melee: sanitizeList(editingPublic.melee, 'melee').join(';'),
            ranged: sanitizeList(editingPublic.ranged, 'ranged').join(';'),
            trait: sanitizeList(editingPublic.trait, 'trait').map(item => item.type || '').join(', '),
            weakness: sanitizeList(editingPublic.weakness, "weakness").map(item => `${item.type} ${item.value}`).join(', '),
            language: sanitizeList(editingPublic.language, "language").map(item => item.type).join(', '),  //Simplified

            speed: sanitizeList(editingPublic.speed ,"speed").map(item => `${item.type} ${item.value ? (item.value + ' feet') : ''}`).join(', '),

            skill: sanitizeList(editingPublic.skill,"skill").map(item => `${item.type} ${item.value}`).join(', '),
            speedRaw: sanitizeList(editingPublic.speedRaw,"speedRaw").map(item => `${item.type} ${item.value}`).join(', '),


        };
        console.log("creatureData:", creatureData.abilityDescription); // Log after processing

        try {
            await makeRequest(`/api/admin/updateBestiary/${editingPublic.id}`, 'PUT', creatureData, user.token);
            const updatedCreatures = await makeRequest('/api/admin/getBestiary', 'GET', null, user.token);
            setBestiaryPublic(updatedCreatures);
            setEditingPublic(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const clearError = (fieldName, value) => {
        if (fieldName === 'name' && value.length > 0) {
            const newErrors = { ...formErrors };
            delete newErrors.name;
            setFormErrors(newErrors);
        }
    };
    const handlePrivateInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrivate({ ...newPrivate, [name]: value });

        clearError(name, value); // Reuse the clearError function

    };

    const handleDynamicListChange = (fieldName, newList) => {
        setNewPrivate({...newPrivate, [fieldName]: newList});
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

    const [formErrors, setFormErrors] = useState({}); // New state for form errors
// Add BestiaryPrivate
    const handleAddPrivate = async (e) => {
        e.preventDefault();
        console.log("newPrivate before submit:", newPrivate); // Add this log



        const errors = {}; // Initialize errors object for each validation
        // Check against both public and private bestiaries
        const existingCreature = bestiaryPrivate.find(
            (creature) => creature.name.toLowerCase() === newPrivate.name.toLowerCase()
        ) || bestiaryPublic.find(
            (creature) => creature.name.toLowerCase() === newPrivate.name.toLowerCase()
        );

        if (existingCreature) {
            errors.name = "A creature with that name already exists.";
        }

        setFormErrors(errors); // Set errors for validation

        if (Object.keys(errors).length > 0) {
            return; // Prevent submission if errors exist
        }

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
            setShowItems(false);
            setShowSpells(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDynamicListEditChange = (fieldName, newList) => {
        setEditingPrivate({ ...editingPrivate, [fieldName]: newList });
    };
    const handleEditPrivateChange = (e) => {
        const { name, value } = e.target;
        setEditingPrivate({ ...editingPrivate, [name]: value });

        clearError(name, value); // Reuse the clearError function

    };
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
// Update BestiaryPrivate
    const handleUpdatePrivate = async (e) => {
        e.preventDefault();

        const errors = {}; // Initialize errors object for validation

        //Check for duplicate names excluding the creature being edited
        if(editingPrivate.name){
            const existingCreature = bestiaryPrivate.find(
                (creature) => creature.name.toLowerCase() === editingPrivate.name.toLowerCase() && creature.id !== editingPrivate.id
            ) || bestiaryPublic.find(
                (creature) => creature.name.toLowerCase() === editingPrivate.name.toLowerCase() && creature.id !== editingPrivate.id
            );

            if (existingCreature) {
                errors.name = "A creature with that name already exists.";
            }
        }

        setFormErrors(errors); // Set errors for validation

        if (Object.keys(errors).length > 0) {
            return; // Prevent submission if errors exist
        }

        console.log("Before creatureData:", editingPrivate.abilityDescription); // Log before processing

        const creatureData = {
            ...editingPrivate,
            // Format list data here instead of in the function argument.
            /*
                        resistance: editingPrivate.resistance.map(item => `${item.type} ${item.value}`).join(', '),
            */
            resistance: sanitizeList(editingPrivate.resistance, 'resistance').map(item => `${item.type} ${item.value || ''}`).join(', '),
            arcane: sanitizeList(editingPrivate.arcane, 'arcane').map(item => `${item.type} ${item.value || ''}`).join(', '),
            primal: sanitizeList(editingPrivate.primal, 'primal').map(item => `${item.type} ${item.value || ''}`).join(', '),
            divine: sanitizeList(editingPrivate.divine, 'divine').map(item => `${item.type} ${item.value || ''}`).join(', '),
            elemental: sanitizeList(editingPrivate.elemental, 'elemental').map(item => `${item.type} ${item.value || ''}`).join(', '),
            occult: sanitizeList(editingPrivate.occult, 'occult').map(item => `${item.type} ${item.value || ''}`).join(', '),

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
            setShowSpells(false)
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
        setNpc(false);
        resetIndex()
    };


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
                                  additionalText = "", appendText= "" , tooltip = false, contentStyle={},
                                  passData={traitsData}, object="trait",
                                  textStyles={color: 'green',
                                      fontWeight: "bold",
                                      cursor: "help"},tooltipStyles={
            backgroundColor: 'darkred',
            color: 'white',
            fontWeight: "normal",
            borderRadius: '10px'
        }, className="content-bubble" }) => {
        const dataToRender = header && header[column];

        return (
            <>
                {dataToRender && dataToRender.length > 0 ? (
                    dataToRender.split(separator).map((data, index) => (
                        <div key={index} className={className} style={contentStyle}>
                            {tooltip ? (
                                <TooltipHighlighterWeapons
                                    text={appendText + data.trim() + additionalText}
                                    traitsData={passData}
                                    object={object}
                                    textStyles={textStyles}
                                    tooltipStyles={tooltipStyles}
                                />
                            ) : (
                                <span>{appendText + data.trim() + additionalText}</span>
                            )}
                        </div>
                    ))
                ) : (
                    label && <div>No {label}</div>
                )}

            </>
        );
    };



    const ContentSeparatorMelee = ({header, column, label, separator = ";",
                                       additionalText = "",
                                       appendText= "" ,
                                       tooltip = false,
                                       contentStyle={},
                                       firstData={},
                                       secondData= {},
                                       object="",
                                       secondObject="",
                                       classname="content-bubble",
                                       textstyles={color: 'green', fontWeight: "bold", cursor: "help"},
                                       tooltipstyles={backgroundColor: 'darkred', color: 'white', fontWeight: "normal", borderRadius: '10px'
                                       }
                                   }) => {
        const dataToRender = header && header[column];

        return (
            <td>
                {dataToRender && dataToRender.length > 0 ? (
                    dataToRender.split(separator).map((data, index) => (
                        <div key={index} className={classname} style={contentStyle}
                        >
                            {tooltip ? (
                                <TooltipHighlighterMutliple
                                    text={appendText + data.trim() + additionalText}
                                    traitsData={firstData}
                                    secondData={secondData} // Pass your trait data here
                                    object={object}
                                    secondObject={secondObject} // Specify the second object type
                                    textStyles={textstyles}
                                    tooltipStyles={tooltipstyles}
                                />
                            ) : (
                                <span>{appendText + data.trim() + additionalText}</span>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No {label}</div>
                )}
            </td>
        );
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


    const traitMeleeOptions = ["Agile", "Attached", "Backstabber", "Backswing", "Brace", "Climbing", "Concealable", "Concussive", "Deadly", "Finesse", "Forceful", "Free-Hand", "Grapple", "Nonlethal", "Shove", "Sweep", "Tethered", "Trip", "Two-Hand", "Venomous"];
    const traitRangedOptions = ["Brutal", "Capacity", "Cobbled", "Concealable", "Deadly", "Double Barrel", "Kickback", "Propulsive", "Recovery"];
    const traitRangedValueOptions = ["Range", "Range Increment", "Volley"];
    const traitMeleeValueOptions = ["Reach", "Close"];

    /*
        const allWeaponNames = Object.keys(weaponsAllData);
    */


    const [showItems, setShowItems] = useState(false); // State to control checkbox for items
    const [showSpells, setShowSpells] = useState(false); // State to control checkbox for items


    const [startIndex, setStartIndex] = useState(0);
    const creaturesPerPage = 20; // Change this to 50 for the new requirement

    const handleNext = () => {
        setStartIndex(startIndex + creaturesPerPage);
    };

    const resetIndex = () => {
        setShowAddPrivateForm(false);
        setShowAddPublicForm(false);
        setNewPrivate(defaultPrivateState);
        setNewPublic(defaultPublicState);
        setEditingPrivate(null)
        setEditingPublic(null)
        setStartIndex(0);
    };
    const handlePrevious = () => {
        setStartIndex(Math.max(0, startIndex - creaturesPerPage));
    };

// Calculate the paginated creatures
    const filteredCreatures = sortedBestiaryPublic.filter(creature => npc === null || creature.npc === npc); // Filter before pagination
    const paginatedBestiaryPublic = filteredCreatures.slice(startIndex, startIndex + creaturesPerPage);
    // const paginatedBestiaryPublic = sortedBestiaryPublic.slice(startIndex, startIndex + creaturesPerPage);

    return (
        <div>
            <h1>Bestiary</h1>

            <button onClick={() => navigate('/dashboard?campaignId=' + campaignId)}>Dashboard</button>
            {/* Buttons to switch between Public, Private, and Actions tables */}
            <button onClick={() => handleTableClick('bestiaryPublic')}>Public bestiary</button>
            <button onClick={() => handleTableClick('bestiaryPrivate')}>Private bestiary</button>
            <button onClick={logout}>Logout</button>


            {showNpcMonsterSelection && (
                <div>
                    <button
                        onClick={() => {
                            setNpc(false);
                            resetIndex();
                        }}>Monster
                    </button>
                    <button
                        onClick={() => {
                            setNpc(true);
                            resetIndex();
                        }}>NPC
                    </button>
                    <button
                        onClick={() => {
                            resetIndex();
                            setNpc(null);
                        }}>All
                    </button>
                </div>
            )}

            {error && <p style={{color: 'red'}}>{error}</p>}
            {/* Tables for Public, Private, and Actions, similar to ItemsPage.  Use your filtering and sorting functions */}
            {activeTable === 'bestiaryPublic' && (
                <>
                    <h2>Search bestiary</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>Public bestiary</h2>
                    <div>
                        {startIndex}---{startIndex + 20}<br/>
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
                            {paginatedBestiaryPublic.some(creature => creature.skill) ? (<th>Skills</th>) : null}
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                    Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Languages</th>
                            {paginatedBestiaryPublic.some(creature => creature.melee) ? (<th>Melee</th>) : null}
                            {paginatedBestiaryPublic.some(creature => creature.ranged) ? (<th>Ranged</th>) : null}
                            {paginatedBestiaryPublic.some(creature => creature.abilityDescription) ? (
                                <th>Abilities</th>) : null}
                            {paginatedBestiaryPublic.some(creature => creature.weaponsName) ||
                            paginatedBestiaryPublic.some(creature => creature.armorName) ||
                            paginatedBestiaryPublic.some(creature => creature.equipmentName) ? (<th>Items</th>) : null}
                            {paginatedBestiaryPublic.some(creature => creature.spells) ||
                            (paginatedBestiaryPublic.some(creature => creature.arcane) ||
                            paginatedBestiaryPublic.some(creature => creature.primal) ||
                            paginatedBestiaryPublic.some(creature => creature.divine) ||
                            paginatedBestiaryPublic.some(creature => creature.occult) ||
                            paginatedBestiaryPublic.some(creature => creature.elemental)) ? (<th>Spells</th>) : null}
                            <th>Traits</th>
                            <th>Summary</th>
                            <th>Source</th>
                            {paginatedBestiaryPublic.some(creature => creature.isPrivate || isAdmin) ? (<th>Modify</th>) : null}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedBestiaryPublic.length > 0 ? (
                            paginatedBestiaryPublic.map(creature => (
                                <tr key={creature.compositeKey}>
                                    <td>{creature.name}</td>
                                    <td>{`+${creature.perception}${creature.vision !== null ? '; ' + creature.vision : ''}`}</td>
                                    <td>{[
                                        "AC " + creature.ac,
                                        "Fort +" + creature.fortitudeSave,
                                        "Ref +" + creature.reflexSave,
                                        "Will +" + creature.willSave]
                                        .filter(Boolean)
                                        .map((item, index) => (
                                            <React.Fragment key={index}>
                                                {item}
                                                {index === 0 && <><br/><br/></>}
                                                {index === 1 && <><br/><br/></>}
                                                {index === 2 && <><br/><br/></>}
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
                                    />
                                    {paginatedBestiaryPublic.some(creature => creature.skill) ? (
                                        <td>{creature.skill}</td>) : null}
                                    <td>{creature.level}</td>
                                    <td className="whatever-cell">{creature.language}</td>
                                    {paginatedBestiaryPublic.some(creature => creature.melee) ? (
                                        <ContentSeparatorMelee
                                            header={creature}
                                            column={"melee"}
                                            label={"melee attacks"}
                                            tooltip={true}
                                            firstData={weaponsAllMultipleData}
                                            secondData={traitsData}
                                            object={"weapon"}
                                            secondObject={"trait"}
                                        />) : null}
                                    {paginatedBestiaryPublic.some(creature => creature.ranged) ? (
                                        <ContentSeparatorMelee
                                            header={creature}
                                            column={"ranged"}
                                            label={"ranged attacks"}
                                            tooltip={true}
                                            firstData={weaponsAllMultipleData}
                                            secondData={traitsData}
                                            object={"weapon"}
                                            secondObject={"trait"}
                                        />) : null}
                                    {paginatedBestiaryPublic.some(creature => creature.abilityDescription) ? (
                                        <td><ContentSeparator
                                            header={creature}
                                            column={"abilityDescription"}
                                            label={"abilities"}
                                            separator={".;"}
                                        /></td>) : null}
                                    {paginatedBestiaryPublic.some(creature => creature.weaponsName) ||
                                    paginatedBestiaryPublic.some(creature => creature.armorName) ||
                                    paginatedBestiaryPublic.some(creature => creature.equipmentName) ? (
                                        <td>
                                            <br/><TooltipHighlighterWeapons
                                            text={creature.weaponsName}
                                            traitsData={traitsData}
                                            textStyles={{color: 'red'}}
                                            tooltipStyles={{
                                                color: 'purple',
                                                backgroundColor: `red`
                                            }}
                                            object={"trait"}
                                        /><br/>
                                            <br/>
                                            <TooltipHighlighterWeapons
                                                text={creature.armorName}
                                                traitsData={armorAllData}
                                                object={"armor"}
                                            />
                                            <br/>
                                            <TooltipHighlighterWeapons
                                                text={creature.equipmentName}
                                                traitsData={equipmentAllData}
                                                textStyles={{color: 'purple'}}
                                                tooltipStyles={{color: 'purple'}}
                                                object={"equipment"}
                                            />
                                            <br/>
                                        </td>
                                    ) : null}
                                    {(paginatedBestiaryPublic.some(creature => creature.spells) ||
                                        paginatedBestiaryPublic.some(creature => creature.arcane) ||
                                        paginatedBestiaryPublic.some(creature => creature.primal) ||
                                        paginatedBestiaryPublic.some(creature => creature.divine) ||
                                        paginatedBestiaryPublic.some(creature => creature.occult) ||
                                        paginatedBestiaryPublic.some(creature => creature.elemental)) ? (
                                        <td>
                                            {paginatedBestiaryPublic.some(creature => creature.spells) ? (
                                                <ContentSeparator
                                                    className={"spell-content-bubble"}
                                                    header={creature}
                                                    column={"spells"}
                                                    separator={" - "}
                                                    passData={spellsData}
                                                    tooltip={true}
                                                    textStyles={{color: "orange"}}
                                                />
                                            ) : (
                                                <>
                                                    { creature.arcane.trim() ? (
                                                        <>
                                                            Arcane spells:
                                                            <TooltipHighlighterWeapons
                                                                text={creature.arcane}
                                                                traitsData={spellsData}
                                                                textStyles={{ color: 'green' }}
                                                                tooltipStyles={{ color: 'purple' }}
                                                                object={"trait"}
                                                            /><br />
                                                        </>
                                                    ): null}
                                                    {creature.primal.trim() ? (
                                                        <>
                                                            Primal spells:
                                                            <TooltipHighlighterWeapons
                                                                text={creature.primal}
                                                                traitsData={spellsData}
                                                                textStyles={{ color: 'green' }}
                                                                tooltipStyles={{ color: 'purple' }}
                                                                object={"trait"}
                                                            /><br />
                                                        </>
                                                    ): null}
                                                    {creature.divine.trim() ? (
                                                        <>
                                                            Divine spells:
                                                            <TooltipHighlighterWeapons
                                                                text={creature.divine}
                                                                traitsData={spellsData}
                                                                textStyles={{ color: 'green' }}
                                                                tooltipStyles={{ color: 'purple' }}
                                                                object={"trait"}
                                                            /><br />
                                                        </>
                                                    ): null}
                                                    {creature.elemental.trim() ? (
                                                        <>
                                                            Elemental spells:
                                                            <TooltipHighlighterWeapons
                                                                text={creature.elemental}
                                                                traitsData={spellsData}
                                                                textStyles={{ color: 'green' }}
                                                                tooltipStyles={{ color: 'purple' }}
                                                                object={"trait"}
                                                            /><br />
                                                        </>
                                                    ): null}
                                                    {creature.occult.trim()  ? (
                                                        <>
                                                            Occult spells:
                                                            <TooltipHighlighterWeapons
                                                                text={creature.occult}
                                                                traitsData={spellsData}
                                                                textStyles={{ color: 'green' }}
                                                                tooltipStyles={{ color: 'purple' }}
                                                                object={"trait"}
                                                            />
                                                        </>
                                                    ): null}
                                                </>
                                            )}
                                        </td>
                                    ) : null}
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={creature.trait}
                                            traitsData={traitsData}
                                            tooltipStyles={{color: 'red'}}
                                            object="trait"
                                        />
                                    </td>
                                    <td className="summary-cell">{creature.text}</td>
                                    <td>{creature.sourceRaw}</td>
                                    {
                                        creature.isPrivate ? (
                                            <td>
                                                <button onClick={() => setEditingPrivate(creature)}>Edit</button>
                                                <button onClick={() => handleDeletePrivate(creature.id)}>Delete</button>
                                            </td>
                                        ) : (
                                            isAdmin ? (
                                                <td>
                                                    <button onClick={() => setEditingPublic({...creature})}>Edit Public</button>
                                                    <button onClick={() => handleDeletePublic(creature.id)}>Delete Public</button>
                                                </td>
                                            ) : null
                                        )
                                    }

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No creatures found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {isAdmin && (
                        <button onClick={() => setShowAddPublicForm(true)}>
                            Create Public creature
                        </button>
                    )}
                </>
            )}

            {
                activeTable === 'bestiaryPrivate' && (
                    <>
                    <h2>Search private bestiary</h2>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm} // Assuming you have a separate search term for private bestiary
                            onChange={(e) => setSearchTerm(e.target.value)} // And a setter for it
                        />
                        <h2>Private bestiary</h2>
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
                                        <td>
                                            <ContentSeparator
                                                header={creature}
                                                column={"speedRaw"}
                                                label={"movement"}
                                                separator={","}
                                                additionalText={" feet"}
                                            />
                                        </td>
                                        <td>{creature.skill}</td>
                                        <td>{creature.level}</td>
                                        <td className="whatever-cell">{creature.language}</td>

                                        <td>
                                            <ContentSeparator
                                                header={creature}
                                                column={"melee"}
                                                label={"melee attacks"}
                                                tooltip={true}
                                            />
                                        </td>
                                        <td>
                                            <ContentSeparator
                                                header={creature}
                                                column={"ranged"}
                                                label={"ranged attacks"}
                                                tooltip={true}
                                            />
                                        </td>
                                        <td>
                                            <ContentSeparator
                                                header={creature}
                                                column={"abilityDescription"}
                                                label={"abilities"}
                                                contentStyle={{width: '200px'}}
                                            />
                                        </td>

                                        <td>
                                            <ContentSeparator
                                                header={creature}
                                                column={"weaponsName"}
                                                label={"weapon"}
                                                contentStyle={{width: '200px'}}
                                                separator={","}
                                            />
                                            Weapons:
                                            <br/><TooltipHighlighterWeapons
                                                text={creature.weaponsName}  // Assuming creature.items is an array of weapon names
                                                traitsData={weaponsAllData} // This holds your combined weapon data
                                                textStyles={{color: 'red'}}
                                                tooltipStyles={{
                                                    color: 'purple',
                                                    backgroundColor: `red`
                                                }} // Customize styling here
                                                object={"weapon"}
                                            /><br/>
                                                Armor:
                                                <br/>
                                                <TooltipHighlighterWeapons
                                                    text={creature.armorName}  // Assuming creature.items is an array of weapon names
                                                    traitsData={armorAllData} // This holds your combined weapon data
                                                    object={"armor"}
                                                />
                                                <br/>
                                                Equipment:
                                                <TooltipHighlighterWeapons
                                                    text={creature.equipmentName}  // Assuming creature.items is an array of weapon names
                                                    traitsData={equipmentAllData} // This holds your combined weapon data
                                                    textStyles={{color: 'purple'}}
                                                    tooltipStyles={{color: 'purple'}} // Customize styling here
                                                    object={"equipment"}
                                                />
                                            <br/>
                                            </td>
                                            <td>
                                                Arcane spells:
                                                <TooltipHighlighterWeapons
                                                    text={creature.arcane}  // Assuming creature.items is an array of weapon names
                                                    traitsData={spellsData} // This holds your combined weapon data
                                                    textStyles={{color: 'green'}}
                                                    tooltipStyles={{color: 'purple'}} // Customize styling here
                                                    object={"trait"}
                                                /><br/>
                                                Primal spells:
                                                <TooltipHighlighterWeapons
                                                    text={creature.primal}  // Assuming creature.items is an array of weapon names
                                                    traitsData={spellsData} // This holds your combined weapon data
                                                    textStyles={{color: 'green'}}
                                                    tooltipStyles={{color: 'purple'}} // Customize styling here
                                                    object={"trait"}
                                                /><br/>
                                                Divine spells:
                                                <TooltipHighlighterWeapons
                                                    text={creature.divine}  // Assuming creature.items is an array of weapon names
                                                    traitsData={spellsData} // This holds your combined weapon data
                                                    textStyles={{color: 'green'}}
                                                    tooltipStyles={{color: 'purple'}} // Customize styling here
                                                    object={"trait"}
                                                /><br/>
                                                Elemental spells:
                                                <TooltipHighlighterWeapons
                                                    text={creature.elemental}  // Assuming creature.items is an array of weapon names
                                                    traitsData={spellsData} // This holds your combined weapon data
                                                    textStyles={{color: 'green'}}
                                                    tooltipStyles={{color: 'purple'}} // Customize styling here
                                                    object={"trait"}
                                                /><br/>
                                                Occult spells:
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

                    Name:
                    <input type="text" name="name" value={newPrivate.name} onChange={handlePrivateInputChange} required/>
                    {formErrors.name && ( // Conditionally render error message
                        <span className="error-message">{formErrors.name}</span>
                    )}
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
                                label="weapon"
                                fieldName="weaponsName"
                                initialValue={newPrivate.weaponsName}
                                options={Object.keys(weaponsAllData)}
                                onChange={(newList) => handleDynamicListChange('weaponsName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="armor"
                                fieldName="armorName"
                                initialValue={newPrivate.armorName}
                                options={Object.keys(armorAllData)}
                                onChange={(newList) => handleDynamicListChange('armorName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="equipment"
                                fieldName="equipmentName"
                                initialValue={newPrivate.equipmentName}
                                options={Object.keys(equipmentAllData)}
                                onChange={(newList) => handleDynamicListChange('equipmentName', newList)}
                                showValueInput={false}
                            />
                        </>)}<br/>
                    spells?
                    <input
                        type="checkbox"
                        name="spell"
                        checked={showSpells}
                        onChange={(e) => setShowSpells(e.target.checked)} // Inline update the items state
                    />
                    {showSpells && (
                        <>
                            <DynamicSpellList label={"arcane spells"} fieldName="Arcane" options={arcaneData}
                                              initialValue={newPrivate.arcane}
                                              onChange={(newList) => handleDynamicListChange("arcane", newList)}/>
                            <DynamicSpellList label={"primal spells"} fieldName="Primal" options={primalData}
                                              initialValue={newPrivate.primal}
                                              onChange={(newList) => handleDynamicListChange("primal", newList)}/>
                            <DynamicSpellList label={"divine spells"} fieldName="Divine" options={divineData}
                                              initialValue={newPrivate.divine}
                                              onChange={(newList) => handleDynamicListChange("divine", newList)}/>
                            <DynamicSpellList label={"occult spells"} fieldName="Occult" options={occultData}
                                              initialValue={newPrivate.occult}
                                              onChange={(newList) => handleDynamicListChange("occult", newList)}/>
                            <DynamicSpellList label={"elemental spells"} fieldName="Elemental" options={elementalData}
                                              initialValue={newPrivate.elemental}
                                              onChange={(newList) => handleDynamicListChange("elemental", newList)}/>

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
                            onClick={() => {
                                setShowAddPrivateForm(false)
                                setNewPrivate(defaultPrivateState)
                                setShowItems(false)
                                setShowSpells(false)
                            }}>Cancel
                    </button>
                </form>
            )}








            {editingPrivate && (
                <form onSubmit={handleUpdatePrivate}>
                    <input type="hidden" name="id" value={editingPrivate.id}/>
                    Name:
                    <input type="text" name="name" value={editingPrivate.name} onChange={handleEditPrivateChange} required/>
                    {formErrors.name && ( // Conditionally render error message
                        <span className="error-message">{formErrors.name}</span>
                    )}
                    Perception:
                    <input className="wh-cell" type="number" name="perception" value={editingPrivate.perception}
                           onChange={handleEditPrivateChange}/>
                    <VisionDropdown
                        value={editingPrivate.vision || ''}
                        onChange={handleEditPrivateChange}
                    />
                    Defenses:
                    AC:
                    <input className="wh-cell" type="number" name="ac" value={editingPrivate.ac}
                           onChange={handleEditPrivateChange}/>
                    Fortitude:<input className="wh-cell" type="number" name="fortitudeSave"
                                     value={editingPrivate.fortitudeSave}
                                     onChange={handleEditPrivateChange}/>
                    Reflex:<input className="wh-cell" type="number" name="reflexSave" value={editingPrivate.reflexSave}
                                  onChange={handleEditPrivateChange}/>
                    Will:<input className="wh-cell" type="number" name="willSave" value={editingPrivate.willSave}
                                onChange={handleEditPrivateChange}/>
                    <br/>
                    HP:
                    <input className="wh-cell" type="number" name="hp" value={editingPrivate.hp}
                           onChange={handleEditPrivateChange}/>
                    <DynamicList
                        label="resistances"
                        fieldName="resistance"
                        initialValue={editingPrivate.resistance || []} // Ensure it's an array
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListEditChange('resistance', newList)}
                        customDropdown={false}
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
                           onChange={handleEditPrivateChange} placeholder={"Str"}/>
                    <input className="wh-cell" type="number" name="dexterity" value={editingPrivate.dexterity}
                           onChange={handleEditPrivateChange} placeholder={"Dex"}/>
                    <input className="wh-cell" type="number" name="constitution" value={editingPrivate.constitution}
                           onChange={handleEditPrivateChange} placeholder={"Con"}/>
                    <input className="wh-cell" type="number" name="intelligence" value={editingPrivate.intelligence}
                           onChange={handleEditPrivateChange} placeholder={"Int"}/>
                    <input className="wh-cell" type="number" name="wisdom" value={editingPrivate.wisdom}
                           onChange={handleEditPrivateChange} placeholder={"Wis"}/>
                    <input className="wh-cell" type="number" name="charisma" value={editingPrivate.charisma}
                           onChange={handleEditPrivateChange} placeholder={"Char"}/>
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
                    spells?
                    <input
                        type="checkbox"
                        name="spell"
                        checked={showSpells}
                        onChange={(e) => setShowSpells(e.target.checked)} // Inline update the items state
                    />
                    {showSpells && (
                        <>

                            <DynamicSpellList label={"Arcane Spells"} fieldName="Arcane" options={arcaneData}
                                              initialValue={editingPrivate.arcane}
                                              onChange={(newList) => handleDynamicListEditChange("arcane", newList)}/>
                            <DynamicSpellList label={"Primal Spells"} fieldName="Primal" options={primalData}
                                              initialValue={editingPrivate.primal}
                                              onChange={(newList) => handleDynamicListEditChange("primal", newList)}/>
                            <DynamicSpellList label={"Divine Spells"} fieldName="Divine" options={divineData}
                                              initialValue={editingPrivate.divine}
                                              onChange={(newList) => handleDynamicListEditChange("divine", newList)}/>
                            <DynamicSpellList label={"Occult Spells"} fieldName="Occult" options={occultData}
                                              initialValue={editingPrivate.occult}
                                              onChange={(newList) => handleDynamicListEditChange("occult", newList)}/>
                            <DynamicSpellList label={"Elemental Spells"} fieldName="Elemental" options={elementalData}
                                              initialValue={editingPrivate.elemental}
                                              onChange={(newList) => handleDynamicListEditChange("elemental", newList)}/>
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
                    <button type="button" onClick={() => {
                        setEditingPrivate(null)
                        setShowItems(false)
                        setShowSpells(false)
                        setFormErrors({})
                    }}>Cancel
                    </button>
                </form>
            )}


            {isAdmin && ShowAddPublicForm && (

                <form onSubmit={handleAddPublic}>

                    Name:
                    <input type="text" name="name" value={newPublic.name} onChange={handlePublicInputChange} required/>
                    {formErrors.name && ( // Conditionally render error message
                        <span className="error-message">{formErrors.name}</span>
                    )}
                    Perception:
                    <input className="wh-cell" type="number" name="perception" value={newPublic.perception}
                           onChange={handlePublicInputChange}/>
                    <VisionDropdown
                        value={newPublic.vision || ''}
                        onChange={handlePublicInputChange}
                    />
                    Defenses:
                    AC:
                    <input className="wh-cell" type="number" name="ac" value={newPublic.ac}
                           onChange={handlePublicInputChange} min={"0"}/>
                    Fortitude:<input className="wh-cell" type="number" name="fortitudeSave"
                                     value={newPublic.fortitudeSave}
                                     onChange={handlePublicInputChange}/>
                    Reflex:<input className="wh-cell" type="number" name="reflexSave" value={newPublic.reflexSave}
                                  onChange={handlePublicInputChange}/>
                    Will:<input className="wh-cell" type="number" name="willSave" value={newPublic.willSave}
                                onChange={handlePublicInputChange}/>
                    <br/>
                    HP:
                    <input className="wh-cell" type="number" name="hp" value={newPublic.hp}
                           onChange={handlePublicInputChange} min={"1"}/>
                    <DynamicList
                        label="resistances"
                        fieldName="resistance"
                        initialValue={newPublic.resistance || []} // Ensure it's an array
                        options={damageOptions}
                        onChange={(newList) => handleDynamicPublicListChange('resistance', newList)}
                    />
                    <DynamicList
                        label="weaknesses"
                        fieldName="weakness"
                        initialValue={newPublic.weakness}
                        options={damageOptions}
                        onChange={(newList) => handleDynamicPublicListChange('weakness', newList)}
                    />
                    <DynamicList
                        label="immunities"
                        fieldName="immunity"
                        initialValue={newPublic.immunity}
                        options={immunityOptions}
                        onChange={(newList) => handleDynamicPublicListChange('immunity', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Characteristics:
                    <input className="wh-cell" type="number" name="strength" value={newPublic.strength}
                           onChange={handlePublicInputChange} placeholder={"Str"}/>
                    <input className="wh-cell" type="number" name="dexterity" value={newPublic.dexterity}
                           onChange={handlePublicInputChange} placeholder={"Dex"}/>
                    <input className="wh-cell" type="number" name="constitution" value={newPublic.constitution}
                           onChange={handlePublicInputChange} placeholder={"Con"}/>
                    <input className="wh-cell" type="number" name="intelligence" value={newPublic.intelligence}
                           onChange={handlePublicInputChange} placeholder={"Int"}/>
                    <input className="wh-cell" type="number" name="wisdom" value={newPublic.wisdom}
                           onChange={handlePublicInputChange} placeholder={"Wis"}/>
                    <input className="wh-cell" type="number" name="charisma" value={newPublic.charisma}
                           onChange={handlePublicInputChange} placeholder={"Char"}/>
                    <label></label>
                    <DynamicList
                        label="skills"
                        fieldName="skills"
                        initialValue={newPublic.skill}
                        options={skillOptions}
                        onChange={(newList) => handleDynamicPublicListChange('skill', newList)}
                    />
                    <DynamicList
                        label="movement"
                        fieldName="speed"
                        initialValue={newPublic.speedRaw}
                        options={speedOptions}
                        onChange={(newList) => handleDynamicPublicListChange('speedRaw', newList)}
                    />
                    <DynamicList
                        label="languages"
                        fieldName="language"
                        initialValue={newPublic.language}
                        options={languageOptions}
                        onChange={(newList) => handleDynamicPublicListChange('language', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Level:
                    <input style={{marginRight: "5px", width: "50px"}} type="number" name="level"
                           value={newPublic.level}
                           onChange={handlePublicInputChange}/>
                    <DynamicListAbilities
                        label="ability"
                        initialValue={newPublic.abilityDescription}
                        onChange={(newList) => handleDynamicPublicListChange('abilityDescription', newList)}
                    />
                    <br/>
                    NPC?:
                    <input
                        type="checkbox"
                        name="npc"
                        checked={newPublic.npc}
                        onChange={(e) => setNewPublic({...newPublic, npc: e.target.checked})}
                    />
                    {newPublic.npc ? (
                        <MultiDropdown
                            label="ancestry"
                            fieldName="ancestry"
                            initialValue={newPublic.trait.find(t => t.type === 'ancestry')?.values || []}
                            options={ancestryOptions}
                            onChange={handlePublicTraitChange}
                        />
                    ) : (
                        <>
                            <MultiDropdown
                                label="creature type"
                                fieldName="creatureType"
                                initialValue={newPublic.trait.find(t => t.type === 'creatureType')?.values || []}
                                options={creatureTypeOptions}
                                onChange={handlePublicTraitChange}
                            />
                            <MultiDropdown
                                label="monster"
                                fieldName="monster"
                                initialValue={newPublic.trait.find(t => t.type === 'monster')?.values || []}
                                options={monsterOptions}
                                onChange={handlePublicTraitChange}
                            />
                        </>)}
                    <MultiDropdown label="planar" fieldName="planar"
                                   initialValue={newPublic.trait.find(t => t.type === 'planar')?.values || []}
                                   options={planarOptions} onChange={handlePublicTraitChange}/>
                    <MultiDropdown label="alignment" fieldName="alignment"
                                   initialValue={newPublic.trait.find(t => t.type === 'alignment')?.values || []}
                                   options={alignmentOptions} onChange={handlePublicTraitChange}/>
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
                                label="weapon"
                                fieldName="weaponsName"
                                initialValue={newPublic.weaponsName}
                                options={Object.keys(weaponsAllData)}
                                onChange={(newList) => handleDynamicPublicListChange('weaponsName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="armor"
                                fieldName="armorName"
                                initialValue={newPublic.armorName}
                                options={Object.keys(armorAllData)}
                                onChange={(newList) => handleDynamicPublicListChange('armorName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="equipment"
                                fieldName="equipmentName"
                                initialValue={newPublic.equipmentName}
                                options={Object.keys(equipmentAllData)}
                                onChange={(newList) => handleDynamicPublicListChange('equipmentName', newList)}
                                showValueInput={false}
                            />
                        </>)}<br/>
                    spells?
                    <input
                        type="checkbox"
                        name="spell"
                        checked={showSpells}
                        onChange={(e) => setShowSpells(e.target.checked)} // Inline update the items state
                    />
                    {showSpells && (
                        <>
                            <DynamicSpellList label={"arcane spells"} fieldName="Arcane" options={arcaneData}
                                              initialValue={newPublic.arcane}
                                              onChange={(newList) => handleDynamicPublicListChange("arcane", newList)}/>
                            <DynamicSpellList label={"primal spells"} fieldName="Primal" options={primalData}
                                              initialValue={newPublic.primal}
                                              onChange={(newList) => handleDynamicPublicListChange("primal", newList)}/>
                            <DynamicSpellList label={"divine spells"} fieldName="Divine" options={divineData}
                                              initialValue={newPublic.divine}
                                              onChange={(newList) => handleDynamicPublicListChange("divine", newList)}/>
                            <DynamicSpellList label={"occult spells"} fieldName="Occult" options={occultData}
                                              initialValue={newPublic.occult}
                                              onChange={(newList) => handleDynamicPublicListChange("occult", newList)}/>
                            <DynamicSpellList label={"elemental spells"} fieldName="Elemental" options={elementalData}
                                              initialValue={newPublic.elemental}
                                              onChange={(newList) => handleDynamicPublicListChange("elemental", newList)}/>

                        </>)}


                    <br/>
                    <div className="multi-dropdown-container">
                        Summary:
                        <div className="multi-dropdown-item"><textarea name="text" value={newPublic.text}
                                                                       onChange={handlePublicInputChange}
                                                                       placeholder={"Summary"}

                        /></div></div>
                    Source:<input type="text" name="sourceRaw" value={newPublic.sourceRaw}
                                  onChange={handlePublicInputChange} placeholder={"Source"}/>


                    <br/>
                    <DynamicListAttacks
                        label="melee attack"
                        actionOptions={actionOptions}
                        damageTypeOptions={damageOptions}
                        traitOptions={traitMeleeOptions}
                        rangedTraitOptions={traitMeleeValueOptions}
                        initialValue={newPublic.melee}
                        onChange={(newList) => handleDynamicPublicListChange('melee', newList)}
                    />
                    <DynamicListAttacks
                        label="ranged attack"
                        actionOptions={actionOptions}
                        damageTypeOptions={damageOptions}
                        traitOptions={traitRangedOptions}
                        rangedTraitOptions={traitRangedValueOptions}
                        initialValue={newPublic.ranged}
                        onChange={(newList) => handleDynamicPublicListChange('ranged', newList)}
                    />
                    {/* Add input fields for ALL other BestiaryPrivate fields */}
                    <button type="submit">Add</button>
                    <button type="button"
                            onClick={() => {
                                setShowAddPublicForm(false)
                                setNewPublic(defaultPublicState)
                                setShowItems(false)
                                setShowSpells(false)
                            }}>Cancel
                    </button>
                </form>
            )}


            {isAdmin && editingPublic && (
                <form onSubmit={handleUpdatePublic}>
                    <input type="hidden" name="id" value={editingPublic.id}/>
                    Name:
                    <input type="text" name="name" value={editingPublic.name} onChange={handleEditPublicChange} required/>
                    {formErrors.name && ( // Conditionally render error message
                        <span className="error-message">{formErrors.name}</span>
                    )}
                    Perception:
                    <input className="wh-cell" type="number" name="perception" value={editingPublic.perception}
                           onChange={handleEditPublicChange}/>
                    <VisionDropdown
                        value={editingPublic.vision || ''}
                        onChange={handleEditPublicChange}
                    />
                    Defenses:
                    AC:
                    <input className="wh-cell" type="number" name="ac" value={editingPublic.ac}
                           onChange={handleEditPublicChange}/>
                    Fortitude:<input className="wh-cell" type="number" name="fortitudeSave"
                                     value={editingPublic.fortitudeSave}
                                     onChange={handleEditPublicChange}/>
                    Reflex:<input className="wh-cell" type="number" name="reflexSave" value={editingPublic.reflexSave}
                                  onChange={handleEditPublicChange}/>
                    Will:<input className="wh-cell" type="number" name="willSave" value={editingPublic.willSave}
                                onChange={handleEditPublicChange}/>
                    <br/>
                    HP:
                    <input className="wh-cell" type="number" name="hp" value={editingPublic.hp}
                           onChange={handleEditPublicChange}/>
                    <DynamicList
                        label="resistances"
                        fieldName="resistance"
                        initialValue={editingPublic.resistance || []} // Ensure it's an array
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('resistance', newList)}
                    />
                    <DynamicList
                        label="weaknesses"
                        fieldName="weakness"
                        initialValue={editingPublic.weakness}
                        options={damageOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('weakness', newList)}
                    />
                    <DynamicList
                        label="immunities"
                        fieldName="immunity"
                        initialValue={editingPublic.immunity}
                        options={immunityOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('immunity', newList)}
                        showValueInput={false}
                    />
                    <br/>
                    Characteristics:
                    <input className="wh-cell" type="number" name="strength" value={editingPublic.strength}
                           onChange={handleEditPublicChange} placeholder={"Str"}/>
                    <input className="wh-cell" type="number" name="dexterity" value={editingPublic.dexterity}
                           onChange={handleEditPublicChange} placeholder={"Dex"}/>
                    <input className="wh-cell" type="number" name="constitution" value={editingPublic.constitution}
                           onChange={handleEditPublicChange} placeholder={"Con"}/>
                    <input className="wh-cell" type="number" name="intelligence" value={editingPublic.intelligence}
                           onChange={handleEditPublicChange} placeholder={"Int"}/>
                    <input className="wh-cell" type="number" name="wisdom" value={editingPublic.wisdom}
                           onChange={handleEditPublicChange} placeholder={"Wis"}/>
                    <input className="wh-cell" type="number" name="charisma" value={editingPublic.charisma}
                           onChange={handleEditPublicChange} placeholder={"Char"}/>
                    <label></label>
                    <DynamicList
                        label="skills"
                        fieldName="skills"
                        initialValue={editingPublic.skill}
                        options={skillOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('skill', newList)}
                    />
                    <DynamicList
                        label="speed"
                        fieldName="speed"
                        initialValue={editingPublic.speedRaw}
                        options={speedOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('speedRaw', newList)}
                    />
                    <DynamicList
                        label="languages"
                        fieldName="language"
                        initialValue={editingPublic.language}
                        options={languageOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('language', newList)}
                        showValueInput={false}
                    />
                    NPC?:<input
                    type="checkbox"
                    name="npc"
                    checked={editingPublic.npc} // Use checked for controlled components
                    onChange={(e) => setEditingPublic({...editingPublic, npc: e.target.checked})}/>
                    <DynamicList
                        label="traits"
                        fieldName="trait"
                        initialValue={editingPublic.trait}
                        options={bigOptions}
                        onChange={(newList) => handleDynamicListEditPublicChange('trait', newList)}
                        showValueInput={false}
                    />
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
                                label="weapon"
                                fieldName="weaponsName"
                                initialValue={editingPublic.weaponsName}
                                options={Object.keys(weaponsAllData)}
                                onChange={(newList) => handleDynamicListEditPublicChange('weaponsName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="armor"
                                fieldName="armorName"
                                initialValue={editingPublic.armorName}
                                options={Object.keys(armorAllData)}
                                onChange={(newList) => handleDynamicListEditPublicChange('armorName', newList)}
                                showValueInput={false}
                            />
                            <DynamicList
                                label="equipment"
                                fieldName="equipmentName"
                                initialValue={editingPublic.equipmentName}
                                options={Object.keys(equipmentAllData)}
                                onChange={(newList) => handleDynamicListEditPublicChange('equipmentName', newList)}
                                showValueInput={false}
                            />
                        </>)}
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

                            <DynamicSpellList label={"Arcane Spells"} fieldName="Arcane" options={arcaneData}
                                              initialValue={editingPublic.arcane}
                                              onChange={(newList) => handleDynamicListEditPublicChange("arcane", newList)}/>
                            <DynamicSpellList label={"Primal Spells"} fieldName="Primal" options={primalData}
                                              initialValue={editingPublic.primal}
                                              onChange={(newList) => handleDynamicListEditPublicChange("primal", newList)}/>
                            <DynamicSpellList label={"Divine Spells"} fieldName="Divine" options={divineData}
                                              initialValue={editingPublic.divine}
                                              onChange={(newList) => handleDynamicListEditPublicChange("divine", newList)}/>
                            <DynamicSpellList label={"Occult Spells"} fieldName="Occult" options={occultData}
                                              initialValue={editingPublic.occult}
                                              onChange={(newList) => handleDynamicListEditPublicChange("occult", newList)}/>
                            <DynamicSpellList label={"Elemental Spells"} fieldName="Elemental" options={elementalData}
                                              initialValue={editingPublic.elemental}
                                              onChange={(newList) => handleDynamicListEditPublicChange("elemental", newList)}/>
                        </>)}
                    <br/>
                    Level:
                    <input type="number" name="level" value={editingPublic.level}
                           onChange={handleEditPublicChange}/>

                    <DynamicListAbilities
                        label="creature ability"
                        initialValue={editingPublic.abilityDescription}
                        onChange={(newList) => handleDynamicListEditPublicChange('abilityDescription', newList)}
                    />
                    <br/>
                    <DynamicListAbilities
                        label="melee attack"
                        initialValue={editingPublic.melee}
                        onChange={(newList) => handleDynamicListEditPublicChange('melee', newList)}
                        separator={";"}
                    />
                    <DynamicListAbilities
                        label="ranged attack"
                        initialValue={editingPublic.ranged}
                        onChange={(newList) => handleDynamicListEditPublicChange('ranged', newList)}
                        separator={";"}
                    /><br/>

                    <div className="multi-dropdown-container">
                        Summary:
                        <div className="multi-dropdown-item">
                            <textarea name="text" value={editingPublic.text}
                                      onChange={handleEditPublicChange} placeholder={"Summary"}
                            /></div></div>

                    Source:<input type="text" name="sourceRaw" value={editingPublic.sourceRaw}
                                  onChange={handleEditPublicChange} placeholder={"Source"}/>


                    {/* Add input fields for ALL other BestiaryPublic fields, pre-filled with editingPublic values */}
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => {
                        setEditingPublic(null)
                        setShowItems(false)
                        setShowSpells(false)
                        setFormErrors({})
                    }}>Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default BestiaryPage;