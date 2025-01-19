import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';
import AuthContext from '../AuthContext';
import { useDraggable } from './DraggableModal';

const ResultGrid = ({ results }) => {
    return (
        <div className="result-grid">
            {results.map((result, index) => (
                <span key={index} className="result-item">{result}</span>
            ))}
        </div>
    );
};
function DiceRollModal({ onClose }) {
    const { user, loading: authLoading, error: authError } = useContext(AuthContext);
    const [rollInput, setRollInput] = useState('1d6');
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const { modalRef, handleMouseDown } = useDraggable();

    const handleRoll = async () => {
        setError('');
        setResults([]);
        setTotal(0);

        if (!rollInput.match(/^\d+d\d+(\s*\+\s*\d+d\d+)*$/)) {
            setError('Invalid dice notation');
            return;
        }

        setLoading(true);
        try {
            if (!user) {
                setError('Please log in to roll dice.');
                return;
            }
            const response = await axios.get('http://localhost:8080/api/dice/roll', {
                params: { rollInput },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setResults(response.data.results);
            setTotal(response.data.total);
            setShowResults(false);
            setHistory((prevHistory) => [
                ...prevHistory,
                { input: rollInput, results: response.data.results, total: response.data.total },
            ]);
        } catch (error) {
            console.error('Error rolling dice:', error);
            setError(error.response?.data?.message || 'Failed to roll dice.');
        } finally {
            setLoading(false);
        }
    };

    const deleteRoll = (index) => {
        setHistory(history.filter((_, i) => i !== index));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    return (
            <div className="modal-content" ref={modalRef} onMouseDown={handleMouseDown}>
                <h2>Roll dice</h2>

                <label>
                    Enter dice (e.g., 1d6 + 3d12 + 2d8):
                    <input
                        type="text"
                        value={rollInput}
                        onChange={(e) => setRollInput(e.target.value)}
                    />
                </label>
                {authLoading && <div>Authenticating...</div>}
                {authError && <div style={{ color: 'red' }}>{authError}</div>}
                <button onClick={handleRoll} disabled={loading}>Roll</button>

                {loading && <p>Rolling dice...</p>}

                <p>Total Result: {total}</p>

                {showResults && results.length > 0 && (
                    <div>
                        <h4>Individual Results:</h4>
                        <ResultGrid results={results} />
                    </div>
                )}

                <button onClick={() => setShowResults(!showResults)}>
                    {showResults ? "Hide results" : "Show individual results"}
                </button>

                <button onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? "Hide roll history" : "Show roll history"}
                </button>

                {showHistory && (
                    <div className="history-section">
                        <h4>Roll history:</h4>
                            {history.length > 0 ? (
                                <ul>
                                    {history.map((entry, index) => (
                                        <li key={index} className="history-entry">
                                            <div>
                                                {entry.input} ➔ Total: {entry.total} (Results: {entry.results.join(', ')})
                                                <button onClick={() => deleteRoll(index)}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No rolls yet.</p>
                            )}
                    </div>
                )}
                <button onClick={onClose}>Close</button>
            </div>
    );
}

export default DiceRollModal;