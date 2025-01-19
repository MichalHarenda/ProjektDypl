import React, { useContext, useState, useEffect } from 'react';
import DiceRollModal from './DiceRollModal';
import NoteModal from './NoteModal';
import AuthContext from './../AuthContext';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {makeRequest} from "../apiService";

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaignId');
    const navigate = useNavigate();
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', note: '' });
    const [editingNote, setEditingNote] = useState(null);


    const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN');

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleReturnToCampaigns = () => {
        navigate('/campaign');
    };

        useEffect(() => {
            const fetchNotes = async () => {
                if (campaignId) {
                    try {
                        const fetchedNotes = await makeRequest(`/api/notes/${campaignId}`, 'GET', null, user.token);
                        setNotes(fetchedNotes);
                    } catch (error) {
                        console.error('Error fetching notes:', error);
                    }
                }
            };
            fetchNotes();
        }, [campaignId, user]);

    const handleOpenNoteModal = () => {
        setIsNoteModalOpen(true);
    };

    const handleCloseNoteModal = () => {
        setIsNoteModalOpen(false);
        setNewNote({ title: '', note: '' });
        setEditingNote(null);
    };

    const handleCreateNote = async () => {
        try {
            const response = await makeRequest('/api/notes', 'POST', {...newNote, campaignId: parseInt(campaignId)}, user.token);
            setNotes([...notes, response]);
            handleCloseNoteModal();
        } catch (error) {
            console.error("Error creating note", error);
        }
    };

    const handleUpdateNote = async (noteId, updatedNote) => {
        try {
            await makeRequest(`/api/notes/${noteId}`, 'PUT', updatedNote, user.token);
            const updatedNotes = await makeRequest(`/api/notes/${campaignId}`, 'GET', null, user.token);
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Error updating note', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await makeRequest(`/api/notes/${noteId}`, 'DELETE', null, user.token);
            const updatedNotes = await makeRequest(`/api/notes/${campaignId}`, 'GET', null, user.token);
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Error deleting note', error);
        }
    };

    return (
        <div>
            <h1></h1>
            <p>Wilkommen!</p>
            <button onClick={handleReturnToCampaigns}>Choose different campaign</button>
            <button onClick={handleOpenModal}>Roll dice</button>
            {isModalOpen && <DiceRollModal onClose={handleCloseModal}/>}
            <button onClick={handleOpenNoteModal}>Notes</button>
            <button onClick={() => navigate('/items?campaignId=' + campaignId)}>Items</button>
            <button onClick={() => navigate('/bestiary?campaignId=' + campaignId)}>Bestiary</button>
            <button onClick={() => navigate('/profile?campaignId=' + campaignId)}>Profile</button>
            {isAdmin && (
            <button onClick={() => navigate('/admin?campaignId=' + campaignId)}>Users management</button>
            )}
            <button onClick={logout}>Logout</button>

            {isNoteModalOpen && (
                <NoteModal
                    onClose={handleCloseNoteModal}
                    onCreate={handleCreateNote}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                    notes={notes}
                    setNotes={setNotes}
                    newNote={newNote}
                    setNewNote={setNewNote}
                    editingNote={editingNote}
                    setEditingNote={setEditingNote}
                    campaignId={campaignId}
                />
            )}
        </div>
    );
}


export default Dashboard;
