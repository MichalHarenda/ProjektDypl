import React, {useEffect, useState} from 'react';
import './Modal.css';
import {useDraggable} from './DraggableModal';

function NoteModal({ onClose, onCreate, onUpdate, onDelete, notes, setNotes, newNote, setNewNote, editingNote, setEditingNote, campaignId }) {
    const { modalRef, handleMouseDown } = useDraggable();
    const [showForm, setShowForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        onCreate();
    };
    const handleUpdate = async () => {
        try {
            await onUpdate(editingNote.id, { ...newNote, campaignId });
            const updatedNotes = await fetchNotes();
            setNotes(updatedNotes);
            setEditingNote(false);
            setNewNote({ title: '', note: '' });
            setShowForm(false);
        } catch (error) {
            console.error("Error updating note", error);
        }
    };
    const handleDelete = (noteId) => {
        onDelete(noteId);
    };
    const handleEdit = (note) => {
        setEditingNote(note);
        setNewNote({ title: note.title, note: note.note });
        setShowForm(false);
    };

    const handleAddNote = () => {
        setIsCreating(true);
        setShowForm(true);
        setEditingNote(false);
        setNewNote({ title: '', note: '' });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
            setEditingNote(false);
            setNewNote({ title: '', note: '' });
            setShowForm(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setNewNote({ title: '', note: '' });
        setEditingNote(null);
        setIsCreating(false);
    };

    const fetchNotes = async () => {
        const response = await fetch(`/api/notes/${campaignId}`);
        return await response.json();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="modal-content" ref={modalRef} onMouseDown={handleMouseDown}>
            <h2>Notes</h2>
            <button onClick={handleAddNote}>Add new note</button>
            {showForm && (
                <form>
                    <input type="text" value={newNote.title}
                           onChange={(e) => setNewNote({...newNote, title: e.target.value})}/>
                    <textarea value={newNote.note} onChange={(e) => setNewNote({...newNote, note: e.target.value})}/>
                    <div className="button-group">
                        {editingNote ? (
                            <>
                                <button type="button" onClick={handleUpdate}>Update note</button>
                                <button type="button" onClick={handleCancel}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button type="button" onClick={handleCreate}>Create note</button>
                                <button type="button" onClick={handleCancel}>Cancel</button>
                            </>
                        )}
                    </div>
                </form>
                )}
            <div className="modal-container">
                <div className="modal-container-content-scroll">

                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            <h3>{note.title}</h3>
                            <p>{note.note}</p>
                            <div className="button-group">
                                <button onClick={() => handleEdit(note)}>Edit</button>
                                <button onClick={() => handleDelete(note.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                </div>
        </div>
            <button onClick={onClose}>Close</button>
        </div>

    );
}

export default NoteModal;