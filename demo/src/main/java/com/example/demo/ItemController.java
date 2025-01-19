
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;



import java.util.List;


@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CampaignService campaignService;




    @GetMapping("/weapons/private/{campaignId}")
    public ResponseEntity<List<WeaponsPrivate>> getWeaponsByCampaignId(
            @PathVariable Long campaignId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<WeaponsPrivate> weapons = itemService.getWeaponsByCampaignId(campaignId);
        return ResponseEntity.ok(weapons);
    }

    @PostMapping("/weapons/private/{campaignId}")
    public ResponseEntity<WeaponsPrivate> addWeapon(
            @PathVariable Long campaignId,
            @RequestBody WeaponsPrivate weapon,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId())
                .stream()
                .anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        weapon.setCampaignId(campaignId);
        WeaponsPrivate createdWeapon = itemService.addWeapon(weapon);
        return ResponseEntity.ok(createdWeapon);
    }

    @PutMapping("/weapons/private/{id}")
    public ResponseEntity<WeaponsPrivate> updateWeapon(
            @PathVariable Long id,
            @RequestBody WeaponsPrivate updatedWeapon,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        WeaponsPrivate weapon = itemService.findById(id);
        if (weapon == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(weapon.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        WeaponsPrivate updated = itemService.updateWeapon(id, updatedWeapon);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/weapons/private/{id}")
    public ResponseEntity<Void> deleteWeapon(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        WeaponsPrivate weapon = itemService.findById(id);
        if (weapon == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(weapon.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        itemService.deleteWeapon(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/armors/private/{campaignId}")
    public ResponseEntity<List<ArmorsPrivate>> getArmorsByCampaignId(
            @PathVariable Long campaignId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ArmorsPrivate> armors = itemService.getArmorsByCampaignId(campaignId);
        return ResponseEntity.ok(armors);
    }

    @PostMapping("/armors/private/{campaignId}")
    public ResponseEntity<ArmorsPrivate> addArmor(
            @PathVariable Long campaignId,
            @RequestBody ArmorsPrivate armor,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        armor.setCampaignId(campaignId);
        ArmorsPrivate createdArmor = itemService.addArmor(armor);
        return ResponseEntity.ok(createdArmor);
    }

    @PutMapping("/armors/private/{id}")
    public ResponseEntity<ArmorsPrivate> updateArmor(
            @PathVariable Long id,
            @RequestBody ArmorsPrivate updatedArmor,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        ArmorsPrivate armor = itemService.findArmorById(id);
        if (armor == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(armor.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ArmorsPrivate updated = itemService.updateArmor(id, updatedArmor);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/armors/private/{id}")
    public ResponseEntity<Void> deleteArmor(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        ArmorsPrivate armor = itemService.findArmorById(id);
        if (armor == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(armor.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        itemService.deleteArmor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipment/private/{campaignId}")
    public ResponseEntity<List<EquipmentPrivate>> getEquipmentByCampaignId(
            @PathVariable Long campaignId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<EquipmentPrivate> equipment = itemService.getEquipmentByCampaignId(campaignId);
        return ResponseEntity.ok(equipment);
    }

    @PostMapping("/equipment/private/{campaignId}")
    public ResponseEntity<EquipmentPrivate> addEquipment(
            @PathVariable Long campaignId,
            @RequestBody EquipmentPrivate equipment,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        equipment.setCampaignId(campaignId);
        EquipmentPrivate createdEquipment = itemService.addEquipment(equipment);
        return ResponseEntity.ok(createdEquipment);
    }

    @PutMapping("/equipment/private/{id}")
    public ResponseEntity<EquipmentPrivate> updateEquipment(
            @PathVariable Long id,
            @RequestBody EquipmentPrivate updatedEquipment,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        EquipmentPrivate equipment = itemService.findEquipmentById(id);
        if (equipment == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(equipment.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        EquipmentPrivate updated = itemService.updateEquipment(id, updatedEquipment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/equipment/private/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        EquipmentPrivate equipment = itemService.findEquipmentById(id);
        if (equipment == null || !campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(equipment.getCampaignId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        itemService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
