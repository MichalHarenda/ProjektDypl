import React from 'react';
import './Table.css';

export function TooltipHighlighterMutliple({ text, traitsData, secondData={}, textStyles = {}, tooltipStyles = {}, object, secondObject={} }) {
    const createHighlightedText = () => {
        if (!text || text.trim() === '') return null;

        const parts = text.split(',').map(part => part.trim());
        const highlightedText = [];
        const traits = Object.keys(traitsData);
        const regex = new RegExp(`\\b(${traits.join('|').toLowerCase()})\\b`, 'gi');

        const secondTraits = Object.keys(secondData);
        const secondRegex = new RegExp(`\\b(${secondTraits.join('|').toLowerCase()})\\b`, 'gi');

        const findMatches = (part, regex, data, object) => {
            const matches = [];
            let match;

            while ((match = regex.exec(part)) !== null) {
                const traitKey = Object.keys(data).find(key => key.toLowerCase() === match[0].toLowerCase());
                if (traitKey) {
                    matches.push({ word: match[0], tooltip: data[traitKey], object: object });
                }
            }
            return matches;
        };

        parts.forEach((part, partIndex) => {
            const matches = findMatches(part, regex, traitsData, object);

            if (secondData) {
                matches.push(...findMatches(part, secondRegex, secondData, secondObject));
            }

            let currentPosition = 0;
            const segments = [];

            matches.forEach(({ word, tooltip }) => {
                const startIndex = part.indexOf(word, currentPosition);
                if (startIndex !== -1) {
                    if (startIndex > currentPosition) {
                        segments.push(part.substring(currentPosition, startIndex));
                    }

                    segments.push(
                        <span key={word} className="highlighted-trait" style={textStyles}>
                        {word}
                            <span className="tooltip" style={tooltipStyles}>
                            {typeof tooltip === 'object' ? Object.values(tooltip).join('; ') : tooltip}
                        </span>
                    </span>
                    );
                    currentPosition = startIndex + word.length;
                }
            });

            if (currentPosition < part.length) {
                segments.push(part.substring(currentPosition));
            }

            highlightedText.push(
                <React.Fragment key={part}>
                    {segments.map((segment, segmentIndex) => (
                        <React.Fragment key={segmentIndex}>
                            {segment}
                            {segmentIndex < segments.length - 1 && !/^[()]*$/.test(segment) && ''}
                        </React.Fragment>
                    ))}
                    {partIndex < parts.length - 1 && ', '}
                </React.Fragment>
            );
        });

        return highlightedText;
    };

    return <div>{createHighlightedText()}</div>;
}