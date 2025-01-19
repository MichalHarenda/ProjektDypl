package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/bestiary")
public class BestiaryController {

    @Autowired
    private BestiaryService bestiaryService;
    @Autowired
    private UserRepository userRepository; // Assuming you have a UserRepository
    @Autowired
    private CampaignService campaignService; // Assuming you have a CampaignService


    // BestiaryPrivate endpoints
// GET: Retrieve BestiaryPrivate by campaignId
    @GetMapping("/private/{campaignId}")
    public ResponseEntity<List<BestiaryPrivate>> getBestiaryPrivateByCampaignId(
            @PathVariable Long campaignId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId())
                .stream()
                .anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<BestiaryPrivate> bestiary = bestiaryService.getBestiaryPrivateByCampaignId(campaignId);
        return ResponseEntity.ok(bestiary);
    }

    // POST: Add BestiaryPrivate with campaignId
    @PostMapping("/private/{campaignId}")
    public ResponseEntity<BestiaryPrivate> addBestiaryPrivate(
            @PathVariable Long campaignId,
            @RequestBody BestiaryPrivate bestiaryPrivate,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId())
                .stream()
                .anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        bestiaryPrivate.setCampaignId(campaignId);
        BestiaryPrivate createdBestiary = bestiaryService.addBestiaryPrivate(bestiaryPrivate);
        return ResponseEntity.ok(createdBestiary);
    }

    // PUT: Update BestiaryPrivate by id
    @PutMapping("/private/{id}")
    public ResponseEntity<BestiaryPrivate> updateBestiaryPrivate(
            @PathVariable Long id,
            @RequestBody BestiaryPrivate bestiaryPrivate,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        BestiaryPrivate existingBestiary = bestiaryService.findBestiaryById(id);
        if (existingBestiary == null || !campaignService.getCampaignsByUserId(user.getId())
                .stream()
                .anyMatch(c -> c.getId().equals(existingBestiary.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        BestiaryPrivate updatedBestiary = bestiaryService.updateBestiaryPrivate(id, bestiaryPrivate);
        return ResponseEntity.ok(updatedBestiary);
    }

    // DELETE: Delete BestiaryPrivate by id
    @DeleteMapping("/private/{id}")
    public ResponseEntity<Void> deleteBestiaryPrivate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        BestiaryPrivate bestiary = bestiaryService.findBestiaryById(id);
        if (bestiary == null || !campaignService.getCampaignsByUserId(user.getId())
                .stream()
                .anyMatch(c -> c.getId().equals(bestiary.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        bestiaryService.deleteBestiaryPrivate(id);
        return ResponseEntity.noContent().build();
    }


}