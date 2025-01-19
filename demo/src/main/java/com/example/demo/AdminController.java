package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

//Weapons mapping
    @GetMapping("/getWeapons")
    public ResponseEntity<List<WeaponsPublic>> getAllPublicWeapons() {
        return ResponseEntity.ok(adminService.getAllPublicWeapons());
    }

    @PostMapping("/addWeapons")
    public ResponseEntity<WeaponsPublic> addPublicWeapons(@RequestBody WeaponsPublic weaponsPublic) {
        WeaponsPublic created = adminService.addPublicWeapons(weaponsPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateWeapons/{id}")
    public ResponseEntity<WeaponsPublic> updatePublicWeapons(@PathVariable Long id, @RequestBody WeaponsPublic weaponsPublic){
        WeaponsPublic updated = adminService.updatePublicWeapons(id, weaponsPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteWeapons/{id}")
    public ResponseEntity<Void> deleteWeaponsPublic(@PathVariable Long id) {
        adminService.deleteWeaponsPublic(id);
        return ResponseEntity.noContent().build();
    }
//armor mapping
    @GetMapping("/getArmor")
    public ResponseEntity<List<ArmorsPublic>> getAllPublicArmors() {
        return ResponseEntity.ok(adminService.getAllPublicArmors());
    }
    @PostMapping("/addArmor")
    public ResponseEntity<ArmorsPublic> addPublicArmors(@RequestBody ArmorsPublic armorsPublic) {
        ArmorsPublic created = adminService.addPublicArmors(armorsPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateArmor/{id}")
    public ResponseEntity<ArmorsPublic> updatePublicArmors(@PathVariable Long id, @RequestBody ArmorsPublic armorsPublic){
        ArmorsPublic updated = adminService.updatePublicArmors(id, armorsPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteArmor/{id}")
    public ResponseEntity<Void> deleteArmorsPublic(@PathVariable Long id) {
        adminService.deleteArmorsPublic(id);
        return ResponseEntity.noContent().build();
    }
//equipment methods

    @GetMapping("/getEquipment")
    public ResponseEntity<List<EquipmentPublic>> getAllEquipment() { return ResponseEntity.ok(adminService.getAllEquipment()); }

    @PostMapping("/addEquipment")
    public ResponseEntity<EquipmentPublic> addPublicEquipment(@RequestBody EquipmentPublic equipmentPublic) {
        EquipmentPublic created = adminService.addPublicEquipment(equipmentPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateEquipment/{id}")
    public ResponseEntity<EquipmentPublic> updatePublicEquipment(@PathVariable Long id, @RequestBody EquipmentPublic equipmentPublic){
        EquipmentPublic updated = adminService.updatePublicEquipment(id, equipmentPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteEquipment/{id}")
    public ResponseEntity<Void> deleteEquipmentPublic(@PathVariable Long id) {
        adminService.deleteEquipmentPublic(id);
        return ResponseEntity.noContent().build();
    }
    //spells endpoint
    @GetMapping("/getSpells")
    public ResponseEntity<List<Spells>> getAllSpells() {
        return ResponseEntity.ok(adminService.getAllSpells());
    }
    @PostMapping("/addSpells")
    public ResponseEntity<Spells> addSpells(@RequestBody Spells spellsPublic) {
        Spells created = adminService.addSpells(spellsPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateSpells/{id}")
    public ResponseEntity<Spells> updateSpells(@PathVariable Long id, @RequestBody Spells spellsPublic){
        Spells updated = adminService.updateSpells(id, spellsPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteSpells/{id}")
    public ResponseEntity<Void> deleteSpells(@PathVariable Long id) {
        adminService.deleteSpells(id);
        return ResponseEntity.noContent().build();
    }

//traits endpoint
    @GetMapping("/getTraits")
    public ResponseEntity<List<Traits>> getAllTraits() {
        return ResponseEntity.ok(adminService.getAllTraits());
    }
    @PostMapping("/addTraits")
    public ResponseEntity<Traits> addTraits(@RequestBody Traits traitsPublic) {
        Traits created = adminService.addTraits(traitsPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateTraits/{id}")
    public ResponseEntity<Traits> updateTraits(@PathVariable Long id, @RequestBody Traits traitsPublic){
        Traits updated = adminService.updateTraits(id, traitsPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteTraits/{id}")
    public ResponseEntity<Void> deleteTraits(@PathVariable Long id) {
        adminService.deleteTraits(id);
        return ResponseEntity.noContent().build();
    }

    // BestiaryPublic endpoints
    @GetMapping("/getBestiary")
    public ResponseEntity<List<BestiaryPublic>> getAllBestiaryPublic() {
        return ResponseEntity.ok(adminService.getAllBestiaryPublic()  ) ;
    }

    @PostMapping("/addBestiary")
    public ResponseEntity<BestiaryPublic> addBestiaryPublic(@RequestBody BestiaryPublic bestiaryPublic) {
        BestiaryPublic created = adminService.addBestiaryPublic(bestiaryPublic);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/updateBestiary/{id}")
    public ResponseEntity<BestiaryPublic> updateBestiaryPublic(@PathVariable Long id, @RequestBody BestiaryPublic bestiaryPublic){
        BestiaryPublic updated = adminService.updateBestiaryPublic(id, bestiaryPublic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/deleteBestiary/{id}")
    public ResponseEntity<Void> deleteBestiaryPublic(@PathVariable Long id) {
        adminService.deleteBestiaryPublic(id);
        return ResponseEntity.noContent().build();
    }
}
