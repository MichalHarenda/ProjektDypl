package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    public List<Campaign> getCampaignsByUserId(Long userId) {
        return campaignRepository.findByUserId(userId);
    }

    public Campaign createCampaign(Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    public boolean canCreateCampaign(Long userId) {
        return campaignRepository.findByUserId(userId).size() < 4;
    }

    public Campaign updateCampaign(Long id, Campaign updatedCampaign) {
        Campaign campaign = campaignRepository.findById(id).orElse(null);
        if (campaign != null) {
            campaign.setCampaignName(updatedCampaign.getCampaignName());
            campaign.setDescription(updatedCampaign.getDescription());
            return campaignRepository.save(campaign);
        }
        return null; // Or throw an exception
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }
}
