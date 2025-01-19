import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../AuthContext';
import { makeRequest } from '../apiService';
import { useNavigate } from 'react-router-dom';

function CampaignPage() {
    const { user, logout } = useContext(AuthContext);
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState({ campaignName: '', description: '' });
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [canCreate, setCanCreate] = useState(true);


    useEffect(() => {

        const fetchCampaigns = async () => {
            try {
                const campaigns = await makeRequest('/api/campaign', 'GET', null, user.token);
                setCampaigns(campaigns);
            } catch (error) {
                setError(error);
            }
        };
        if (user) {

        }
        const checkCreationLimit = async () => {
            try {
                const canCreate = await makeRequest('/api/campaign/limit', 'GET', null, user.token);
                setCanCreate(canCreate);
            } catch (error) {
                setError(error);
            }
        };
        if (user) {

        }

        fetchCampaigns();
        checkCreationLimit();
    }, [user]);

    const handleInputChange = (e) => {
        setEditingCampaign({ ...editingCampaign, [e.target.name]: e.target.value });
    };
    const handleUpdateCampaign = async (id) => {
        try {
            await makeRequest(`/api/campaign/${id}`, 'PUT', editingCampaign, user.token);
            const updatedCampaigns = await makeRequest('/api/campaign', 'GET', null, user.token);
            setCampaigns(updatedCampaigns);
            setEditingCampaign(null);
        } catch (error) {
            setError(error);
        }
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await makeRequest('/api/campaign', 'POST', newCampaign, user.token);
            setNewCampaign({ campaignName: '', description: '' });
            setCampaigns(response.campaigns);
            setCanCreate(response.success);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setCanCreate(false);
                setError("4 is max campaigns.");
            } else {
                setError(error);
            }
        }
    };

    const handleDeleteCampaign = async (id) => {
        try {
            const response = await makeRequest(`/api/campaign/${id}`, 'DELETE', null, user.token);
            setCampaigns(response.campaigns);
            setCanCreate(response.success);
        } catch (error) {
            setError(error);
        }
    };

    const handleCampaignSelect = (campaignId) => {
        setSelectedCampaignId(campaignId);
        navigate('/dashboard?campaignId=' + campaignId);
    };



    return (
        <div>
            <h1>Campaigns</h1>
            {error && <p style={{color: 'red'}}>{error.message}</p>}
            <ul>
                {campaigns.map((campaign) => (
                    <li key={campaign.id}>
                        <input
                            type="text"
                            name="campaignName"
                            value={editingCampaign && editingCampaign.id === campaign.id ? editingCampaign.campaignName : campaign.campaignName}
                            onChange={handleInputChange}
                            disabled={editingCampaign && editingCampaign.id !== campaign.id}
                        />
                        <textarea
                            name="description"
                            value={editingCampaign && editingCampaign.id === campaign.id ? editingCampaign.description : campaign.description}
                            onChange={handleInputChange}
                            disabled={editingCampaign && editingCampaign.id !== campaign.id}
                        />
                        {editingCampaign && editingCampaign.id === campaign.id ? (
                            <>
                                <button onClick={() => handleUpdateCampaign(campaign.id)}>Update</button>
                                <button onClick={() => setEditingCampaign(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setEditingCampaign({...campaign})}>Edit</button>
                            </>
                        )}
                        <button onClick={() => handleDeleteCampaign(campaign.id)}>Delete</button>
                        <button onClick={() => handleCampaignSelect(campaign.id)}>Select campaign</button>
                    </li>
                ))}
            </ul>
            {!canCreate && <p> Maximum number of campaigns (4).</p>}
            {canCreate && (
                <>
                    <h2>Create new campaign</h2>
                    <form onSubmit={handleCreateCampaign}>
                        <input
                            type="text"
                            name="campaignName"
                            value={newCampaign.campaignName}
                            onChange={(e) => setNewCampaign({...newCampaign, campaignName: e.target.value})}
                            placeholder="Campaign name"
                            required
                        />
                        <textarea
                            name="description"
                            value={newCampaign.description}
                            onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                            placeholder="Decription"
                            required
                        />
                        <button type="submit">Create campaign</button>
                    </form>
                </>
            )}
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default CampaignPage;
