import React from 'react';
import './Table.css'; // Optional CSS for defaults

export function TooltipHighlighterWeapons({ text, label, traitsData, textStyles = {}, tooltipStyles = {}, object }) {
    const createHighlightedText = () => {
        if (object === "trait") {
            // Trait handling (remains unchanged)
            const traits = Object.keys(traitsData);
            const regex = new RegExp(`\\b(${traits.join('|')})\\b`, 'gi'); // 'gi' flag for case-insensitive matching

            return text.split(regex).map((part, index) => {
                const lowercasePart = part.toLowerCase();
                const traitKey = Object.keys(traitsData).find(key => key.toLowerCase() === lowercasePart);
                if (traitKey) {
                    const tooltipText = traitsData[traitKey];
                    return (
                        <span key={index} className="highlighted-trait" style={textStyles}>
                            {part}
                            <span className="tooltip" style={tooltipStyles}>{tooltipText}</span>
                        </span>
                    );
                }
                return part;
            });
        } else {
            // Weapon, armor, or equipment handling
            const weaponNames = text.toLowerCase().split(', ').map(name => name.trim()); // Convert to lowercase for comparison

            return weaponNames.map((part, index) => {
                const lowercasePart = part.toLowerCase();
                const data = Object.keys(traitsData).find(key => key.toLowerCase() === lowercasePart);
                let tooltipText = '';

                if (data) {
                    if (object === "weapon") {
                        tooltipText = `Damage: ${traitsData[data].damage}; ${traitsData[data].text}`;
                    } else if (object === "armor") {
                        tooltipText = `Armor Class: ${traitsData[data].ac}, ${traitsData[data].text}`;
                    } else if (object === "equipment") {
                        tooltipText = `${traitsData[data].text}`;
                    }

                    //Find the original capitalization from text
                    const originalPart = text.split(', ').map(name => name.trim()).find(name => name.toLowerCase() === lowercasePart);

                    return (
                        <span key={index} className="highlighted-trait" style={textStyles}>
                            {originalPart}
                            {index < weaponNames.length - 1 ? ', ' : ''}
                            <span className="tooltip" style={tooltipStyles}>{tooltipText}</span>
                        </span>
                    );
                }
                return (
                    <span key={index}>
                        {part}
                        {index < weaponNames.length - 1 ? ', ' : ''}
                    </span>
                );
            });
        }
    };

    return <div>{createHighlightedText()}</div>;
}