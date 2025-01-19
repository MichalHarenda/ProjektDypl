package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaign")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Campaign>> getCampaigns(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            List<Campaign> campaigns = campaignService.getCampaignsByUserId(user.getId());
            return ResponseEntity.ok(campaigns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<CampaignCreationResponse> createCampaign(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CampaignRequest campaignRequest
    ) {
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (!campaignService.canCreateCampaign(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new CampaignCreationResponse(false, null, campaignService.getCampaignsByUserId(user.getId())));
            }
            Campaign campaign = new Campaign(user.getId(), campaignRequest.getCampaignName(), campaignRequest.getDescription());
            Campaign createdCampaign = campaignService.createCampaign(campaign);
            return ResponseEntity.ok(new CampaignCreationResponse(true, createdCampaign, campaignService.getCampaignsByUserId(user.getId())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CampaignCreationResponse(false, null, null));
        }
    }

    @GetMapping("/limit")
    public ResponseEntity<Boolean> canCreateCampaign(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            return ResponseEntity.ok(campaignService.canCreateCampaign(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable Long id, @RequestBody Campaign updatedCampaign, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (campaignService.getCampaignsByUserId(user.getId()).stream().noneMatch(c -> c.getId().equals(id))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            Campaign updated = campaignService.updateCampaign(id, updatedCampaign);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<CampaignCreationResponse> deleteCampaign(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (campaignService.getCampaignsByUserId(user.getId()).stream().noneMatch(c -> c.getId().equals(id))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new CampaignCreationResponse(false, null, campaignService.getCampaignsByUserId(user.getId())));
            }
            campaignService.deleteCampaign(id);
            return ResponseEntity.ok(new CampaignCreationResponse(true, null, campaignService.getCampaignsByUserId(user.getId())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new CampaignCreationResponse(false, null, null));
        }
    }
    record CampaignCreationResponse(boolean success, Campaign campaign, List<Campaign> campaigns) {}
}
