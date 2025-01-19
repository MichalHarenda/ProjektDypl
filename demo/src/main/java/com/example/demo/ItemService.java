package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class ItemService {



    @Autowired
    private WeaponsPrivateRepository weaponsPrivateRepository;

    @Autowired
    private ArmorsPrivateRepository armorsPrivateRepository;

    @Autowired
    private EquipmentRepositoryPrivate equipmentPrivateRepository; // Make sure you have this repository





    public List<WeaponsPrivate> getWeaponsByCampaignId(Long campaignId) {
        return weaponsPrivateRepository.findByCampaignId(campaignId);
    }

    public WeaponsPrivate addWeapon(WeaponsPrivate weapon) {
        return weaponsPrivateRepository.save(weapon);
    }

    public WeaponsPrivate updateWeapon(Long id, WeaponsPrivate weapon) {
        WeaponsPrivate existingWeapon = weaponsPrivateRepository.findById(id).orElse(null);
        if (existingWeapon != null) {
            existingWeapon.setName(weapon.getName());
            existingWeapon.setDamage(weapon.getDamage());
            existingWeapon.setDamageDie(weapon.getDamageDie());
            existingWeapon.setHands(weapon.getHands());
            existingWeapon.setItemCategory(weapon.getItemCategory());
            existingWeapon.setLevel(weapon.getLevel());
            existingWeapon.setPrice(weapon.getPrice());
            existingWeapon.setPp(weapon.getPp());
            existingWeapon.setGp(weapon.getGp());
            existingWeapon.setSp(weapon.getSp());
            existingWeapon.setCp(weapon.getCp());
            existingWeapon.setRarity(weapon.getRarity());
            existingWeapon.setTrait(weapon.getTrait());
            existingWeapon.setSourceRaw(weapon.getSourceRaw());
            existingWeapon.setText(weapon.getText());
            existingWeapon.setWeaponCategory(weapon.getWeaponCategory());
            existingWeapon.setWeaponGroup(weapon.getWeaponGroup());
            existingWeapon.setWeaponType(weapon.getWeaponType());
            existingWeapon.setAccess(weapon.getAccess());
            existingWeapon.setBulk(weapon.getBulk());
            return weaponsPrivateRepository.save(existingWeapon);
        }
        return null;
    }

    public void deleteWeapon(Long id) {
        weaponsPrivateRepository.deleteById(id);
    }

    public WeaponsPrivate findById(Long id) {
        Optional<WeaponsPrivate> weapon = weaponsPrivateRepository.findById(id);
        return weapon.orElse(null);
    }

    public List<ArmorsPrivate> getArmorsByCampaignId(Long campaignId) {
        return armorsPrivateRepository.findByCampaignId(campaignId);
    }

    public ArmorsPrivate addArmor(ArmorsPrivate armor) {
        return armorsPrivateRepository.save(armor);
    }

    public ArmorsPrivate updateArmor(Long id, ArmorsPrivate armor) {
        ArmorsPrivate existingArmor = armorsPrivateRepository.findById(id).orElse(null);
        if (existingArmor != null) {
            existingArmor.setName(armor.getName());
            existingArmor.setArmorCategory(armor.getArmorCategory());
            existingArmor.setArmorGroup(armor.getArmorGroup());
            existingArmor.setBulk(armor.getBulk());
            existingArmor.setCheckPenalty(armor.getCheckPenalty());
            existingArmor.setDexCap(armor.getDexCap());
            existingArmor.setSourceRaw(armor.getSourceRaw());
            existingArmor.setStrength(armor.getStrength());
            existingArmor.setText(armor.getText());
            existingArmor.setAccess(armor.getAccess());
            existingArmor.setSpeedPenalty(armor.getSpeedPenalty());
            existingArmor.setAc(armor.getAc());
            existingArmor.setDexCap(armor.getDexCap());
            existingArmor.setBulk(armor.getBulk());
            existingArmor.setItemCategory(armor.getItemCategory());
            existingArmor.setLevel(armor.getLevel());
            existingArmor.setPrice(armor.getPrice());
            existingArmor.setPp(armor.getPp());
            existingArmor.setGp(armor.getGp());
            existingArmor.setSp(armor.getSp());
            existingArmor.setCp(armor.getCp());
            existingArmor.setRarity(armor.getRarity());
            existingArmor.setTrait(armor.getTrait());
            return armorsPrivateRepository.save(existingArmor);
        }
        return null;
    }

    public void deleteArmor(Long id) {
        armorsPrivateRepository.deleteById(id);
    }

    public ArmorsPrivate findArmorById(Long id) {
        Optional<ArmorsPrivate> armor = armorsPrivateRepository.findById(id);
        return armor.orElse(null);
    }

    public List<EquipmentPrivate> getEquipmentByCampaignId(Long campaignId) {
        return equipmentPrivateRepository.findByCampaignId(campaignId);
    }

    public EquipmentPrivate addEquipment(EquipmentPrivate equipment) {
        return equipmentPrivateRepository.save(equipment);
    }

    public EquipmentPrivate updateEquipment(Long id, EquipmentPrivate equipment) {
        EquipmentPrivate existingEquipment = equipmentPrivateRepository.findById(id).orElse(null);
        if (existingEquipment != null) {
            existingEquipment.setName(equipment.getName());
            existingEquipment.setActions(equipment.getActions());
            existingEquipment.setBulk(equipment.getBulk());
            existingEquipment.setCategory(equipment.getCategory());
            existingEquipment.setItemCategory(equipment.getItemCategory());
            existingEquipment.setItemSubcategory(equipment.getItemSubcategory());
            existingEquipment.setLevel(equipment.getLevel());
            existingEquipment.setName(equipment.getName());
            existingEquipment.setPfs(equipment.getPfs());
            existingEquipment.setPrice(equipment.getPrice());
            existingEquipment.setPp(equipment.getPp());
            existingEquipment.setGp(equipment.getGp());
            existingEquipment.setSp(equipment.getSp());
            existingEquipment.setCp(equipment.getCp());
            existingEquipment.setRarity(equipment.getRarity());
            existingEquipment.setSchool(equipment.getSchool());
            existingEquipment.setSourceRaw(equipment.getSourceRaw());
            existingEquipment.setText(equipment.getText());
            existingEquipment.setType(equipment.getType());
            existingEquipment.setHands(equipment.getHands());
            existingEquipment.setSkill(equipment.getSkill());
            existingEquipment.setTrait(equipment.getTrait());
            return equipmentPrivateRepository.save(existingEquipment);
        }
        return null;
    }

    public void deleteEquipment(Long id) {
        equipmentPrivateRepository.deleteById(id);
    }

    public EquipmentPrivate findEquipmentById(Long id) {
        Optional<EquipmentPrivate> equipment = equipmentPrivateRepository.findById(id);
        return equipment.orElse(null);
    }
}
