import React, { useState, useEffect, useContext } from 'react';
import { makeRequest } from '../apiService';
import AuthContext from '../AuthContext';
import {useNavigate, useSearchParams} from 'react-router-dom';
import './Table.css';
import DynamicList from "./DynamicLisBackup";
import {TooltipHighlighterWeapons} from "./TooltipHighlighterWeapons";
import {TooltipHighlighterMutliple} from "./TooltipHighlighterMultiple"; // Import the new component

function ItemsPage() {
    const { user, logout } = useContext(AuthContext);
    const [weaponsPublic, setWeaponsPublic] = useState([]);
    const [Spells, setSpells] = useState([]);
    const [equipmentPublic, setEquipmentPublic] = useState([]);
    const [armorsPublic, setArmorsPublic] = useState([]);

    const [weaponsPrivate, setWeaponsPrivate] = useState([]);
    const [armorsPrivate, setArmorsPrivate] = useState([]);
    const [equipmentPrivate, setEquipmentPrivate] = useState([]); // State for private equipment

    const [error, setError] = useState(null);
    const [editingWeapon, setEditingWeapon] = useState(null);
    const [editingArmor, setEditingArmor] = useState(null);
    const [editingEquipment, setEditingEquipment] = useState(null); // State for editing equipment
    const [editingSpell, setEditingSpell] = useState(null); // State for editing equipment

    const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN');

    const [traitsData, setTraitsData] = useState({}); // New state for trait data

    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    const defaultWeaponState = {
        name: '',
        damage: '',
        damageDie: '',
        hands: '',
        level: '',
        price: 0,
        pp: 0,
        gp: 0,
        sp: 0,
        cp: 0,
        rarity: '',
        sourceRaw: '',
        text: '',
        trait: [],
        weaponCategory: '',
        weaponGroup: '',
        weaponType: '',
        access: '',
        bulk: '',
    };

    const defaultArmorState = {
        name: '',
        armorCategory: '',
        armorGroup: '',
        bulk: '',
        checkPenalty: '',
        dexCap: '',
        sourceRaw: '',
        ac: '',
        strength: '',
        text: '',
        access: '',
        speedPenalty: '',
        level: '',
        price: 0,
        pp: 0,
        gp: 0,
        sp: 0,
        cp: 0,
        rarity: '',
        trait: []
    };

    const defaultEquipmentState = {
        name: '',
        actions: '',
        bulk: '',
        school: '',
        sourceRaw: '',
        text: '',
        hands: '',
        skill: '',
        itemCategory: '',
        itemSubcategory: '',
        level: '',
        price: 0,
        pp: 0,
        gp: 0,
        sp: 0,
        cp: 0,
        rarity: '',
        trait: []
    };
    const defaultSpellState = {
        name: '',
        actions: '',
        bloodline: [],
        category: '',
        component: [],
        heighten: [],
        spellRange: '',
        rangeRaw: '',
        rarity: '',
        savingThrow: [],
        school: '',
        sourceRaw: '',
        summary: '',
        target: '',
        text: '',
        trait: [],
        tradition: [],
        type: ''
    };

    const [newWeapon, setNewWeapon] = useState(defaultWeaponState);
    const [newArmor, setNewArmor] = useState(defaultArmorState);
    const [newEquipment, setNewEquipment] = useState(defaultEquipmentState); // State for new equipment
    const [newSpell, setNewSpell] = useState(defaultSpellState); // State for new equipment

    const [editingPublicWeapon, setEditingPublicWeapon] = useState(null);
    const [editingPublicArmor, setEditingPublicArmor] = useState(null);
    const [editingPublicEquipment, setEditingPublicEquipment] = useState(null); // State for editing equipment

    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaignId');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState(0); // 0=default 1=ascending 2=descending
    const [sortCriteria, setSortCriteria] = useState('');
    const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'unique': 4 };
    const [filterTradition, setFilterTradition] = useState(''); // Initialize filterTradition state
    const [filteredSpells, setFilteredSpells] = useState([]); // Initialize filteredSpells state

    const [filterCategory, setFilterCategory] = useState(''); // Initialize filterTradition state
    const [FilterEquipmentPublic, setFilteredEquipmentPublic] = useState([]); // Initialize filteredSpells state

    const [filterSubcategory, setFilterSubcategory] = useState(''); // Initialize filterTradition state
    const [subcategoryButtons, setSubcategoryButtons] = useState([]); // To hold subcategories to display

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');


    const categories = [
        'Adventuring Gear',
        'Services',
        'Alchemical Items',
        'Armor',
        'Consumables',
        'Runes',
        'Held Items',
        'Shields',
        'Snares',
        'Staves',
        'Wands',
        'Structures',
        'Weapons',
        'Worn Items',
        'Artifacts',
        'Relics',
        'Contracts',
        'Adjustments',
        'Grimoires',
        'Spellhearts',
        'Tattoos',
        'Blighted Boons',
        'Cursed Items',
        'Intelligent Items',
        'Materials',
        'Assistive Items',
        'Animals and Gear',
        'Customizations',
        'High-Tech',
        'Trade Goods',
        'Other'
    ];
    const categoriesWithSubcategories = {
        'Alchemical Items': ['Alchemical Ammunition', 'Alchemical Bombs', 'Alchemical Elixirs', 'Alchemical Food', 'Alchemical Other', 'Alchemical Plants', 'Alchemical Poisons', 'Alchemical Tools', 'Drugs', 'Bottled Monstrosities'],
        'Armor': ['Basic Magic Armor', 'Precious Material Armor' , 'Specific Magic Armor'],
        'Animals and Gear': ['Animal Caretaking Gear', 'Animals'],
        'Artifacts':['Other', 'The Deck of Destiny'],
        'Assistive Items': [
            'Animal Companion Mobility Aids',
            'Canes & Crutches',
            'Hearing Aids',
            'Joint Supports and Splints',
            'Mobility Devices',
            'Tails',
            'Vision Assistance',
            'Prostheses',
            'Other'
        ],
        'Consumables': [
            'Fulu',
            'Gadgets',
            'Magical Ammunition',
            'Missive',
            'Oils',
            'Potions',
            'Scrolls',
            'Talismans',
            'Spell Catalysts',
            'Other Consumables'
        ],
        'Contracts': [
            'Bargained Contracts',
            'Infernal Contracts',
            'Thrune Contracts',
            'Other Contracts'
        ],
        'Customizations': [
            'Firing Mechanisms',
            'Holsters',
            'Scopes',
            'Stabilizers',
            'Other'
        ],
        'Runes': [
            'Accessory Runes',
            'Armor Property Runes',
            'Fundamental Armor Runes',
            'Fundamental Weapon Runes',
            'Weapon Property Runes',
        ],
        'Services': [
            'Fixer',
            'Hirelings',
            'Researcher',
            'Secret Society Membership Services',
            'Spellcasting',
            'Transportation',
            'Other'
        ],
        'Shields': [
            'Precious Material Shields',
            'Specific Shields',
            'Other'
        ],
        'Wands': [
            'Magic Wands',
            'Specialty Wands',
        ],
        'Weapons': [
            'Basic Magic Weapons',
            'Specific Magic Weapons',
            'Beast Guns',
            'Precious Material Weapons',
        ],
        'Worn Items': [
            'Companion Items',
            'Eidolon Items',
            'Other Worn Items'
        ]
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSubcategoryButtons(categoriesWithSubcategories[category] || []);
        setSelectedSubcategory(''); // Reset the selected subcategory
    };

    const [showAddWeaponForm, setShowAddWeaponForm] = useState(false);
    const [showAddArmorForm, setShowAddArmorForm] = useState(false);
    const [showAddEquipmentForm, setShowAddEquipmentForm] = useState(false); // State for adding equipment
    const [showAddSpellForm, setShowAddSpellForm] = useState(false); // State for adding equipment

    const [showAddPublicWeaponForm, setShowAddPublicWeaponForm] = useState(false);
    const [showAddPublicArmorForm, setShowAddPublicArmorForm] = useState(false);
    const [showAddPublicEquipmentForm, setShowAddPublicEquipmentForm] = useState(false); // State for adding equipment

    const [activeTable, setActiveTable] = useState('');

    const [weaponData, setWeaponData] = useState('');
    const [weaponMultipleData, setWeaponMultipleData] = useState('');
    const [armorData, setArmorData] = useState('');
    const [armorMultipleData, setArmorMultipleData] = useState('');
    const [equipmentData, setEquipmentData] = useState('');
    const [equipmentMultipleData, setEquipmentMultipleData] = useState('');


    const resetCategoryInputs = () => {
        setSelectedCategory('');
        setSelectedSubcategory('');

    };

    useEffect(() => {
        const fetchTraits = async () => {
            try {
                const traits = await makeRequest('/api/admin/getTraits', 'GET',null, user.token); // Fetch trait data
                const traitsMap = {};
                traits.forEach(trait => traitsMap[trait.name] = `${trait.summary} ${trait.sourceRaw}`);
                setTraitsData(traitsMap);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchPublicWeapons = async () => {
            try {
                const data = await makeRequest('/api/admin/getWeapons', 'GET', null, user.token);
                setWeaponsPublic(data);

                const weaponPublicMap = {};
                const weaponPublicMultipleMap = {};
                data.forEach(weapon => {
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
                setWeaponMultipleData(weaponPublicMultipleMap);
                setWeaponData(weaponPublicMap);

            } catch (error) {
                setError(error.message);
            }
        };

        const fetchPublicArmors = async () => {
            try {
                const data = await makeRequest('/api/admin/getArmor', 'GET', null, user.token);

                const armorPublicMap = {};
                const armorPublicMultipleMap = {};
                data.forEach(armor => {
                    armorPublicMultipleMap[armor.name] =
                        ` Damage ${armor.ac},
                         ${armor.text}`

                    armorPublicMap[armor.name] = {
                        damage:armor.ac,
                        text:armor.text,
                        category:armor.itemCategory,
                        private: false
                    }

                });
                setArmorMultipleData(armorPublicMultipleMap);
                setArmorData(armorPublicMap);

                setArmorsPublic(data);
            } catch (error) {
                setError(error.message);
            }
        };
        const fetchSpells = async () => {
            try {
                const data = await makeRequest('/api/admin/getSpells', 'GET', null, user.token);
                setSpells(data)
                setFilteredSpells([]); // Start with no spells shown
            } catch (error) {
                setError(error.message);
            }
        };
        const fetchPublicEquipment = async () => {
            try {
                const data = await makeRequest('/api/admin/getEquipment', 'GET', null, user.token);
                setEquipmentPublic(data)
                setFilteredEquipmentPublic([]); // Start with no spells shown

                const equipmentPublicMap = {};
                const equipmentPublicMultipleMap = {};
                data.forEach(equipment => {
                    equipmentPublicMultipleMap[equipment.name] =
                        ` Damage ${equipment.text},
                         ${equipment.sourceRaw}`

                    equipmentPublicMap[equipment.name] = {
                        damage:equipment.damage,
                        text:equipment.text,
                        category:equipment.itemCategory,
                        private: false
                    }

                });
                setEquipmentMultipleData(equipmentPublicMultipleMap);
                setEquipmentData(equipmentPublicMap);

            } catch (error) {
                setError(error.message);
            }
        };

        const fetchPrivateWeapons = async () => {
            if (campaignId) {
                try {
                    const data = await makeRequest(`/api/items/weapons/private/${campaignId}`, 'GET', null, user.token);
                    setWeaponsPrivate(data);
                } catch (error) {
                    setError(error.message);
                }
            }
        };
        const fetchPrivateArmors = async () => {
            if (campaignId) {
                try {
                    const data = await makeRequest(`/api/items/armors/private/${campaignId}`, 'GET', null, user.token);
                    setArmorsPrivate(data);
                } catch (error) {
                    setError(error.message);
                }
            }
        };

        const fetchPrivateEquipment = async () => {
            if (campaignId) {
                try {
                    const data = await makeRequest(`/api/items/equipment/private/${campaignId}`, 'GET', null, user.token);
                    setEquipmentPrivate(data); // Set your private equipment state here
                } catch (error) {
                    setError(error.message);
                }
            }
        };

        fetchTraits();
        fetchPublicWeapons();
        fetchPublicArmors();
        fetchSpells();
        fetchPublicEquipment();
        fetchPrivateWeapons();
        fetchPrivateArmors();
        fetchPrivateEquipment(); // Fetch private equipment
    }, [user.token, campaignId]);

    const clearError = (fieldName, value) => {
        if (fieldName === 'name' && value.length > 0) {
            const newErrors = { ...formErrors };
            delete newErrors.name;
            setFormErrors(newErrors);
        }
    };
    const handleWeaponInputChange = (e) => {
        const { name, value } = e.target;
        setNewWeapon({ ...newWeapon, [name]: value });

        clearError(name, value); // Reuse the clearError function

    };
    const handleArmorInputChange = (e) => {
        const { name, value } = e.target;
        setNewArmor({ ...newArmor, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleEquipmentInputChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment({ ...newEquipment, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleSpellInputChange = (e) => {
        const { name, value } = e.target;
        setNewSpell({ ...newSpell, [name]: value });

        clearError(name, value); // Reuse the clearError function

    };
    const [newPublicWeapon, setNewPublicWeapon] = useState(defaultWeaponState);
    const [newPublicArmor, setNewPublicArmor] = useState(defaultArmorState);
    const [newPublicEquipment, setNewPublicEquipment] = useState(defaultEquipmentState); // State for new equipment

    const handleWeaponPublicInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublicWeapon({ ...newPublicWeapon, [name]: value });

        clearError(name, value); // Reuse the clearError function

    };

    const handleArmorPublicInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublicArmor({ ...newPublicArmor, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleEquipmentPublicInputChange = (e) => {
        const { name, value } = e.target;
        setNewPublicEquipment({ ...newPublicEquipment, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const [damageInput, setDamageInput] = useState('');


    const maxDamage = () => {
        const damageParts = damageInput.split('d');
        const damageCount = parseInt(damageParts[0]) || 0;
        const damageDie = parseInt(damageParts[1]) || 0;
        return damageDie === 0 ? damageCount * 1 : damageCount * damageDie;
    };


    const [damagePublicInput, setDamagePublicInput] = useState('');


    const maxPublicDamage = () => {
        const damageParts = damagePublicInput.split('d');
        const damageCount = parseInt(damageParts[0]) || 0;
        const damageDie = parseInt(damageParts[1]) || 0;
        return damageDie === 0 ? damageCount * 1 : damageCount * damageDie;
    };

    const sanitizeList = (list, listType) => {  // Added listType parameter
        if (Array.isArray(list)) return list;
        if (typeof list === 'string') {
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
        return [];
    };

    const validateCreateItemName = (privateItems, publicItems, newItem) => {
        const errors = {};

        // Check for duplicate names (case-insensitive)
        const createdItem = privateItems.find(
            (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
        ) || publicItems.find(
            (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
        );

        if (createdItem) {
            errors.name = `An item with that name already exists.`;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const validateUpdateItemName = (privateItems, publicItems, editedItem) => {
        const errors = {};

        // Check for duplicate names (case-insensitive)
        const existingItem = privateItems.find(
            (item) => item.name.toLowerCase() === editedItem.name.toLowerCase()&& item.id !== editedItem.id
        ) || publicItems.find(
            (item) => item.name.toLowerCase() === editedItem.name.toLowerCase() && item.id !== editedItem.id
        );

        if (existingItem) {
            errors.name = `An item with that name already exists.`;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleAddSpell = async (e) => {
        e.preventDefault();
        // Parse and calculate damageDie based on damage input

        const isValid = validateCreateItemName(
            Spells,
            Spells,
            newSpell
        );

        if (!isValid) return; // Stop if validation fails



        const spellData = {
            ...newSpell,
            trait: newSpell.trait.map(item => item.type).join(', '), // Access only the type
            tradition: newSpell.tradition.map(item => item.type).join(','), // Access only the type
            heighten: newSpell.heighten.map(item => item.type).join(', '), // Access only the type
            component: newSpell.component.map(item => item.type).join(', '), // Access only the type
            bloodline: newSpell.bloodline.map(item => item.type).join(', '), // Access only the type
            savingThrow: newSpell.savingThrow.map(item => item.type).join(', '), // Access only the type
        };
        try {
            const data = await makeRequest(`/api/admin/addSpells`, 'POST', spellData, user.token);
            setSpells([...Spells, data]); // Add the new weapon to the existing list
            setNewSpell(defaultSpellState);
            setShowAddSpellForm(false); // Close the form
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditSpellChange = (e) => {
        const { name, value } = e.target;
        setEditingSpell({ ...editingSpell, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleUpdateSpell = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            Spells,
            Spells,
            editingSpell
        );

        if (!isValid) return; // Stop if validation fails

        const spellData = {
            ...editingSpell,
            trait: sanitizeList(editingSpell.trait, 'trait').map(item => item.type || '').join(', '),
            tradition: sanitizeList(editingSpell.tradition, 'tradition').map(item => item.type || '').join(','),
            heighten: sanitizeList(editingSpell.heighten, 'heighten').map(item => item.type || '').join(', '),
            component: sanitizeList(editingSpell.component, 'component').map(item => item.type || '').join(', '),
            bloodline: sanitizeList(editingSpell.bloodline, 'bloodline').map(item => item.type || '').join(', '),
            savingThrow: sanitizeList(editingSpell.savingThrow, 'savingThrow').map(item => item.type || '').join(', '),

        };

        try {
            const updatedSpell = await makeRequest(`/api/admin/updateSpells/${editingSpell.id}`, 'PUT', spellData, user.token);
            setSpells(Spells.map(spell => (spell.id === updatedSpell.id ? updatedSpell : spell))); // Update the list
            setEditingSpell(null); // Clear editing state
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteSpell = async (id) => {
        try {
            await makeRequest(`/api/admin/deleteSpells/${id}`, 'DELETE', null, user.token);
            setSpells(Spells.filter(weapon => weapon.id !== id)); // Remove the deleted weapon from the list
        } catch (error) {
            setError(error.message);
        }
    };

    // Weapons CRUD
    const handleAddWeapon = async (e) => {
        e.preventDefault();
        // Parse and calculate damageDie based on damage input

        const isValid = validateCreateItemName(
            weaponsPrivate,
            weaponsPublic,
            newWeapon
        );

        if (!isValid) return; // Stop if validation fails


        // Set the damageDie in the newWeapon object
        newWeapon.damageDie = maxDamage(); // Set damageDie with the parsed value
        newWeapon.damage = damageInput; // Keep the original input for future reference

        const weaponData = {
            ...newWeapon,
            campaignId,
            trait: newWeapon.trait.map(item => item.type).join(', '), // Access only the type
        };
        try {
            const data = await makeRequest(`/api/items/weapons/private/${campaignId}`, 'POST', weaponData, user.token);
            setWeaponsPrivate([...weaponsPrivate, data]); // Add the new weapon to the existing list
            setNewWeapon(defaultWeaponState);
            setShowAddWeaponForm(false); // Close the form
            setDamageInput(''); // Reset damage input
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddPublicWeapon = async (e) => {
        e.preventDefault();
        // Parse and calculate damageDie based on damage input

        const isValid = validateCreateItemName(
            weaponsPrivate,
            weaponsPublic,
            newPublicWeapon
        );

        if (!isValid) return; // Stop if validation fails


        // Set the damageDie in the newWeapon object
        newPublicWeapon.damageDie = maxPublicDamage(); // Set damageDie with the parsed value
        newPublicWeapon.damage = damagePublicInput; // Keep the original input for future reference

        const weaponData = {
            ...newPublicWeapon,
            trait: newPublicWeapon.trait.map(item => item.type).join(', '), // Access only the type
        };
        try {
            const data = await makeRequest(`/api/admin/addWeapons`, 'POST', weaponData, user.token);
            setWeaponsPublic([...weaponsPublic, data]); // Add the new weapon to the existing list
            setNewPublicWeapon(defaultWeaponState);
            setShowAddPublicWeaponForm(false); // Close the form
            setDamageInput(''); // Reset damage input
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditWeaponChange = (e) => {
        const { name, value } = e.target;
        setEditingWeapon({ ...editingWeapon, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleEditPublicWeaponChange = (e) => {
        const { name, value } = e.target;
        setEditingPublicWeapon({ ...editingPublicWeapon, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleUpdateWeapon = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            weaponsPrivate,
            weaponsPublic,
            editingWeapon
        );

        if (!isValid) return; // Stop if validation fails

        editingWeapon.damageDie = maxDamage(); // Set damageDie with the parsed value
        editingWeapon.damage = damageInput; // Keep the original input for future reference


        const weaponEditData = {
            ...editingWeapon,
            trait: sanitizeList(editingWeapon.trait, 'trait').map(item => item.type || '').join(', '),
            campaignId,
        };

        try {
            const updatedWeapon = await makeRequest(`/api/items/weapons/private/${editingWeapon.id}`, 'PUT', weaponEditData, user.token);
            setWeaponsPrivate(weaponsPrivate.map(weapon => (weapon.id === updatedWeapon.id ? updatedWeapon : weapon))); // Update the list
            setEditingWeapon(null); // Clear editing state
            setDamageInput(''); // Reset damage input
        } catch (error) {
            setError(error.message);
        }
    };

        const handleUpdatePublicWeapon = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            weaponsPrivate,
            weaponsPublic,
            editingPublicWeapon
        );

        if (!isValid) return; // Stop if validation fails

        editingPublicWeapon.damageDie = maxPublicDamage(); // Set damageDie with the parsed value
            editingPublicWeapon.damage = damagePublicInput; // Keep the original input for future reference


        const weaponEditData = {
            ...editingPublicWeapon,
            trait: sanitizeList(editingPublicWeapon.trait, 'trait').map(item => item.type || '').join(', '),
        };

        try {
            const updatedWeapon = await makeRequest(`/api/admin/updateWeapons/${editingPublicWeapon.id}`, 'PUT', weaponEditData, user.token);
            setWeaponsPublic(weaponsPublic.map(weapon => (weapon.id === updatedWeapon.id ? updatedWeapon : weapon))); // Update the list
            setEditingPublicWeapon(null); // Clear editing state
            setDamageInput(''); // Reset damage input
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteWeapon = async (id) => {
        try {
            await makeRequest(`/api/items/weapons/private/${id}`, 'DELETE', null, user.token);
            setWeaponsPrivate(weaponsPrivate.filter(weapon => weapon.id !== id)); // Remove the deleted weapon from the list
        } catch (error) {
            setError(error.message);
        }
    };
    const handleDeletePublicWeapon = async (id) => {
        try {
            await makeRequest(`/api/admin/deleteWeapons/${id}`, 'DELETE', null, user.token);
            setWeaponsPublic(weaponsPublic.filter(weapon => weapon.id !== id)); // Remove the deleted weapon from the list
        } catch (error) {
            setError(error.message);
        }
    };

    // Armor CRUD

    const handleAddArmor = async (e) => {
        e.preventDefault();

        const isValid = validateCreateItemName(
            armorsPrivate,
            armorsPublic,
            newArmor
        );

        if (!isValid) return; // Stop if validation fails

        const armorData = {
            ...newArmor,
            campaignId,
            trait: newArmor.trait.map(item => item.type).join(', '), // Access only the type

        };

        try {
            const data = await makeRequest(`/api/items/armors/private/${campaignId}`, 'POST', armorData, user.token);
            setArmorsPrivate([...armorsPrivate, data]);
            setNewArmor(defaultArmorState);
            setShowAddArmorForm(false); // Close the form

        } catch (error) {
            setError(error.message);
        }
    };
    const handleAddPublicArmor = async (e) => {
        e.preventDefault();

        const isValid = validateCreateItemName(
            armorsPrivate,
            armorsPublic,
            newPublicArmor
        );

        if (!isValid) return; // Stop if validation fails

        const armorData = {
            ...newPublicArmor,
            trait: newPublicArmor.trait.map(item => item.type).join(', '), // Access only the type
        };

        try {
            const data = await makeRequest(`/api/admin/addArmor`, 'POST', armorData, user.token);
            setArmorsPublic([...armorsPublic, data]);
            setNewPublicArmor(defaultArmorState);
            setShowAddPublicArmorForm(false); // Close the form

        } catch (error) {
            setError(error.message);
        }
    };
    const handleEditArmorChange = (e) => {
        const { name, value } = e.target;
        setEditingArmor({ ...editingArmor, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleEditPublicArmorChange = (e) => {
        const { name, value } = e.target;
        setEditingPublicArmor({ ...editingPublicArmor, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleUpdateArmor = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            armorsPrivate,
            armorsPublic,
            editingArmor
        );

        if (!isValid) return; // Stop if validation fails

        const armorEditData = {
            ...editingArmor,
            campaignId,
            trait: sanitizeList(editingArmor.trait, 'trait').map(item => item.type || '').join(', '),
        };

        try {
            const updatedArmor = await makeRequest(`/api/items/armors/private/${editingArmor.id}`, 'PUT', armorEditData, user.token);
            setArmorsPrivate(armorsPrivate.map(armor => (armor.id === updatedArmor.id ? updatedArmor : armor)));
            setEditingArmor(null);
        } catch (error) {
            setError(error.message);
        }
    };
    const handleUpdatePublicArmor = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            armorsPrivate,
            armorsPublic,
            editingPublicArmor
        );

        if (!isValid) return; // Stop if validation fails

        const armorEditData = {
            ...editingPublicArmor,
            trait: sanitizeList(editingPublicArmor.trait, 'trait').map(item => item.type || '').join(', '),
        };

        try {
            const updatedArmor = await makeRequest(`/api/admin/updateArmor/${editingPublicArmor.id}`, 'PUT', armorEditData, user.token);
            setArmorsPublic(armorsPublic.map(armor => (armor.id === updatedArmor.id ? updatedArmor : armor)));
            setEditingPublicArmor(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteArmor = async (id) => {
        try {
            await makeRequest(`/api/items/armors/private/${id}`, 'DELETE', null, user.token);
            setArmorsPrivate(armorsPrivate.filter(armor => armor.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };
    const handleDeletePublicArmor = async (id) => {
        try {
            await makeRequest(`/api/admin/deleteArmor/${id}`, 'DELETE', null, user.token);
            setArmorsPublic(armorsPublic.filter(armor => armor.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    //Equipment CRUD
    const handleAddEquipment = async (e) => {
        e.preventDefault();

        const isValid = validateCreateItemName(
            equipmentPrivate,
            equipmentPublic,
            newEquipment
        );

        if (!isValid) return; // Stop if validation fails

        const equipmentData = {
            ...newEquipment,
            itemCategory: selectedCategory,
            itemSubcategory: selectedSubcategory,
            trait: newEquipment.trait.map(item => item.type).join(', '), // Access only the type
            campaignId,
        };

        try {
            const data = await makeRequest(`/api/items/equipment/private/${campaignId}`, 'POST', equipmentData, user.token);
            setEquipmentPrivate([...equipmentPrivate, data]);
            setNewEquipment(defaultEquipmentState); // Reset the form
            resetCategoryInputs();
            setShowAddEquipmentForm(false); // Close the form
        } catch (error) {
            setError(error.message);
        }
    };
    const handleAddPublicEquipment = async (e) => {
        e.preventDefault();

        const isValid = validateCreateItemName(
            equipmentPrivate,
            equipmentPublic,
            newPublicEquipment
        );

        if (!isValid) return; // Stop if validation fails

        const equipmentData = {
            ...newPublicEquipment,
            itemCategory: selectedCategory,
            itemSubcategory: selectedSubcategory,
            trait: newPublicEquipment.trait.map(item => item.type).join(', '), // Access only the type
        };

        try {
            const data = await makeRequest(`/api/admin/addEquipment`, 'POST', equipmentData, user.token);
            setEquipmentPublic([...equipmentPublic, data]);
            setNewPublicEquipment(defaultEquipmentState); // Reset the form
            resetCategoryInputs();
            setShowAddPublicEquipmentForm(false); // Close the form
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditEquipmentChange = (e) => {
        const { name, value } = e.target;
        setEditingEquipment({ ...editingEquipment, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };
    const handleEditPublicEquipmentChange = (e) => {
        const { name, value } = e.target;
        setEditingPublicEquipment({ ...editingPublicEquipment, [name]: value });

        clearError(name, value); // Reuse the clearError function
    };

    const handleUpdateEquipment = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            equipmentPrivate,
            equipmentPublic,
            editingEquipment
        );

        if (!isValid) return; // Stop if validation fails

        const equipmentEditData = {
            ...editingEquipment,
            itemCategory: selectedCategory,
            itemSubcategory: selectedSubcategory,
            trait: sanitizeList(editingEquipment.trait, 'trait').map(item => item.type || '').join(', '),

            campaignId,
        };

        try {
            const updatedEquipment = await makeRequest(`/api/items/equipment/private/${editingEquipment.id}`, 'PUT', equipmentEditData, user.token);
            setEquipmentPrivate(equipmentPrivate.map(equ => (equ.id === updatedEquipment.id ? updatedEquipment : equ)));
            setEditingEquipment(null); // Clear editing state
            resetCategoryInputs();
        } catch (error) {
            setError(error.message);
        }
    };
    const handleUpdatePublicEquipment = async (e) => {
        e.preventDefault();

        const isValid = validateUpdateItemName(
            equipmentPrivate,
            equipmentPublic,
            editingPublicEquipment
        );

        if (!isValid) return; // Stop if validation fails

        const equipmentEditData = {
            ...editingPublicEquipment,
            itemCategory: selectedCategory,
            itemSubcategory: selectedSubcategory,
            trait: sanitizeList(editingPublicEquipment.trait, 'trait').map(item => item.type || '').join(', '),
        };

        try {
            const updatedEquipment = await makeRequest(`/api/admin/updateEquipment/${editingPublicEquipment.id}`, 'PUT', equipmentEditData, user.token);
            setEquipmentPublic(equipmentPrivate.map(equ => (equ.id === updatedEquipment.id ? updatedEquipment : equ)));
            setEditingPublicEquipment(null); // Clear editing state
            resetCategoryInputs();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteEquipment = async (id) => {
        try {
            await makeRequest(`/api/items/equipment/private/${id}`, 'DELETE', null, user.token);
            setEquipmentPrivate(equipmentPrivate.filter(equ => equ.id !== id)); // Remove the deleted equipment
        } catch (error) {
            setError(error.message);
        }
    };
    const handleDeletePublicEquipment = async (id) => {
        try {
            await makeRequest(`/api/admin/deleteEquipment/${id}`, 'DELETE', null, user.token);
            setEquipmentPublic(equipmentPublic.filter(equ => equ.id !== id)); // Remove the deleted equipment
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            setSortDirection((prev) => (prev === 2 ? 0 : prev + 1));
        } else {
            setSortCriteria(criteria);
            setSortDirection(1);
        }
    };

    const filterItems = (items) =>
        items.filter(item => {
            const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTradition = filterTradition
                ? (item.tradition && typeof item.tradition === 'string' && item.tradition.split(',').includes(filterTradition))
                : true;
            const matchesCategory = filterCategory
                ? (item.itemCategory && typeof item.itemCategory === 'string' && item.itemCategory.split(',').includes(filterCategory))
                : true;
            const matchesSubcategory = filterSubcategory
                ? (item.itemSubcategory && typeof item.itemSubcategory === 'string' && item.itemSubcategory.split(',').includes(filterSubcategory))
                : true;
            return matchesSearchTerm && matchesTradition && matchesCategory && matchesSubcategory;
        });

    const sortItems = (items) => {
        if (sortDirection === 0) return items;
        const sortedItems = [...items].sort((a, b) => {
            if (sortCriteria === 'price') {
                return ((a.pp*1000)+(a.gp*100)+(a.sp*10)+a.cp) - ((b.pp*1000)+(b.gp*100)+(b.sp*10)+b.cp);
            } else if (sortCriteria === 'damage') {
                const damageA = a.damageDie ? parseInt(a.damageDie, 10) : -Infinity;
                const damageB = b.damageDie ? parseInt(b.damageDie, 10) : -Infinity;
                return damageA - damageB;
            } else if (sortCriteria === 'ac' && a.ac && b.ac) {
                return a.ac - b.ac;
            } else if (sortCriteria === 'level') {
                return a.level - b.level;
            }else if (sortCriteria === 'ac') {
                return a.ac - b.ac;
            } else if (sortCriteria === 'rarity') {
                return rarityOrder[a.rarity] - rarityOrder[b.rarity];
            }
            return 0;
        });

        return sortDirection === 1 ? sortedItems : sortedItems.reverse();
    };

    const formatPrice = (pp, gp, sp, cp) => {
        const totalCp = (pp * 1000) + (gp * 100) + (sp * 10) + cp;

        const newPp = Math.floor(totalCp / 1000);
        const remainingAfterPp = totalCp % 1000;
        const newGp = Math.floor(remainingAfterPp / 100);
        const remainingAfterGp = remainingAfterPp % 100;
        const newSp = Math.floor(remainingAfterGp / 10);
        const newCp = remainingAfterGp % 10;


        const parts = [];
        if (newPp > 0) parts.push(`${newPp} Pp`);
        if (newGp > 0) parts.push(`${newGp} Gp`);
        if (newSp > 0) parts.push(`${newSp} Sp`);
        if (newCp > 0) parts.push(`${newCp} Cp`);

        return parts.join(' ');
    };

    const WeaponCategoryDropdown = ({value, onChange}) => (
        <>Weapon Category:
            <select name="weaponCategory" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Weapon Category</option>
                <option value="Unarmed">Unarmed</option>
                <option value="Simple">Simple</option>
                <option value="Martial">Martial</option>
                <option value="Advanced">Advanced</option>
                <option value="Ammunition">Ammunition</option>
            </select>
        </>
    );
    const WeaponGroupDropdown = ({value, onChange}) => (
        <>Weapon Group:
            <select name="weaponGroup" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Weapon Group</option>
                <option value="Brawling">Brawling</option>
                <option value="Club">Club</option>
                <option value="Knife">Knife</option>
                <option value="Spear">Spear</option>
                <option value="Sword">Sword</option>
                <option value="Axe">Axe</option>
                <option value="Flail">Flail</option>
                <option value="Polearm">Polearm</option>
                <option value="Pick">Pick</option>
                <option value="Hammer">Hammer</option>
                <option value="Shield">Shield</option>
                <option value="Dart">Dart</option>
                <option value="Bow">Bow</option>
                <option value="Sling">Sling</option>
                <option value="Bomb">Bomb</option>
                <option value="Firearm">Firearm</option>
            </select>
        </>
    );
    const WeaponTypeDropdown = ({value, onChange}) => (
        <>Weapon Type:
            <select name="weaponType" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Weapon Type</option>
                <option value="Melee">Melee</option>
                <option value="Ranged">Ranged</option>
            </select>
        </>
    );

    const ArmorCategoryDropdown = ({value, onChange}) => (
        <>Armor Category:
            <select name="armorCategory" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Weapon Category</option>
                <option value="Unarmored">Unarmored</option>
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Heavy">Heavy</option>
            </select>
        </>
    );
    const ArmorGroupDropdown = ({value, onChange}) => (
        <>Armor Group:
            <select name="armorGroup" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Group Category</option>
                <option value="Cloth">Cloth</option>
                <option value="Leather">Leather</option>
                <option value="Chain">Chain</option>
                <option value="Plate">Plate</option>
                <option value="Composite">Composite</option>
                <option value="Skeletal">Skeletal</option>
                <option value="Wood">Wood</option>
            </select>
        </>
    );
    const RarityDropdown = ({ value, onChange }) => (
        <>Rarity:
            <select name="rarity" value={value || ""} onChange={onChange} > {/* Handle empty value */}
                <option value="" hidden>Select Rarity</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="unique">Unique</option>
            </select>
        </>
    );
    const SchoolDropdown = ({ value, onChange }) => (
        <>School:
            <select name="school" value={value || ""} onChange={onChange} > {/* Handle empty value */}
                <option value="" hidden>Select School</option>
                {spellSchools.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </>
    );
    const SpellTypeDropdown = ({ value, onChange }) => (
        <>Spell type:
            <select name="type" value={value || ""} onChange={onChange}> {/* Handle empty value */}
                <option value="" hidden>Select Spell Type</option>
                <option value="Spell">Spell</option>
                <option value="Cantrip">Cantrip</option>
                <option value="Focus">Focus</option>
            </select>
        </>
    );

    useEffect(() => {
        if (editingEquipment) {
            const equipmentItem = editingEquipment;
            setNewEquipment({
                itemCategory: equipmentItem.itemCategory,
                itemSubcategory: equipmentItem.itemSubcategory,
            });
            setSelectedCategory(equipmentItem.itemCategory); // Set selected category for editing
            setSelectedSubcategory(equipmentItem.itemSubcategory); // Set selected subcategory for editing
            setSubcategoryButtons(categoriesWithSubcategories[equipmentItem.itemCategory] || []);
        }
        if (editingPublicEquipment) {
            const equipmentItem = editingPublicEquipment;
            setNewEquipment({
                itemCategory: equipmentItem.itemCategory,
                itemSubcategory: equipmentItem.itemSubcategory,
            });
            setSelectedCategory(equipmentItem.itemCategory); // Set selected category for editing
            setSelectedSubcategory(equipmentItem.itemSubcategory); // Set selected subcategory for editing
            setSubcategoryButtons(categoriesWithSubcategories[equipmentItem.itemCategory] || []);
        }

        if (editingWeapon) {
            setDamageInput(editingWeapon.damage || '');
        }
        if (newWeapon) {
            setDamageInput(newWeapon.damage || '');
        }
        if (editingPublicWeapon) {
            setDamagePublicInput(editingPublicWeapon.damage || '');
        }
        if (newPublicWeapon) {
            setDamagePublicInput(newPublicWeapon.damage || '');
        }
    }, [editingWeapon, newWeapon, editingEquipment, editingPublicWeapon, newPublicWeapon]);

// Category and Subcategory Dropdown component
    const CategoryDropdown = ({
                                  selectedCategory,
                                  handleCategoryChange,
                                  subcategoryButtons,
                                  selectedSubcategory,
                                  setSelectedSubcategory,
                                  editingEquipment, // New prop to handle selected values
                              }) => (
        <div>
            <label>Category:</label>
            <select value={selectedCategory} onChange={handleCategoryChange} required>
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            {subcategoryButtons.length > 0 && (
                <>
                    <label>Subcategory:</label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        required
                    >
                        <option value="">Select Subcategory</option>
                        {subcategoryButtons.map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );


    useEffect(() => {
        const filteredSpells = filterItems(Spells);
        const filteredEquipmentPublic = filterItems(equipmentPublic);
        setFilteredSpells(filteredSpells);
        setFilteredEquipmentPublic(filteredEquipmentPublic);
    }, [searchTerm, filterTradition, Spells, equipmentPublic]);

    const handleTableClick = (tableName) => {
        setActiveTable(tableName);
        setSearchTerm('');

        setShowAddWeaponForm(false);
        setShowAddArmorForm(false);
        setShowAddEquipmentForm(false);
        setShowAddSpellForm(false);

        setEditingArmor(null);
        setEditingWeapon(null);
        setEditingEquipment(null);
        setEditingSpell(null);

        setShowAddPublicWeaponForm(false);
        setShowAddPublicArmorForm(false);
        setShowAddPublicEquipmentForm(false);

        setEditingPublicArmor(null);
        setEditingPublicWeapon(null);
        setEditingPublicEquipment(null);

        setFilterTradition('');
        setFilterCategory('');
        setFilterSubcategory('');
    };

// Handle Tradition Button Click
    const handleTraditionClick = (tradition) => {
        setFilterTradition(tradition);
    };
    const handleCategoryClick = (category) => {
        setFilterCategory(category);
        setSearchTerm('');
        setFilterSubcategory('');
        setSubcategoryButtons(categoriesWithSubcategories[category] || []); // Get subcategories for the selected category
    };
    const handleTraitChange = (traitType, selectedOptions) => {
        const updatedTraits = [...newWeapon.trait];
        const existingIndex = updatedTraits.findIndex(trait => trait.type === traitType);
        if (existingIndex !== -1) {
            updatedTraits[existingIndex] = { type: traitType, values: selectedOptions };
        } else {
            updatedTraits.push({ type: traitType, values: selectedOptions });
        }
        setNewWeapon({ ...newWeapon, trait: updatedTraits });
    };
    const handleSubcategoryClick = (subcategory) => {
        // Update filter to show only filtered equipment with that itemSubcategory
        setFilterSubcategory(subcategory); // Set the filter to the clicked subcategory
    };

    //filtering and sorting
    const filteredWeaponsPrivate = filterItems(weaponsPrivate);
    const filteredArmorsPrivate = filterItems(armorsPrivate);
    const filteredEquipmentPrivate = filterItems(equipmentPrivate)
    //const sortedWeaponsPrivate = sortWeapons(filteredWeaponsPrivate);
   // const sortedWeaponsPublic = sortWeapons(filterWeapons(weaponsPublic));
   // const filteredSpells = filterItems(Spells);

    // Combined
    const allWeapons = [
        ...filterItems(weaponsPublic).map(w => ({...w, isPrivate: false, compositeKey: `publicWeapon-${w.id}` })),
        ...filterItems(weaponsPrivate).map(w => ({...w, isPrivate: true, compositeKey: `privateWeapon-${w.id}` }))
    ];

    const allArmors = [
        ...filterItems(armorsPublic).map(a => ({...a, isPrivate: false, compositeKey: `publicArmor-${a.id}` })),
        ...filterItems(armorsPrivate).map(a => ({...a, isPrivate: true, compositeKey: `privateArmor-${a.id}` }))
    ];

    const allEquipment = [
        ...filterItems(equipmentPublic).map(a => ({...a, isPrivate: false, compositeKey: `publicEquipment-${a.id}` })),
        ...filterItems(equipmentPrivate).map(a => ({...a, isPrivate: true, compositeKey: `privateEquipment-${a.id}` }))
    ];

    // Sorting data
    const sortedWeapons = sortItems(allWeapons);
    const sortedWeaponsPrivate = sortItems(filteredWeaponsPrivate);

    const sortedSpells = sortItems(filteredSpells);

    const sortedEquipment = sortItems(allEquipment);
    const sortedEquipmentPrivate = sortItems(filteredEquipmentPrivate);


    const sortedArmors = sortItems(allArmors);
    const sortedArmorsPrivate = sortItems(filteredArmorsPrivate);


    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 50; // Change this to 50 for the new requirement
    const resetIndex = () => {
        setStartIndex(0); // Call setStartIndex as a function
    };
    const handleNext = () => {
        setStartIndex(startIndex + itemsPerPage);
    };

    const handlePrevious = () => {
        setStartIndex(Math.max(0, startIndex - itemsPerPage));
    };



// Calculate the paginated creatures
    const paginatedEquipmentPublic = sortedEquipment.slice(startIndex, startIndex + itemsPerPage);
    const paginatedWeaponsPublic = sortedWeapons.slice(startIndex, startIndex + itemsPerPage);
    const paginatedSpells = sortedSpells.slice(startIndex, startIndex + itemsPerPage);


    const weaponTraits = ["Agile", "Attached", "Backstabber", "Backswing", "Brace", "Climbing", "Concealable", "Concussive", "Deadly","Monk", "Finesse", "Forceful", "Free-Hand", "Grapple", "Nonlethal", "Shove", "Sweep", "Tethered", "Trip", "Two-Hand", "Venomous", "Brutal", "Capacity", "Cobbled", "Concealable", "Deadly", "Double Barrel", "Kickback", "Propulsive", "Recovery"];
    const armorTraits = ["Adjusted", "Aquadynamic", "Bulwark", "Comfort", "Flexible", "Hindering", "Inscribed", "Laminar", "Noisy", "Ponderous"];
    const equipmentTraits = ["Adjustment", "Alchemical", "Apex", "Artifact", "Barding", "Bomb", "Bottled Breath", "Catalyst", "Censer", "Clockwork", "Coda", "Companion", "Consumable", "Contract", "Cursed", "Drug", "Elixir", "Entrench", "Expandable", "Figurehead", "Focused", "Fulu", "Gadget", "Graft", "Grimoire", "Intelligent", "Invested", "Lozenge", "Mechanical", "Missive", "Mutagen", "Oil", "Potion", "Precious", "Processed", "Relic", "Saggorak", "Scroll", "Snare", "Spellgun", "Spellheart", "Staff", "Steam", "Structure", "Talisman", "Tattoo", "Trap", "Wand", "Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];


    const spellComponents = ["Material", "Somatic", "Verbal", "Focus"];
    const spellBloodlines = ["Aberrant", "Angelic", "Demonic", "Diabolic", "Draconic", "Elemental", "Fey", "Genie", "Hag", "Harrow", "Imperial", "Nymph", "Phoenix", "Psychopomp", "Shadow", "Undead", "Wyrmblessed"];
    const spellHeighten = ["+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "2nd", "3td", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
    const spellSavingThrows = ["Fortitude", "Will", "Reflex", "Basic Fortitude", "Basic Will", "Basic Reflex"];
    const spellSchools = ["Necromancy", "Evocation", "Transmutation", "Conjuration", "Abjuration", "Divination", "Enchantment", "Illusion"];
    const spellTraditions = ["Arcane", "Primal", "Divine", "Occult", "Elemental"];

    const handleDynamicListChange = (setobject,fieldName, newList) => {
        if(setobject==="weapon") {
            setNewWeapon({...newWeapon, [fieldName]: newList});
        } else if (setobject==="armor"){
            setNewArmor({...newArmor, [fieldName]: newList});
        } else if (setobject==="equipment"){
            setNewEquipment({...newEquipment, [fieldName]: newList});
        } else if (setobject==="spell"){
            setNewSpell({...newSpell, [fieldName]: newList});
        }else if (setobject==="savingThrow"){
            setNewSpell({...newSpell, [fieldName]: newList});
        }else if (setobject==="tradition"){
            setNewSpell({...newSpell, [fieldName]: newList});
        } else if (setobject==="bloodline"){
            setNewSpell({...newSpell, [fieldName]: newList});
        }else if (setobject==="component"){
            setNewSpell({...newSpell, [fieldName]: newList});
        }else if (setobject==="heighten"){
            setNewSpell({...newSpell, [fieldName]: newList});
        }
    };
    const handleDynamicPublicListChange = (setobject,fieldName, newList) => {
        if(setobject==="weapon") {
            setNewPublicWeapon({...newPublicWeapon, [fieldName]: newList});
        } else if (setobject==="armor"){
            setNewPublicArmor({...newPublicArmor, [fieldName]: newList});
        } else if (setobject==="equipment"){
            setNewPublicEquipment({...newPublicEquipment, [fieldName]: newList});
        }
    };
    const handleDynamicListEditChange = (setobject, fieldName, newList) => {
        if(setobject==="weapon") {
            setEditingWeapon({...editingWeapon, [fieldName]: newList});
        } else if (setobject==="armor"){
            setEditingArmor({...editingArmor, [fieldName]: newList});
        } else if (setobject==="equipment"){
            setEditingEquipment({...editingEquipment, [fieldName]: newList});
        } else if (setobject==="spell"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        } else if (setobject==="savingThrow"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        } else if (setobject==="tradition"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        } else if (setobject==="bloodline"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        } else if (setobject==="component"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        } else if (setobject==="heighten"){
            setEditingSpell({...editingSpell, [fieldName]: newList});
        }
    };
    const handleDynamicPublicListEditChange = (setobject, fieldName, newList) => {
        if(setobject==="weapon") {
            setEditingPublicWeapon({...editingPublicWeapon, [fieldName]: newList});
        } else if (setobject==="armor"){
            setEditingPublicArmor({...editingPublicArmor, [fieldName]: newList});
        } else if (setobject==="equipment"){
            setEditingPublicEquipment({...editingPublicEquipment, [fieldName]: newList});
        }
    };

    function renderNameFormError() {
        return formErrors.name ? (
            <span className="error-message">{formErrors.name}</span>
        ) : null;
    }

    return (
        <div>
            <h1>Items</h1>
            <button onClick={() => navigate('/dashboard?campaignId=' + campaignId)}>Dashboard</button>
            <button onClick={() => handleTableClick('allWeapons')}>Weapons</button>
            <button onClick={() => handleTableClick('yourWeapons')}>Your weapons</button>
            <button onClick={() => handleTableClick('allArmors')}>Armors</button>
            <button onClick={() => handleTableClick('yourArmors')}>Your armors</button>
            <button onClick={() => {
                handleTableClick('Spells');
                setFilteredSpells([]); // Initially show no spells
                resetIndex();
            }}>Spells
            </button>
            <button onClick={() => {
                handleTableClick('allEquipment');
                setFilteredEquipmentPublic([]);
                resetIndex();
            }}>Equipment
            </button>
            <button onClick={() => {
                handleTableClick('yourEquipment');
                setFilteredEquipmentPublic([]);
            }}>Your equipment
            </button>
            <button onClick={logout}>Logout</button>

            {error && <p style={{color: 'red'}}>{error}</p>}


            {/*New button*/}
            {activeTable === 'allWeapons' && (
                <>
                    <h2>Search weapons</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>All weapons</h2>
                    <div>
                        {startIndex}---{startIndex + 50}<br/>
                        <button onClick={handlePrevious} disabled={startIndex === 0}>&lt; Previous</button>
                        <button onClick={handleNext}
                                disabled={startIndex + itemsPerPage >= sortedWeapons.length}>Next &gt;</button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('damage')}>
                                Damage {sortCriteria === 'damage' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Die</th>
                            <th>Hands</th>
                            <th>Weapon Category</th>
                            <th>Weapon Group</th>
                            <th>Weapon Type</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Summary</th>
                            <th>Traits</th>
                            {paginatedWeaponsPublic.some(weapon => weapon.access) ? (<th>Access</th>) : null}
                            <th>Bulk</th>
                            <th>Source</th>
                            {paginatedWeaponsPublic.some(weapon => weapon.isPrivate || isAdmin) ? (<th>Modify</th>) : null}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedWeaponsPublic.length > 0 ? (
                            paginatedWeaponsPublic.map((weapon) => (
                                <tr key={weapon.compositeKey}>
                                    <td>{weapon.name}</td>
                                    <td>{weapon.damage}</td>
                                    <td>{weapon.damageDie}</td>
                                    <td>{weapon.hands}</td>
                                    <td>{weapon.weaponCategory}</td>
                                    <td>{weapon.weaponGroup}</td>
                                    <td>{weapon.weaponType}</td>
                                    <td>{weapon.level}</td>
                                    <td>{formatPrice(weapon.pp, weapon.gp, weapon.sp, weapon.cp)}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={weapon.rarity}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{weapon.text}</td>

                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={weapon.trait}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    {paginatedWeaponsPublic.some(weapon => weapon.access) ? (
                                        <td>{weapon.access}</td>) : null}
                                    <td>{weapon.bulk}</td>
                                    <td>{weapon.sourceRaw}</td>
                                    {
                                        weapon.isPrivate ? (
                                            <td>
                                                <button onClick={() => setEditingWeapon(weapon)}>Edit</button>
                                                <button onClick={() => handleDeleteWeapon(weapon.id)}>Delete</button>
                                            </td>
                                        ) : (
                                            isAdmin ? (
                                                <td>
                                                    <button onClick={() => setEditingPublicWeapon(weapon)}>Edit public weapon</button>
                                                    <button onClick={() => handleDeletePublicWeapon(weapon.id)}>Delete public weapon</button>
                                                </td>
                                            ) : null
                                        )
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No such weapons</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {isAdmin ? (
                        <button onClick={() => setShowAddPublicWeaponForm(true)}>
                            Create public weapon
                        </button>
                    ) : null}
                </>
            )}

            {activeTable === 'yourWeapons' && (
                <>
                    <h2>Search weapons</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>Your weapons</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('damage')}>
                                Damage {sortCriteria === 'damage' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Die</th>
                            <th>Hands</th>
                            <th>Weapon Category</th>
                            <th>Weapon Group</th>
                            <th>Weapon Type</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Summary</th>
                            <th>Traits</th>
                            <th>Access</th>
                            <th>Access</th>
                            <th>Bulk</th>
                            <th>Source</th>
                            <th>Modify</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedWeaponsPrivate.length > 0 ? (
                            sortedWeaponsPrivate.map((weapon) => (
                                <tr key={weapon.id}>
                                    <td>{weapon.name}</td>
                                    <td>{weapon.damage}</td>
                                    <td>{weapon.damageDie}</td>
                                    <td>{weapon.hands}</td>
                                    <td>{weapon.weaponCategory}</td>
                                    <td>{weapon.weaponGroup}</td>
                                    <td>{weapon.weaponType}</td>
                                    <td>{weapon.level}</td>
                                    <td>{formatPrice(weapon.pp, weapon.gp, weapon.sp, weapon.cp)}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={weapon.rarity}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{weapon.text}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={weapon.trait}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{weapon.access}</td>
                                    <td>{weapon.bulk}</td>
                                    <td>{weapon.sourceRaw}</td>
                                    <td>
                                        <button onClick={() => setEditingWeapon(weapon)}>Edit</button>
                                        <button onClick={() => handleDeleteWeapon(weapon.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No weapons</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button onClick={() => setShowAddWeaponForm(true)}>Create weapon</button>
                </>
            )}

            {activeTable === 'allEquipment' && (
                <>
                    <h2>Filter by</h2>
                    <div>
                        {categories.map(category => (
                            <button key={category} onClick={() => {
                                handleCategoryClick(category)
                                resetIndex();
                            }
                            }>
                                {category}
                            </button>
                        ))}
                        <button onClick={() => {
                            setFilteredEquipmentPublic(equipmentPublic);
                            setFilterCategory('');
                            setFilterSubcategory('');
                            resetIndex();
                        }}>All equipment
                        </button>
                    </div>
                    {/* Render subcategory buttons dynamically based on selected category */}
                    {filterCategory && subcategoryButtons.length > 0 && (
                        <>
                            <h2>Subcategories for {filterCategory}</h2>
                            <div>
                                {subcategoryButtons.map((subcategory, index) => (
                                    <button key={index} onClick={() => {
                                        handleSubcategoryClick(subcategory)
                                        resetIndex();
                                    }}>
                                        {subcategory}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <h2>Search equipment</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>Equipment</h2>
                    <div>
                        {startIndex}---{startIndex + 50}<br/>
                        <button onClick={handlePrevious} disabled={startIndex === 0}>&lt; Previous</button>
                        <button onClick={handleNext}
                                disabled={startIndex + itemsPerPage >= sortedEquipment.length}>Next &gt;</button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            {paginatedEquipmentPublic.some(equipment => equipment.actions) ? (<th>Actions</th>) : null}
                            {paginatedEquipmentPublic.some(equipment => equipment.bulk) ? (<th>Bulk</th>) : null}
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            {paginatedEquipmentPublic.some(equipment => equipment.school) ? (<th>School</th>) : null}
                            <th>Source</th>
                            <th>Text</th>
                            {paginatedEquipmentPublic.some(equipment => equipment.hands) ? (<th>Hands</th>) : null}
                            {paginatedEquipmentPublic.some(equipment => equipment.skill) ? (<th>Skill</th>) : null}
                            {paginatedEquipmentPublic.some(equipment => equipment.trait) ? (<th>Trait</th>) : null}
                            {paginatedEquipmentPublic.some(equipment => equipment.isPrivate || isAdmin) ? (<th>Modify</th>) : null}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEquipmentPublic.length > 0 ? (
                            paginatedEquipmentPublic.filter(equipment => (filterSubcategory ? equipment.itemSubcategory === filterSubcategory : true) && (equipment.itemCategory.includes(filterCategory))).map(equipment => (
                                <tr key={equipment.compositeKey}>
                                    {paginatedEquipmentPublic.some(equipment => equipment.actions) ? (
                                        <td>{equipment.actions}</td>) : null}
                                    {paginatedEquipmentPublic.some(equipment => equipment.bulk) ? (
                                        <td>{equipment.bulk}</td>) : null}
                                    <td>{equipment.level}</td>
                                    <td>{equipment.name}</td>
                                    <td>{formatPrice(equipment.pp, equipment.gp, equipment.sp, equipment.cp)}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={equipment.rarity}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling her
                                        />
                                    </td>
                                    {paginatedEquipmentPublic.some(equipment => equipment.school) ? (
                                        <td>{equipment.school}</td>) : null}
                                    <td>{equipment.sourceRaw}</td>
                                    <td>
                                        {
                                            (() => {
                                                switch (equipment.itemSubcategory) {
                                                    case "Specific Magic Weapons":
                                                        return <TooltipHighlighterMutliple
                                                            text={equipment.text}
                                                            traitsData={weaponMultipleData}
                                                            object={"weapon"}
                                                        secondData={weaponMultipleData}
                                                        secondObject={"weapon"}/>; // Corrected object type
                                                    case "Specific Magic Armor":
                                                        return <TooltipHighlighterMutliple
                                                            text={equipment.text}
                                                            traitsData={armorMultipleData}
                                                            object={"armor"}
                                                            secondData={armorMultipleData}
                                                            secondObject={"armor"}/>;
                                                    default:
                                                        return equipment.text;
                                                }
                                            })()
                                        }
                                    </td>
                                    {paginatedEquipmentPublic.some(equipment => equipment.hands) ? (
                                        <td>{equipment.hands}</td>) : null}
                                    {paginatedEquipmentPublic.some(equipment => equipment.skill) ? (
                                        <td>{equipment.skill}</td>) : null}

                                    {paginatedEquipmentPublic.some(equipment => equipment.trait) ? (
                                        <td>
                                            <TooltipHighlighterWeapons
                                                text={equipment.trait}
                                                traitsData={traitsData}
                                                object={"trait"}
                                                tooltipStyles={{color: 'red'}} // You can customize styling her
                                            />
                                        </td>) : null}
                                    {
                                        equipment.isPrivate ? (
                                            <td>
                                                <button onClick={() => setEditingEquipment(equipment)}>Edit</button>
                                                <button onClick={() => handleDeleteEquipment(equipment.id)}>Delete</button>
                                            </td>
                                        ) : (
                                            isAdmin ? (
                                                <td>
                                                    <button onClick={() => setEditingPublicEquipment(equipment)}>Edit public equipment</button>
                                                    <button onClick={() => handleDeletePublicEquipment(equipment.id)}>Delete public equipment</button>
                                                </td>
                                            ) : null
                                        )
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No such equipment</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {isAdmin ? (
                        <button onClick={() => setShowAddPublicEquipmentForm(true)}>
                            Create public equipment
                        </button>
                    ) : null}
                </>
            )}

            {activeTable === 'yourEquipment' && (
                <>
                    <h2>Filter by</h2>
                    <div>
                        {categories.map(category => (
                            <button key={category} onClick={() => handleCategoryClick(category)}>
                                {category}
                            </button>
                        ))}
                        <button onClick={() => {
                            setFilteredEquipmentPublic(equipmentPublic);
                            setFilterCategory('');
                            setFilterSubcategory('');
                        }}>All equipment
                        </button>
                    </div>
                    {filterCategory && subcategoryButtons.length > 0 && (
                        <>
                            <h2>Subcategories for {filterCategory}</h2>
                            <div>
                                {subcategoryButtons.map((subcategory, index) => (
                                    <button key={index} onClick={() => handleSubcategoryClick(subcategory)}>
                                        {subcategory}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <h2>Search equipment</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <h2>Equipment</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Actions</th>
                            <th>Bulk</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>School</th>
                            <th>Source</th>
                            <th>Text</th>
                            <th>Hands</th>
                            <th>Skill</th>
                            <th>Trait</th>
                            <th>Item category</th>
                            <th>Item subcategory</th>
                            <th>Modify</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedEquipmentPrivate.length > 0 ? (
                            sortedEquipmentPrivate // Filtered based on selected category/subcategory
                                .filter(equipment =>
                                    (filterSubcategory ? equipment.itemSubcategory === filterSubcategory : true) &&
                                    (equipment.itemCategory.includes(filterCategory)) // Include existing category filtering
                                )
                                .map(equipment => (
                                    <tr key={equipment.id}>
                                        <td>{equipment.actions}</td>
                                        <td>{equipment.bulk}</td>
                                        <td>{equipment.level}</td>
                                        <td>{equipment.name}</td>
                                        <td>{formatPrice(equipment.pp, equipment.gp, equipment.sp, equipment.cp)}</td>
                                        <td>{equipment.rarity}</td>
                                        <td>{equipment.school}</td>
                                        <td>{equipment.sourceRaw}</td>
                                        <td>{equipment.text}</td>
                                        <td>{equipment.hands}</td>
                                        <td>{equipment.skill}</td>
                                        <td>
                                            <TooltipHighlighterWeapons
                                                text={equipment.trait}
                                                traitsData={traitsData}
                                                object={"trait"}
                                                tooltipStyles={{color: 'red'}} // You can customize styling her
                                            />
                                        </td>
                                        <td>{equipment.itemCategory}</td>
                                        <td>{equipment.itemSubcategory}</td>
                                        <td>
                                            <button onClick={() => setEditingEquipment(equipment)}>Edit</button>
                                            <button onClick={() => handleDeleteEquipment(equipment.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="9">No such equipment</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button onClick={() => setShowAddEquipmentForm(true)}>Create equipment
                    </button>
                </>
            )}

            {/*New button*/}
            {activeTable === 'Spells' && (
                <>
                    <div>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Arcane')
                        }
                        }>Arcane
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Divine')
                        }
                        }>Divine
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Elemental')
                        }
                        }>Elemental
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Occult')
                        }
                        }>Occult
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Primal')
                        }
                        }>Primal
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Focus')
                        }
                        }>Focus
                        </button>
                        <button onClick={() => {
                            resetIndex();
                            handleTraditionClick('Other')
                        }
                        }>Other
                        </button>
                        <button onClick={() => {
                            setFilteredSpells(Spells);  // If "Clear Filter" is clicked, show all spells
                            setFilterTradition('');
                            resetIndex();
                        }}>All Spells
                        </button>
                    </div>

                    <h2>Search spells</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <h2>Spells</h2>
                    <div>
                        {startIndex}---{startIndex + 50}<br/>
                        <button onClick={handlePrevious} disabled={startIndex === 0}>&lt; Previous</button>
                        <button onClick={handleNext}
                                disabled={startIndex + itemsPerPage >= sortedSpells.length}>Next &gt;</button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                            {paginatedSpells.some(spell => spell.bloodline) ? (<th>Bloodline</th>) : null}
                            <th>Component</th>
                            <th>Heighten</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Spell Range</th>
                            <th>Spell Range Raw</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Saving Throw</th>
                            <th>School</th>
                            <th>Source</th>
                            <th>Summary</th>
                            <th>Target</th>
                            <th>Text</th>
                            <th>Trait</th>
                            <th>Type</th>
                            { isAdmin ? (<th>Modify</th>) : null}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedSpells.length > 0 ? (
                            paginatedSpells.filter((spell) =>
                                filterTradition ? spell.tradition.includes(filterTradition) : true).map((spell) => (
                                <tr key={spell.id}>
                                    <td>{spell.name}</td>
                                    <td>{spell.actions}</td>
                                    {paginatedSpells.some(spell => spell.bloodline) ? (
                                        <td>{spell.bloodline}</td>) : null}
                                    <td>{spell.component}</td>
                                    <td>{spell.heighten}</td>
                                    <td>{spell.level}</td>
                                    <td>{spell.spellRange}</td>
                                    <td>{spell.rangeRaw}</td>
                                    <td>{spell.rarity}</td>
                                    <td>{spell.savingThrow}</td>
                                    <td>{spell.school}</td>
                                    <td>{spell.sourceRaw}</td>
                                    <td>{spell.summary}</td>
                                    <td>{spell.target}</td>
                                    <td>{spell.text}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={spell.trait}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{spell.type}</td>
                                    {
                                        isAdmin ? (
                                            <td>
                                                <button onClick={() => setEditingSpell({...spell})}>Edit public spell</button>
                                                <button onClick={() => handleDeleteSpell(spell.id)}>Delete spell</button>
                                            </td>
                                        ) : null
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No such spells</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {isAdmin ? (
                        <button onClick={() => setShowAddSpellForm(true)}>
                            Create spell
                        </button>
                    ) : null}
                </>
            )}


            {/*Set the armors and Your Armors  tables similiar to the way the weapons tables are set up*/}
            {activeTable === 'allArmors' && (
                <>
                    <h2>Search armors</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>All armors</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('ac')}>
                                AC {sortCriteria === 'ac' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Check Penalty</th>
                            <th>Dex Cap</th>
                            <th>Strength</th>
                            <th>Speed Penalty</th>
                            <th>Armor Category</th>
                            <th>Armor Group</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Bulk</th>
                            <th>Summary</th>
                            <th>Access</th>
                            <th>Traits</th>
                            <th>Source</th>
                            {sortedArmors.some(armor => armor.isPrivate || isAdmin) ? (<th>Modify</th>) : null}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedArmors.length > 0 ? (
                            sortedArmors.map((armor) => (
                                <tr key={armor.compositeKey}>
                                    <td>{armor.name}</td>
                                    <td>{armor.ac}</td>
                                    <td>{armor.checkPenalty}</td>
                                    <td>{armor.dexCap}</td>
                                    <td>{armor.strength}</td>
                                    <td>{armor.speedPenalty}</td>
                                    <td>{armor.armorCategory}</td>
                                    <td>{armor.armorGroup}</td>
                                    <td>{armor.level}</td>
                                    <td>{formatPrice(armor.pp, armor.gp, armor.sp, armor.cp)}</td>
                                    <td>{armor.rarity}</td>
                                    <td>{armor.bulk}</td>
                                    <td>{armor.text}</td>
                                    <td>{armor.access}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={armor.trait}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{armor.sourceRaw}</td>

                                    {
                                        armor.isPrivate ? (
                                            <td>
                                                <button onClick={() => setEditingArmor(armor)}>Edit</button>
                                                <button onClick={() => handleDeleteArmor(armor.id)}>Delete</button>
                                            </td>
                                        ) : (
                                            isAdmin ? (
                                                <td>
                                                    <button onClick={() => setEditingPublicArmor(armor)}>Edit public armor</button>
                                                    <button onClick={() => handleDeletePublicArmor(armor.id)}>Delete public armor</button>
                                                </td>
                                            ) : null
                                        )
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No such armor</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {isAdmin ? (
                    <button onClick={() => setShowAddPublicArmorForm(true)}>
                        Create public armor
                    </button>
                    ) : null}
                </>
            )}

            {activeTable === 'yourArmors' && (
                <>
                    <h2>Search armors</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2>Your armors</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('ac')}>
                                AC {sortCriteria === 'ac' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Check Penalty</th>
                            <th>Dex Cap</th>
                            <th>Strength</th>
                            <th>Speed Penalty</th>
                            <th>Armor Category</th>
                            <th>Armor Group</th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('level')}>
                                Level {sortCriteria === 'level' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
                                Price {sortCriteria === 'price' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>
                            <span style={{cursor: 'pointer'}} onClick={() => handleSort('rarity')}>
                                Rarity {sortCriteria === 'rarity' ? (sortDirection === 1 ? '↑' : sortDirection === 2 ? '↓' : '') : ''}
                            </span>
                            </th>
                            <th>Bulk</th>
                            <th>Summary</th>
                            <th>Access</th>
                            <th>Traits</th>
                            <th>Source</th>
                            <th>Modify</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedArmorsPrivate.length > 0 ? (
                            sortedArmorsPrivate.map((armor) => (
                                <tr key={armor.id}>
                                    <td>{armor.name}</td>
                                    <td>{armor.ac}</td>
                                    <td>{armor.checkPenalty}</td>
                                    <td>{armor.dexCap}</td>
                                    <td>{armor.strength}</td>
                                    <td>{armor.speedPenalty}</td>
                                    <td>{armor.armorCategory}</td>
                                    <td>{armor.armorGroup}</td>
                                    <td>{armor.level}</td>
                                    <td>{formatPrice(armor.pp, armor.gp, armor.sp, armor.cp)}</td>
                                    <td>{armor.rarity}</td>
                                    <td>{armor.bulk}</td>
                                    <td>{armor.text}</td>
                                    <td>{armor.access}</td>
                                    <td>
                                        <TooltipHighlighterWeapons
                                            text={armor.trait}
                                            traitsData={traitsData}
                                            object={"trait"}
                                            tooltipStyles={{color: 'red'}} // You can customize styling here

                                        />
                                    </td>
                                    <td>{armor.sourceRaw}</td>
                                    <td>
                                        <button onClick={() => setEditingArmor(armor)}>Edit</button>
                                        <button onClick={() => handleDeleteArmor(armor.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No armor</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button onClick={() => setShowAddArmorForm(true)}>Create armor</button>
                </>
            )}


            {isAdmin && editingSpell && (
                <div>
                    <h2> New weapon</h2>
                    <form onSubmit={handleUpdateSpell}>
                        Name:<input type="text" name="name" value={editingSpell.name} onChange={handleEditSpellChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}
                        <DynamicList
                            label="Bloodline"
                            fieldName="bloodline"
                            initialValue={editingSpell.bloodline}
                            options={spellBloodlines}
                            onChange={(newList) => handleDynamicListEditChange("spell", 'bloodline', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Component"
                            fieldName="component"
                            initialValue={editingSpell.component}
                            options={spellComponents}
                            onChange={(newList) => handleDynamicListEditChange("spell", 'component', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Heighten"
                            fieldName="heighten"
                            initialValue={editingSpell.heighten}
                            options={spellHeighten}
                            onChange={(newList) => handleDynamicListEditChange("spell", 'heighten', newList)}
                            showValueInput={false}
                        />
                        Circle level:
                        <input type="number" name="level" value={editingSpell.level || ''}
                               onChange={handleEditSpellChange} placeholder="Circle" min="1" max="10"/>
                        <RarityDropdown
                            value={editingSpell.rarity || ''}
                            onChange={handleEditSpellChange}
                        />
                        <DynamicList
                            label="Saving Throw"
                            fieldName="savingThrow"
                            initialValue={editingSpell.savingThrow}
                            options={spellSavingThrows}
                            onChange={(newList) => handleDynamicListEditChange("spell", 'savingThrow', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Tradition"
                            fieldName="tradition"
                            initialValue={editingSpell.tradition}
                            options={spellTraditions}
                            onChange={(newList) => handleDynamicListEditChange("spell", 'tradition', newList)}
                            showValueInput={false}
                        />
                        <SchoolDropdown
                            value={editingSpell.school || ''}
                            onChange={handleEditSpellChange}
                        />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={editingSpell.sourceRaw || ''}
                        onChange={handleEditSpellChange}
                        placeholder="Source"/>
                        Summary:<input
                        type="text"
                        name="summary"
                        value={editingSpell.summary || ''}
                        onChange={handleEditSpellChange}
                        placeholder="Summary"/>
                        Text:<input
                        type="text"
                        name="text"
                        value={editingSpell.text || ''}
                        onChange={handleEditSpellChange}
                        placeholder="Text"/>
                        <SpellTypeDropdown
                            value={editingSpell.type || ''}
                            onChange={handleEditSpellChange}/>
                        <button type="submit">Add spell</button>
                        <button type="button" onClick={() => {
                            setEditingSpell(null)
                        }}>Cancel</button>
                    </form>
                </div>
            )}
            {isAdmin && showAddSpellForm && (
                <div>
                    <h2> New weapon</h2>
                    <form onSubmit={handleAddSpell}>
                        Name:<input type="text" name="name" value={newSpell.name} onChange={handleSpellInputChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}
                        <DynamicList
                            label="Bloodline"
                            fieldName="bloodline"
                            initialValue={newSpell.bloodline}
                            options={spellBloodlines}
                            onChange={(newList) => handleDynamicListChange("spell", 'bloodline', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Component"
                            fieldName="component"
                            initialValue={newSpell.component}
                            options={spellComponents}
                            onChange={(newList) => handleDynamicListChange("spell", 'component', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Heighten"
                            fieldName="heighten"
                            initialValue={newSpell.heighten}
                            options={spellHeighten}
                            onChange={(newList) => handleDynamicListChange("spell", 'heighten', newList)}
                            showValueInput={false}
                        />
                        Circle level:
                        <input type="number" name="level" value={newSpell.level || ''}
                               onChange={handleSpellInputChange} placeholder="Circle" min="1" max="10"/>
                        <RarityDropdown
                            value={newSpell.rarity || ''}
                            onChange={handleSpellInputChange}
                        />
                        <DynamicList
                            label="Saving Throw"
                            fieldName="savingThrow"
                            initialValue={newSpell.savingThrow}
                            options={spellSavingThrows}
                            onChange={(newList) => handleDynamicListChange("spell", 'savingThrow', newList)}
                            showValueInput={false}
                        />
                        <DynamicList
                            label="Tradition"
                            fieldName="tradition"
                            initialValue={newSpell.tradition}
                            options={spellTraditions}
                            onChange={(newList) => handleDynamicListChange("spell", 'tradition', newList)}
                            showValueInput={false}
                        />
                        <SchoolDropdown
                            value={newSpell.school || ''}
                            onChange={handleSpellInputChange}
                        />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={newSpell.sourceRaw || ''}
                        onChange={handleSpellInputChange}
                        placeholder="Source"/>
                        Summary:<input
                        type="text"
                        name="summary"
                        value={newSpell.summary || ''}
                        onChange={handleSpellInputChange}
                        placeholder="Summary"/>
                        Text:<input
                        type="text"
                        name="text"
                        value={newSpell.text || ''}
                        onChange={handleSpellInputChange}
                        placeholder="Text"/>
                        <SpellTypeDropdown
                            value={newSpell.type || ''}
                            onChange={handleSpellInputChange}/>
                        <button type="submit">Add spell</button>
                        <button type="button" onClick={() => {
                            setShowAddSpellForm(false)
                            setNewSpell(defaultSpellState)
                        }}>Cancel</button>
                    </form>
                </div>
            )}

















            {showAddWeaponForm && (
                <div>
                    <h2> New weapon</h2>
                    <form onSubmit={handleAddWeapon}>
                        Name:<input type="text" name="name" value={newWeapon.name} onChange={handleWeaponInputChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Damage:<input
                        type="text"
                        name="damage"
                        value={damageInput || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="Damage (e.g., 3d12)"
                    />
                        Hands:<input type="number" name="hands" value={newWeapon.hands || ''}
                                     onChange={handleWeaponInputChange}
                                     placeholder="Hands" min="0"/>
                        <WeaponCategoryDropdown
                            value={newWeapon.weaponCategory || ''}
                            onChange={handleWeaponInputChange}
                        />
                        <WeaponGroupDropdown
                            value={newWeapon.weaponGroup || ''}
                            onChange={handleWeaponInputChange}
                        />
                        <WeaponTypeDropdown
                            value={newWeapon.weaponType || ''}
                            onChange={handleWeaponInputChange}
                        />
                        Level:<input type="number" name="level" value={newWeapon.level || ''}
                                     onChange={handleWeaponInputChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newWeapon.pp || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newWeapon.gp || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newWeapon.sp || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newWeapon.cp || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newWeapon.rarity || ''}
                            onChange={handleWeaponInputChange}
                        />
                        Summary:<input type="text" name="text" value={newWeapon.text || ''}
                                       onChange={handleWeaponInputChange}
                                       placeholder="Summary"/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newWeapon.trait}
                            options={weaponTraits}
                            onChange={(newList) => handleDynamicListChange("weapon", 'trait', newList)}
                            showValueInput={false}
                        />
                        {/*                        Traits:<input type="text" name="trait" value={newWeapon.trait || ''} onChange={handleWeaponInputChange}
                               placeholder="Traits"/>*/}
                        Access:<input
                        type="text"
                        name="access"
                        value={newWeapon.access || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="access"
                    />
                        Bulk:<input
                        type="number"
                        name="bulk"
                        value={newWeapon.bulk || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="Bulk"
                    />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={newWeapon.sourceRaw || ''}
                        onChange={handleWeaponInputChange}
                        placeholder="Source"
                    />
                        <button type="submit">Add weapon</button>
                        <button type="button" onClick={() => {
                            setShowAddWeaponForm(false)
                            setNewWeapon(defaultWeaponState)
                        }}>Cancel</button>
                    </form>
                </div>
            )}


            {showAddArmorForm && (
                <div>
                    <h2>New armor</h2>
                    <form onSubmit={handleAddArmor}>
                        Name:<input type="text" name="name" value={newArmor.name || ''}
                                    onChange={handleArmorInputChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Armor Class:<input type="number" name="ac" value={newArmor.ac || ''}
                                           onChange={handleArmorInputChange}
                                           placeholder="Armor Class" min="0"/>
                        Check Penalty:<input
                        type="number"
                        name="checkPenalty"
                        value={newArmor.checkPenalty || ''}
                        onChange={handleArmorInputChange}
                        placeholder="Check Penalty"
                        max="0"
                    />
                        Dexterity Cap:<input type="number" name="dexCap" value={newArmor.dexCap || ''}
                                             onChange={handleArmorInputChange}
                                             placeholder="Dexterity Cap" min="0"/>
                        Strength:<input type="number" name="strength" value={newArmor.strength || ''}
                                        onChange={handleArmorInputChange}
                                        placeholder="Strength" min="0"/>
                        Speed Penalty:<input
                        type="number"
                        name="speedPenalty"
                        value={newArmor.speedPenalty || ''}
                        onChange={handleArmorInputChange}
                        placeholder="Speed Penalty"
                        max="0"
                    />
                        <ArmorCategoryDropdown
                            value={newArmor.armorCategory || ''}
                            onChange={handleArmorInputChange}
                        />
                        <ArmorGroupDropdown
                            value={newArmor.armorGroup || ''}
                            onChange={handleArmorInputChange}
                        />
                        Level:<input type="number" name="level" value={newArmor.level || ''}
                                     onChange={handleArmorInputChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newArmor.pp || ''}
                        onChange={handleArmorInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newArmor.gp || ''}
                        onChange={handleArmorInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newArmor.sp || ''}
                        onChange={handleArmorInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newArmor.cp || ''}
                        onChange={handleArmorInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newArmor.rarity || ''}
                            onChange={handleArmorInputChange}
                        />
                        Bulk:<input type="number" name="bulk" value={newArmor.bulk || ''}
                                    onChange={handleArmorInputChange}
                                    placeholder="Bulk"/>
                        Summary:<input type="text" name="text" value={newArmor.text || ''}
                                       onChange={handleArmorInputChange}
                                       placeholder="Summary"/>
                        Access:<input type="text" name="access" value={newArmor.access || ''}
                                      onChange={handleArmorInputChange}
                                      placeholder="Access"/>
                        {/*                        Traits:<input type="text" name="trait" value={newArmor.trait || ''} onChange={handleArmorInputChange}
                               placeholder="Traits"/>*/}
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newArmor.trait}
                            options={armorTraits}
                            onChange={(newList) => handleDynamicListChange("armor", 'trait', newList)}
                            showValueInput={false}
                        />

                        Source:<input type="text" name="sourceRaw" value={newArmor.sourceRaw || ''}
                                      onChange={handleArmorInputChange} placeholder="Source"/>
                        <button type="submit">Add armor</button>
                        <button type="button" onClick={() => {
                            setShowAddArmorForm(false)
                            setNewArmor(defaultArmorState)
                        }}>Cancel</button>
                    </form>
                </div>
            )}

            {editingWeapon && (
                <div>
                    <h2>Edit weapon</h2>
                    <form onSubmit={handleUpdateWeapon}>
                        <input type="hidden" name="id" value={editingWeapon.id || ''}/>
                        Name:<input
                        type="text"
                        name="name"
                        value={editingWeapon.name || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Name"
                        required
                    />
                        {renderNameFormError()}

                        Damage:<input
                        type="text"
                        name="damage"
                        value={damageInput || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Damage (e.g., 3d12)"
                    />
                        Hands:<input
                        type="number"
                        name="hands"
                        value={editingWeapon.hands || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Hands"
                        min="0"
                    />
                        <WeaponCategoryDropdown
                            value={editingWeapon.weaponCategory || ''}
                            onChange={handleEditWeaponChange}
                        />
                        <WeaponGroupDropdown
                            value={editingWeapon.weaponGroup || ''}
                            onChange={handleEditWeaponChange}
                        />
                        <WeaponTypeDropdown
                            value={editingWeapon.weaponType || ''}
                            onChange={handleEditWeaponChange}
                        />
                        Level:<input
                        type="number"
                        name="level"
                        value={editingWeapon.level || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Level"
                        min="0"
                    />
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingWeapon.pp || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingWeapon.gp || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingWeapon.sp || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingWeapon.cp || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingWeapon.rarity || ''}
                            onChange={handleEditWeaponChange}
                        />

                        Summary:<input
                        type="text"
                        name="text"
                        value={editingWeapon.text || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Summary"
                    />

                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingWeapon.trait}
                            options={weaponTraits}
                            onChange={(newList) => handleDynamicListEditChange("weapon", 'trait', newList)}
                            showValueInput={false}
                        />
                        Access:<input
                        type="text"
                        name="access"
                        value={editingWeapon.access || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Access"
                    />
                        Bulk:<input
                        type="number"
                        name="bulk"
                        value={editingWeapon.bulk || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Bulk"
                    />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={editingWeapon.sourceRaw || ''}
                        onChange={handleEditWeaponChange}
                        placeholder="Source"
                    />
                        <button type="submit">Update weapon</button>
                        <button type="button" onClick={() => setEditingWeapon(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {editingArmor && (
                <div>
                    <h2>Edit armor</h2>
                    <form onSubmit={handleUpdateArmor}>
                        Name:<input type="text" name="name" value={editingArmor.name || ''}
                                    onChange={handleEditArmorChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Armor Class:<input type="number" name="ac" value={editingArmor.ac || ''}
                                           onChange={handleEditArmorChange}
                                           placeholder="Armor Class" min="0"/>
                        Check Penalty:<input
                        type="number"
                        name="checkPenalty"
                        value={editingArmor.checkPenalty || ''}
                        onChange={handleEditArmorChange}
                        placeholder="Check Penalty"
                        max="0"
                    />
                        Dexterity Cap:<input type="number" name="dexCap" value={editingArmor.dexCap || ''}
                                             onChange={handleEditArmorChange}
                                             placeholder="Dexterity Cap" min="0"/>
                        Strength:<input type="number" name="strength" value={editingArmor.strength || ''}
                                        onChange={handleEditArmorChange}
                                        placeholder="Strength" min="0"/>
                        Speed Penalty:<input
                        type="number"
                        name="speedPenalty"
                        value={editingArmor.speedPenalty || ''}
                        onChange={handleEditArmorChange}
                        placeholder="Speed Penalty"
                        max="0"
                    />
                        <ArmorCategoryDropdown
                            value={editingArmor.armorCategory || ''}
                            onChange={handleEditArmorChange}
                        />
                        <ArmorGroupDropdown
                            value={editingArmor.armorGroup || ''}
                            onChange={handleEditArmorChange}
                        />
                        Level:<input type="number" name="level" value={editingArmor.level || ''}
                                     onChange={handleEditArmorChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingArmor.pp || ''}
                        onChange={handleEditArmorChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingArmor.gp || ''}
                        onChange={handleEditArmorChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingArmor.sp || ''}
                        onChange={handleEditArmorChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingArmor.cp || ''}
                        onChange={handleEditArmorChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingArmor.rarity || ''}
                            onChange={handleEditArmorChange}
                        />
                        Bulk:<input type="number" name="bulk" value={editingArmor.bulk || ''}
                                    onChange={handleEditArmorChange}
                                    placeholder="Bulk"/>
                        Summary:<input type="text" name="text" value={editingArmor.text || ''}
                                       onChange={handleEditArmorChange}
                                       placeholder="Summary"/>
                        Access:<input type="text" name="access" value={editingArmor.access || ''}
                                      onChange={handleEditArmorChange}
                                      placeholder="Access"/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingArmor.trait}
                            options={armorTraits}
                            onChange={(newList) => handleDynamicListEditChange("armor", 'trait', newList)}
                            showValueInput={false}
                        />
                        Source:<input type="text" name="sourceRaw" value={editingArmor.sourceRaw || ''}
                                      onChange={handleEditArmorChange} placeholder="Source"/>
                        <button type="submit">Update armor</button>
                        <button type="button" onClick={() => setEditingArmor(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {showAddEquipmentForm && (
                <div>
                    <h2>New equipment</h2>
                    <form onSubmit={handleAddEquipment}>
                        Name:<input type="text" name="name" value={newEquipment.name}
                                    onChange={handleEquipmentInputChange} placeholder="Name" required/>
                        {renderNameFormError()}

                        Actions:<input type="text" name="actions" value={newEquipment.actions || ''}
                                       onChange={handleEquipmentInputChange} placeholder="Actions"/>
                        Bulk:<input type="number" name="bulk" value={newEquipment.bulk || ''}
                                    onChange={handleEquipmentInputChange} placeholder="Bulk"/>
                        School:<input type="text" name="school" value={newEquipment.school || ''}
                                      onChange={handleEquipmentInputChange} placeholder="School"/>
                        Source Raw:<input type="text" name="sourceRaw" value={newEquipment.sourceRaw || ''}
                                          onChange={handleEquipmentInputChange} placeholder="Source Raw"/>
                        Description:<input type="text" name="text" value={newEquipment.text || ''}
                                           onChange={handleEquipmentInputChange} placeholder="Description"/>
                        Hands:<input type="number" name="hands" value={newEquipment.hands || ''}
                                     onChange={handleEquipmentInputChange} placeholder="Hands"/>
                        Skill:<input type="text" name="skill" value={newEquipment.skill || ''}
                                     onChange={handleEquipmentInputChange} placeholder="Skill"/>
                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            subcategoryButtons={subcategoryButtons}
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                        />
                        Level:<input type="number" name="level" value={newEquipment.level || ''}
                                     onChange={handleEquipmentInputChange} placeholder="Level"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newEquipment.pp || ''}
                        onChange={handleEquipmentInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newEquipment.gp || ''}
                        onChange={handleEquipmentInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newEquipment.sp || ''}
                        onChange={handleEquipmentInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newEquipment.cp || ''}
                        onChange={handleEquipmentInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newEquipment.rarity || ''}
                            onChange={handleEquipmentInputChange}
                        />
                        <br/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newEquipment.trait}
                            options={equipmentTraits}
                            onChange={(newList) => handleDynamicListChange("equipment", 'trait', newList)}
                            showValueInput={false}
                        />
                        {/*                        Traits:<input type="text" name="trait" value={newEquipment.trait || ''} onChange={handleEquipmentInputChange}
                               placeholder="Traits"/>*/}
                        <button type="submit">Add equipment</button>
                        <button type="button"
                                onClick={() => {
                                    setShowAddEquipmentForm(false)
                                    resetCategoryInputs()
                                    setNewEquipment(defaultEquipmentState)
                                }}>Cancel
                        </button>
                    </form>
                </div>
            )}


            {editingEquipment && (
                <div>
                    <h2>Edit equipment</h2>
                    <form onSubmit={handleUpdateEquipment}>
                        <input type="hidden" name="id" value={editingEquipment.id || ''}/>
                        Name:<input type="text" name="name"
                                    required value={editingEquipment.name || ''}
                                    onChange={handleEditEquipmentChange} placeholder="Name"/>
                        {renderNameFormError()}

                        Actions:<input type="text" name="actions" value={editingEquipment.actions || ''}
                                       onChange={handleEditEquipmentChange} placeholder="Actions"/>
                        Bulk:<input type="number" name="bulk" value={editingEquipment.bulk || ''}
                                    onChange={handleEditEquipmentChange} placeholder="Bulk"/>
                        School:<input type="text" name="school" value={editingEquipment.school || ''}
                                      onChange={handleEditEquipmentChange} placeholder="School"/>
                        Source Raw:<input type="text" name="sourceRaw" value={editingEquipment.sourceRaw || ''}
                                          onChange={handleEditEquipmentChange} placeholder="Source Raw"/>
                        Description:<input type="text" name="text" value={editingEquipment.text || ''}
                                           onChange={handleEditEquipmentChange} placeholder="Description"/>
                        Hands:<input type="number" name="hands" value={editingEquipment.hands || ''}
                                     onChange={handleEditEquipmentChange} placeholder="Hands"/>
                        Skill:<input type="text" name="skill" value={editingEquipment.skill || ''}
                                     onChange={handleEditEquipmentChange} placeholder="Skill"/>

                        Level:<input type="number" name="level" value={editingEquipment.level || ''}
                                     onChange={handleEditEquipmentChange} placeholder="Level"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingEquipment.pp || ''}
                        onChange={handleEditEquipmentChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingEquipment.gp || ''}
                        onChange={handleEditEquipmentChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingEquipment.sp || ''}
                        onChange={handleEditEquipmentChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingEquipment.cp || ''}
                        onChange={handleEditEquipmentChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingEquipment.rarity || ''}
                            onChange={handleEditEquipmentChange}
                        />

                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            subcategoryButtons={subcategoryButtons}
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                            editingEquipment={editingPublicEquipment}
                        />
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingEquipment.trait}
                            options={equipmentTraits}
                            onChange={(newList) => handleDynamicListEditChange("equipment", 'trait', newList)}
                            showValueInput={false}
                        /><br/>
                        <button type="submit">Update equipment</button>
                        <button type="button"
                                onClick={() => setEditingEquipment(null) || resetCategoryInputs()}>Cancel
                        </button>
                    </form>
                </div>
            )}


























            {isAdmin && showAddPublicWeaponForm && (
                <div>
                    <h2> New weapon</h2>
                    <form onSubmit={handleAddPublicWeapon}>
                        Name:<input type="text" name="name" value={newPublicWeapon.name} onChange={handleWeaponPublicInputChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Damage:<input
                        type="text"
                        name="damage"
                        value={damagePublicInput || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="Damage (e.g., 3d12)"
                    />
                        Hands:<input type="number" name="hands" value={newPublicWeapon.hands || ''}
                                     onChange={handleWeaponPublicInputChange}
                                     placeholder="Hands" min="0"/>
                        <WeaponCategoryDropdown
                            value={newPublicWeapon.weaponCategory || ''}
                            onChange={handleWeaponPublicInputChange}
                        />
                        <WeaponGroupDropdown
                            value={newPublicWeapon.weaponGroup || ''}
                            onChange={handleWeaponPublicInputChange}
                        />
                        <WeaponTypeDropdown
                            value={newPublicWeapon.weaponType || ''}
                            onChange={handleWeaponPublicInputChange}
                        />
                        Level:<input type="number" name="level" value={newPublicWeapon.level || ''}
                                     onChange={handleWeaponPublicInputChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newPublicWeapon.pp || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newPublicWeapon.gp || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newPublicWeapon.sp || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newPublicWeapon.cp || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newPublicWeapon.rarity || ''}
                            onChange={handleWeaponPublicInputChange}
                        />
                        Summary:<input type="text" name="text" value={newPublicWeapon.text || ''}
                                       onChange={handleWeaponPublicInputChange}
                                       placeholder="Summary"/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newPublicWeapon.trait}
                            options={weaponTraits}
                            onChange={(newList) => handleDynamicPublicListChange("weapon", 'trait', newList)}
                            showValueInput={false}
                        />
                        Access:<input
                        type="text"
                        name="access"
                        value={newPublicWeapon.access || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="access"
                    />
                        Bulk:<input
                        type="number"
                        name="bulk"
                        value={newPublicWeapon.bulk || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="Bulk"
                    />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={newPublicWeapon.sourceRaw || ''}
                        onChange={handleWeaponPublicInputChange}
                        placeholder="Source"
                    />
                        <button type="submit">Add weapon</button>
                        <button type="button" onClick={() => {
                            setShowAddPublicWeaponForm(false)
                            setNewPublicWeapon(defaultWeaponState)
                        }}>Cancel</button>
                    </form>
                </div>
            )}

            {isAdmin && showAddPublicArmorForm && (
                <div>
                    <h2>New armor</h2>
                    <form onSubmit={handleAddPublicArmor}>
                        Name:<input type="text" name="name" value={newPublicArmor.name || ''}
                                    onChange={handleArmorPublicInputChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Armor Class:<input type="number" name="ac" value={newPublicArmor.ac || ''}
                                           onChange={handleArmorPublicInputChange}
                                           placeholder="Armor Class" min="0"/>
                        Check Penalty:<input
                        type="number"
                        name="checkPenalty"
                        value={newPublicArmor.checkPenalty || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="Check Penalty"
                        max="0"
                    />
                        Dexterity Cap:<input type="number" name="dexCap" value={newPublicArmor.dexCap || ''}
                                             onChange={handleArmorPublicInputChange}
                                             placeholder="Dexterity Cap" min="0"/>
                        Strength:<input type="number" name="strength" value={newPublicArmor.strength || ''}
                                        onChange={handleArmorPublicInputChange}
                                        placeholder="Strength" min="0"/>
                        Speed Penalty:<input
                        type="number"
                        name="speedPenalty"
                        value={newPublicArmor.speedPenalty || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="Speed Penalty"
                        max="0"
                    />
                        <ArmorCategoryDropdown
                            value={newPublicArmor.armorCategory || ''}
                            onChange={handleArmorPublicInputChange}
                        />
                        <ArmorGroupDropdown
                            value={newPublicArmor.armorGroup || ''}
                            onChange={handleArmorPublicInputChange}
                        />
                        Level:<input type="number" name="level" value={newPublicArmor.level || ''}
                                     onChange={handleArmorPublicInputChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newPublicArmor.pp || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newPublicArmor.gp || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newPublicArmor.sp || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newPublicArmor.cp || ''}
                        onChange={handleArmorPublicInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newPublicArmor.rarity || ''}
                            onChange={handleArmorPublicInputChange}
                        />
                        Bulk:<input type="number" name="bulk" value={newPublicArmor.bulk || ''}
                                    onChange={handleArmorPublicInputChange}
                                    placeholder="Bulk"/>
                        Summary:<input type="text" name="text" value={newPublicArmor.text || ''}
                                       onChange={handleArmorPublicInputChange}
                                       placeholder="Summary"/>
                        Access:<input type="text" name="access" value={newPublicArmor.access || ''}
                                      onChange={handleArmorPublicInputChange}
                                      placeholder="Access"/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newPublicArmor.trait}
                            options={armorTraits}
                            onChange={(newList) => handleDynamicPublicListChange("armor", 'trait', newList)}
                            showValueInput={false}
                        />

                        Source:<input type="text" name="sourceRaw" value={newPublicArmor.sourceRaw || ''}
                                      onChange={handleArmorPublicInputChange} placeholder="Source"/>
                        <button type="submit">Add armor</button>
                        <button type="button" onClick={() => {
                            setShowAddPublicArmorForm(false)
                            setNewPublicArmor(defaultArmorState)
                        }}>Cancel</button>
                    </form>
                </div>
            )}


            {isAdmin && editingPublicWeapon && (
                <div>
                    <h2>Edit weapon</h2>
                    <form onSubmit={handleUpdatePublicWeapon}>
                        <input type="hidden" name="id" value={editingPublicWeapon.id || ''}/>
                        Name:<input
                        type="text"
                        name="name"
                        value={editingPublicWeapon.name || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Name"
                        required
                    />
                        {renderNameFormError()}

                        Damage:<input
                        type="text"
                        name="damage"
                        value={damagePublicInput || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Damage (e.g., 3d12)"
                    />
                        Hands:<input
                        type="number"
                        name="hands"
                        value={editingPublicWeapon.hands || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Hands"
                        min="0"
                    />
                        <WeaponCategoryDropdown
                            value={editingPublicWeapon.weaponCategory || ''}
                            onChange={handleEditPublicWeaponChange}
                        />
                        <WeaponGroupDropdown
                            value={editingPublicWeapon.weaponGroup || ''}
                            onChange={handleEditPublicWeaponChange}
                        />
                        <WeaponTypeDropdown
                            value={editingPublicWeapon.weaponType || ''}
                            onChange={handleEditPublicWeaponChange}
                        />
                        Level:<input
                        type="number"
                        name="level"
                        value={editingPublicWeapon.level || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Level"
                        min="0"
                    />
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingPublicWeapon.pp || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingPublicWeapon.gp || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingPublicWeapon.sp || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingPublicWeapon.cp || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingPublicWeapon.rarity || ''}
                            onChange={handleEditPublicWeaponChange}
                        />

                        Summary:<input
                        type="text"
                        name="text"
                        value={editingPublicWeapon.text || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Summary"
                    />

                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingPublicWeapon.trait}
                            options={weaponTraits}
                            onChange={(newList) => handleDynamicPublicListEditChange("weapon", 'trait', newList)}
                            showValueInput={false}
                        />
                        Access:<input
                        type="text"
                        name="access"
                        value={editingPublicWeapon.access || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Access"
                    />
                        Bulk:<input
                        type="number"
                        name="bulk"
                        value={editingPublicWeapon.bulk || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Bulk"
                    />
                        Source:<input
                        type="text"
                        name="sourceRaw"
                        value={editingPublicWeapon.sourceRaw || ''}
                        onChange={handleEditPublicWeaponChange}
                        placeholder="Source"
                    />
                        <button type="submit">Update weapon</button>
                        <button type="button" onClick={() => setEditingPublicWeapon(null)}>Cancel</button>
                    </form>
                </div>
            )}


            {isAdmin && editingPublicArmor && (
                <div>
                    <h2>Edit armor</h2>
                    <form onSubmit={handleUpdatePublicArmor}>
                        Name:<input type="text" name="name" value={editingPublicArmor.name || ''}
                                    onChange={handleEditPublicArmorChange}
                                    placeholder="Name" required/>
                        {renderNameFormError()}

                        Armor Class:<input type="number" name="ac" value={editingPublicArmor.ac || ''}
                                           onChange={handleEditPublicArmorChange}
                                           placeholder="Armor Class" min="0"/>
                        Check Penalty:<input
                        type="number"
                        name="checkPenalty"
                        value={editingPublicArmor.checkPenalty || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="Check Penalty"
                        max="0"
                    />
                        Dexterity Cap:<input type="number" name="dexCap" value={editingPublicArmor.dexCap || ''}
                                             onChange={handleEditPublicArmorChange}
                                             placeholder="Dexterity Cap" min="0"/>
                        Strength:<input type="number" name="strength" value={editingPublicArmor.strength || ''}
                                        onChange={handleEditPublicArmorChange}
                                        placeholder="Strength" min="0"/>
                        Speed Penalty:<input
                        type="number"
                        name="speedPenalty"
                        value={editingPublicArmor.speedPenalty || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="Speed Penalty"
                        max="0"
                    />
                        <ArmorCategoryDropdown
                            value={editingPublicArmor.armorCategory || ''}
                            onChange={handleEditPublicArmorChange}
                        />
                        <ArmorGroupDropdown
                            value={editingPublicArmor.armorGroup || ''}
                            onChange={handleEditPublicArmorChange}
                        />
                        Level:<input type="number" name="level" value={editingPublicArmor.level || ''}
                                     onChange={handleEditPublicArmorChange}
                                     placeholder="Level" min="0"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingPublicArmor.pp || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingPublicArmor.gp || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingPublicArmor.sp || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingPublicArmor.cp || ''}
                        onChange={handleEditPublicArmorChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingPublicArmor.rarity || ''}
                            onChange={handleEditPublicArmorChange}
                        />
                        Bulk:<input type="number" name="bulk" value={editingPublicArmor.bulk || ''}
                                    onChange={handleEditPublicArmorChange}
                                    placeholder="Bulk"/>
                        Summary:<input type="text" name="text" value={editingPublicArmor.text || ''}
                                       onChange={handleEditPublicArmorChange}
                                       placeholder="Summary"/>
                        Access:<input type="text" name="access" value={editingPublicArmor.access || ''}
                                      onChange={handleEditPublicArmorChange}
                                      placeholder="Access"/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingPublicArmor.trait}
                            options={armorTraits}
                            onChange={(newList) => handleDynamicPublicListEditChange("armor", 'trait', newList)}
                            showValueInput={false}
                        />
                        Source:<input type="text" name="sourceRaw" value={editingPublicArmor.sourceRaw || ''}
                                      onChange={handleEditPublicArmorChange} placeholder="Source"/>
                        <button type="submit">Update armor</button>
                        <button type="button" onClick={() => setEditingPublicArmor(null)}>Cancel</button>
                    </form>
                </div>
            )}


            {isAdmin && showAddPublicEquipmentForm && (
                <div>
                    <h2>New equipment</h2>
                    <form onSubmit={handleAddPublicEquipment}>
                        Name:<input type="text" name="name" value={newPublicEquipment.name}
                                    onChange={handleEquipmentPublicInputChange} placeholder="Name" required/>
                        {renderNameFormError()}

                        Actions:<input type="text" name="actions" value={newPublicEquipment.actions || ''}
                                       onChange={handleEquipmentPublicInputChange} placeholder="Actions"/>
                        Bulk:<input type="number" name="bulk" value={newPublicEquipment.bulk || ''}
                                    onChange={handleEquipmentPublicInputChange} placeholder="Bulk"/>
                        School:<input type="text" name="school" value={newPublicEquipment.school || ''}
                                      onChange={handleEquipmentPublicInputChange} placeholder="School"/>
                        Source Raw:<input type="text" name="sourceRaw" value={newPublicEquipment.sourceRaw || ''}
                                          onChange={handleEquipmentPublicInputChange} placeholder="Source Raw"/>
                        Description:<input type="text" name="text" value={newPublicEquipment.text || ''}
                                           onChange={handleEquipmentPublicInputChange} placeholder="Description"/>
                        Hands:<input type="number" name="hands" value={newPublicEquipment.hands || ''}
                                     onChange={handleEquipmentPublicInputChange} placeholder="Hands"/>
                        Skill:<input type="text" name="skill" value={newPublicEquipment.skill || ''}
                                     onChange={handleEquipmentPublicInputChange} placeholder="Skill"/>
                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            subcategoryButtons={subcategoryButtons}
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                        />
                        Level:<input type="number" name="level" value={newPublicEquipment.level || ''}
                                     onChange={handleEquipmentPublicInputChange} placeholder="Level"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={newPublicEquipment.pp || ''}
                        onChange={handleEquipmentPublicInputChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={newPublicEquipment.gp || ''}
                        onChange={handleEquipmentPublicInputChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={newPublicEquipment.sp || ''}
                        onChange={handleEquipmentPublicInputChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={newPublicEquipment.cp || ''}
                        onChange={handleEquipmentPublicInputChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={newPublicEquipment.rarity || ''}
                            onChange={handleEquipmentPublicInputChange}
                        />
                        <br/>
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={newPublicEquipment.trait}
                            options={equipmentTraits}
                            onChange={(newList) => handleDynamicPublicListChange("equipment", 'trait', newList)}
                            showValueInput={false}
                        />
                        {/*                        Traits:<input type="text" name="trait" value={newEquipment.trait || ''} onChange={handleEquipmentInputChange}
                               placeholder="Traits"/>*/}
                        <button type="submit">Add equipment</button>
                        <button type="button"
                                onClick={() => {
                                    setShowAddPublicEquipmentForm(false)
                                    resetCategoryInputs()
                                    setNewPublicEquipment(defaultEquipmentState)
                                }}>Cancel
                        </button>
                    </form>
                </div>
            )}

            {isAdmin && editingPublicEquipment && (
                <div>
                    <h2>Edit equipment</h2>
                    <form onSubmit={handleUpdatePublicEquipment}>
                        <input type="hidden" name="id" value={editingPublicEquipment.id || ''}/>
                        Name:<input type="text" name="name"
                                    required value={editingPublicEquipment.name || ''}
                                    onChange={handleEditPublicEquipmentChange} placeholder="Name"/>
                        {renderNameFormError()}

                        Actions:<input type="text" name="actions" value={editingPublicEquipment.actions || ''}
                                       onChange={handleEditPublicEquipmentChange} placeholder="Actions"/>
                        Bulk:<input type="number" name="bulk" value={editingPublicEquipment.bulk || ''}
                                    onChange={handleEditPublicEquipmentChange} placeholder="Bulk"/>
                        School:<input type="text" name="school" value={editingPublicEquipment.school || ''}
                                      onChange={handleEditPublicEquipmentChange} placeholder="School"/>
                        Source Raw:<input type="text" name="sourceRaw" value={editingPublicEquipment.sourceRaw || ''}
                                          onChange={handleEditPublicEquipmentChange} placeholder="Source Raw"/>
                        Description:<input type="text" name="text" value={editingPublicEquipment.text || ''}
                                           onChange={handleEditPublicEquipmentChange} placeholder="Description"/>
                        Hands:<input type="number" name="hands" value={editingPublicEquipment.hands || ''}
                                     onChange={handleEditPublicEquipmentChange} placeholder="Hands"/>
                        Skill:<input type="text" name="skill" value={editingPublicEquipment.skill || ''}
                                     onChange={handleEditPublicEquipmentChange} placeholder="Skill"/>
                        Level:<input type="number" name="level" value={editingPublicEquipment.level || ''}
                                     onChange={handleEditPublicEquipmentChange} placeholder="Level"/>
                        Price: Platinum pieces:<input
                        type="number"
                        name="pp"
                        value={editingPublicEquipment.pp || ''}
                        onChange={handleEditPublicEquipmentChange}
                        placeholder="pp"
                        min="0"
                    />Gold pieces:<input
                        type="number"
                        name="gp"
                        value={editingPublicEquipment.gp || ''}
                        onChange={handleEditPublicEquipmentChange}
                        placeholder="gp"
                        min="0"
                    />Silver pieces:<input
                        type="number"
                        name="sp"
                        value={editingPublicEquipment.sp || ''}
                        onChange={handleEditPublicEquipmentChange}
                        placeholder="sp"
                        min="0"
                    />Copper pieces:<input
                        type="number"
                        name="cp"
                        value={editingPublicEquipment.cp || ''}
                        onChange={handleEditPublicEquipmentChange}
                        placeholder="cp"
                        min="0"
                    />
                        <RarityDropdown
                            value={editingPublicEquipment.rarity || ''}
                            onChange={handleEditPublicEquipmentChange}
                        />

                        <CategoryDropdown
                            selectedCategory={selectedCategory}
                            handleCategoryChange={handleCategoryChange}
                            subcategoryButtons={subcategoryButtons}
                            selectedSubcategory={selectedSubcategory}
                            setSelectedSubcategory={setSelectedSubcategory}
                            editingEquipment={editingPublicEquipment}
                        />
                        <DynamicList
                            label="Traits"
                            fieldName="trait"
                            initialValue={editingPublicEquipment.trait}
                            options={equipmentTraits}
                            onChange={(newList) => handleDynamicPublicListEditChange("equipment", 'trait', newList)}
                            showValueInput={false}
                        /><br/>
                        <button type="submit">Update equipment</button>
                        <button type="button"
                                onClick={() => setEditingPublicEquipment(null) || resetCategoryInputs()}>Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ItemsPage;

