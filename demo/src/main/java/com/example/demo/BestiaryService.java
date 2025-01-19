package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BestiaryService {

    @Autowired
    private BestiaryPrivateRepository bestiaryPrivateRepository;


    // BestiaryPrivate methods
    public List<BestiaryPrivate> getBestiaryPrivateByCampaignId(Long campaignId) {
        return bestiaryPrivateRepository.findByCampaignId(campaignId);
    }

    public BestiaryPrivate addBestiaryPrivate(BestiaryPrivate bestiaryPrivate) {
        return bestiaryPrivateRepository.save(bestiaryPrivate);
    }

    public BestiaryPrivate updateBestiaryPrivate(Long id, BestiaryPrivate updatedBestiaryPrivate) {
        Optional<BestiaryPrivate> existingBestiaryPrivate = bestiaryPrivateRepository.findById(id);
        if (existingBestiaryPrivate.isPresent()) {
            BestiaryPrivate existing = existingBestiaryPrivate.get();
            existing.setAc(updatedBestiaryPrivate.getAc());
            existing.setAlignment(updatedBestiaryPrivate.getAlignment());
            existing.setCategory(updatedBestiaryPrivate.getCategory());
            existing.setCharisma(updatedBestiaryPrivate.getCharisma());
            existing.setConstitution(updatedBestiaryPrivate.getConstitution());
            existing.setCreatureAbility(updatedBestiaryPrivate.getCreatureAbility());
            existing.setDexterity(updatedBestiaryPrivate.getDexterity());
            existing.setFortitudeSave(updatedBestiaryPrivate.getFortitudeSave());
            existing.setHp(updatedBestiaryPrivate.getHp());
            existing.setImmunity(updatedBestiaryPrivate.getImmunity());
            existing.setLanguage(updatedBestiaryPrivate.getLanguage());
            existing.setLevel(updatedBestiaryPrivate.getLevel());
            existing.setName(updatedBestiaryPrivate.getName());
            existing.setNpc(updatedBestiaryPrivate.getNpc());
            existing.setPerception(updatedBestiaryPrivate.getPerception());
            existing.setRarity(updatedBestiaryPrivate.getRarity());
            existing.setReflexSave(updatedBestiaryPrivate.getReflexSave());
            existing.setResistance(updatedBestiaryPrivate.getResistance());
            existing.setSense(updatedBestiaryPrivate.getSense());
            existing.setSize(updatedBestiaryPrivate.getSize());
            existing.setSkill(updatedBestiaryPrivate.getSkill());
            existing.setSourceRaw(updatedBestiaryPrivate.getSourceRaw());
            existing.setSpeed(updatedBestiaryPrivate.getSpeed());
            existing.setSpeedRaw(updatedBestiaryPrivate.getSpeedRaw());
            existing.setStrength(updatedBestiaryPrivate.getStrength());
            existing.setStrongestSave(updatedBestiaryPrivate.getStrongestSave());
            existing.setText(updatedBestiaryPrivate.getText());
            existing.setTrait(updatedBestiaryPrivate.getTrait());
            existing.setType(updatedBestiaryPrivate.getType());
            existing.setVision(updatedBestiaryPrivate.getVision());
            existing.setWeakestSave(updatedBestiaryPrivate.getWeakestSave());
            existing.setWeakness(updatedBestiaryPrivate.getWeakness());
            existing.setWillSave(updatedBestiaryPrivate.getWillSave());
            existing.setWisdom(updatedBestiaryPrivate.getWisdom());
            existing.setSpell(updatedBestiaryPrivate.getSpell());
            existing.setIntelligence(updatedBestiaryPrivate.getIntelligence());
            existing.setMelee(updatedBestiaryPrivate.getMelee());
            existing.setRanged(updatedBestiaryPrivate.getRanged());
            existing.setItems(updatedBestiaryPrivate.getItems());
            existing.setWeaponsName(updatedBestiaryPrivate.getWeaponsName());
            existing.setArmorName(updatedBestiaryPrivate.getArmorName());
            existing.setEquipmentName(updatedBestiaryPrivate.getEquipmentName());
            existing.setArcane(updatedBestiaryPrivate.getArcane());
            existing.setPrimal(updatedBestiaryPrivate.getPrimal());
            existing.setDivine(updatedBestiaryPrivate.getDivine());
            existing.setElemental(updatedBestiaryPrivate.getElemental());
            existing.setOccult(updatedBestiaryPrivate.getOccult());
            existing.setAbilityDescription(updatedBestiaryPrivate.getAbilityDescription());
            return bestiaryPrivateRepository.save(existing);
        }
        return null;
    }

    public void deleteBestiaryPrivate(Long id) {
        bestiaryPrivateRepository.deleteById(id);
    }

    public BestiaryPrivate findBestiaryById(Long id) {
        Optional<BestiaryPrivate> creature = bestiaryPrivateRepository.findById(id);
        return creature.orElse(null);
    }


}