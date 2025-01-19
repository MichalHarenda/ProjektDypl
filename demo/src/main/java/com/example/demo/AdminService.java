package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service

public class AdminService {

    @Autowired
    private BestiaryPublicRepository bestiaryPublicRepository;
    @Autowired
    private TraitsRepository traitsRepository; // Make sure you have this repository
    @Autowired
    private WeaponsPublicRepository weaponsPublicRepository;
    @Autowired
    private ArmorsPublicRepository armorsPublicRepository;
    @Autowired
    private SpellsRepository spellsRepository;
    @Autowired
    private EquipmentRepositoryPublic equipmentRepository;

//spell methods
    public List<Spells> getAllSpells() { return spellsRepository.findAll(); }

    public Spells addSpells(Spells spellsPublic) {
        return spellsRepository.save(spellsPublic);
    }

    public Spells updateSpells(Long id, Spells updatedSpellPublic) {
        Optional<Spells> existingSpellPublic = spellsRepository.findById(id);
        if (existingSpellPublic.isPresent()) {
            Spells existingSpell = existingSpellPublic.get();
            existingSpell.setName(updatedSpellPublic.getName());
            existingSpell.setActions(updatedSpellPublic.getActions());
            existingSpell.setBloodline(updatedSpellPublic.getBloodline());
            existingSpell.setCategory(updatedSpellPublic.getCategory());
            existingSpell.setComponent(updatedSpellPublic.getComponent());
            existingSpell.setHeighten(updatedSpellPublic.getHeighten());
            existingSpell.setLevel(updatedSpellPublic.getLevel());
            existingSpell.setPfs(updatedSpellPublic.getPfs());
            existingSpell.setSpellRange(updatedSpellPublic.getSpellRange());
            existingSpell.setRangeRaw(updatedSpellPublic.getRangeRaw());
            existingSpell.setRarity(updatedSpellPublic.getRarity());
            existingSpell.setSavingThrow(updatedSpellPublic.getSavingThrow());
            existingSpell.setSchool(updatedSpellPublic.getSchool());
            existingSpell.setSourceRaw(updatedSpellPublic.getSourceRaw());
            existingSpell.setSummary(updatedSpellPublic.getSummary());
            existingSpell.setTarget(updatedSpellPublic.getTarget());
            existingSpell.setText(updatedSpellPublic.getText());
            existingSpell.setTradition(updatedSpellPublic.getTradition());
            existingSpell.setTrait(updatedSpellPublic.getTrait());
            existingSpell.setType(updatedSpellPublic.getType());
            return spellsRepository.save(existingSpell);
        }
        return null;
    }

    public void deleteSpells(Long id) {
        spellsRepository.deleteById(id);
    }
//traits methods
    public List<Traits> getAllTraits() {
        return traitsRepository.findAll();
    }
    public Traits addTraits(Traits traitsPublic) {
        return traitsRepository.save(traitsPublic);
    }

    public Traits updateTraits(Long id, Traits updatedTraitPublic) {
        Optional<Traits> existingTraitPublic = traitsRepository.findById(id);
        if (existingTraitPublic.isPresent()) {
            Traits existingTrait = existingTraitPublic.get();
            existingTrait.setName(updatedTraitPublic.getName());
            existingTrait.setSummary(updatedTraitPublic.getSummary());
            existingTrait.setSourceRaw(updatedTraitPublic.getSourceRaw());
            return traitsRepository.save(existingTrait);
        }
        return null;
    }

    public void deleteTraits(Long id) {
        traitsRepository.deleteById(id);
    }
    //equipment methods
    public List<EquipmentPublic> getAllEquipment() { return equipmentRepository.findAll(); }

    public EquipmentPublic addPublicEquipment(EquipmentPublic equipmentPublic) {
        return equipmentRepository.save(equipmentPublic);
    }

    public EquipmentPublic updatePublicEquipment(Long id, EquipmentPublic updatedEquipmentPublic) {
        Optional<EquipmentPublic> existingEquipmentPublic = equipmentRepository.findById(id);
        if (existingEquipmentPublic.isPresent()) {
            EquipmentPublic existingEquipment = existingEquipmentPublic.get();
            existingEquipment.setName(updatedEquipmentPublic.getName());
            existingEquipment.setActions(updatedEquipmentPublic.getActions());
            existingEquipment.setBulk(updatedEquipmentPublic.getBulk());
            existingEquipment.setCategory(updatedEquipmentPublic.getCategory());
            existingEquipment.setItemCategory(updatedEquipmentPublic.getItemCategory());
            existingEquipment.setItemSubcategory(updatedEquipmentPublic.getItemSubcategory());
            existingEquipment.setLevel(updatedEquipmentPublic.getLevel());
            existingEquipment.setName(updatedEquipmentPublic.getName());
            existingEquipment.setPfs(updatedEquipmentPublic.getPfs());
            existingEquipment.setPrice(updatedEquipmentPublic.getPrice());
            existingEquipment.setPp(updatedEquipmentPublic.getPp());
            existingEquipment.setGp(updatedEquipmentPublic.getGp());
            existingEquipment.setSp(updatedEquipmentPublic.getSp());
            existingEquipment.setCp(updatedEquipmentPublic.getCp());
            existingEquipment.setRarity(updatedEquipmentPublic.getRarity());
            existingEquipment.setSchool(updatedEquipmentPublic.getSchool());
            existingEquipment.setSourceRaw(updatedEquipmentPublic.getSourceRaw());
            existingEquipment.setText(updatedEquipmentPublic.getText());
            existingEquipment.setType(updatedEquipmentPublic.getType());
            existingEquipment.setHands(updatedEquipmentPublic.getHands());
            existingEquipment.setSkill(updatedEquipmentPublic.getSkill());
            existingEquipment.setTrait(updatedEquipmentPublic.getTrait());
            return equipmentRepository.save(existingEquipment);
        }
        return null;
    }

    public void deleteEquipmentPublic(Long id) {
        equipmentRepository.deleteById(id);
    }


//armor methods
    public List<ArmorsPublic> getAllPublicArmors() { return armorsPublicRepository.findAll(); }

    public ArmorsPublic addPublicArmors(ArmorsPublic armorsPublic) {
        return armorsPublicRepository.save(armorsPublic);
    }

    public ArmorsPublic updatePublicArmors(Long id, ArmorsPublic updatedArmorPublic) {
        Optional<ArmorsPublic> existingArmorsPublic = armorsPublicRepository.findById(id);
        if (existingArmorsPublic.isPresent()) {
            ArmorsPublic existingArmor = existingArmorsPublic.get();
            existingArmor.setName(updatedArmorPublic.getName());
            existingArmor.setArmorCategory(updatedArmorPublic.getArmorCategory());
            existingArmor.setArmorGroup(updatedArmorPublic.getArmorGroup());
            existingArmor.setBulk(updatedArmorPublic.getBulk());
            existingArmor.setCheckPenalty(updatedArmorPublic.getCheckPenalty());
            existingArmor.setDexCap(updatedArmorPublic.getDexCap());
            existingArmor.setSourceRaw(updatedArmorPublic.getSourceRaw());
            existingArmor.setStrength(updatedArmorPublic.getStrength());
            existingArmor.setText(updatedArmorPublic.getText());
            existingArmor.setAccess(updatedArmorPublic.getAccess());
            existingArmor.setSpeedPenalty(updatedArmorPublic.getSpeedPenalty());
            existingArmor.setAc(updatedArmorPublic.getAc());
            existingArmor.setDexCap(updatedArmorPublic.getDexCap());
            existingArmor.setBulk(updatedArmorPublic.getBulk());
            existingArmor.setItemCategory(updatedArmorPublic.getItemCategory());
            existingArmor.setLevel(updatedArmorPublic.getLevel());
            existingArmor.setPrice(updatedArmorPublic.getPrice());
            existingArmor.setPp(updatedArmorPublic.getPp());
            existingArmor.setGp(updatedArmorPublic.getGp());
            existingArmor.setSp(updatedArmorPublic.getSp());
            existingArmor.setCp(updatedArmorPublic.getCp());
            existingArmor.setRarity(updatedArmorPublic.getRarity());
            existingArmor.setTrait(updatedArmorPublic.getTrait());
            return armorsPublicRepository.save(existingArmor);
        }
        return null;
    }

    public void deleteArmorsPublic(Long id) {
        armorsPublicRepository.deleteById(id);
    }

    //weapojns methods
    public List<WeaponsPublic> getAllPublicWeapons() {
        return weaponsPublicRepository.findAll();
    }
    public WeaponsPublic addPublicWeapons(WeaponsPublic weaponsPublic) {
        return weaponsPublicRepository.save(weaponsPublic);
    }

    public WeaponsPublic updatePublicWeapons(Long id, WeaponsPublic updatedWeaponPublic) {
        Optional<WeaponsPublic> existingWeaponsPublic = weaponsPublicRepository.findById(id);
        if (existingWeaponsPublic.isPresent()) {
            WeaponsPublic existingWeapon = existingWeaponsPublic.get();
            existingWeapon.setName(updatedWeaponPublic.getName());
            existingWeapon.setDamage(updatedWeaponPublic.getDamage());
            existingWeapon.setDamageDie(updatedWeaponPublic.getDamageDie());
            existingWeapon.setHands(updatedWeaponPublic.getHands());
            existingWeapon.setItemCategory(updatedWeaponPublic.getItemCategory());
            existingWeapon.setLevel(updatedWeaponPublic.getLevel());
            existingWeapon.setPrice(updatedWeaponPublic.getPrice());
            existingWeapon.setPp(updatedWeaponPublic.getPp());
            existingWeapon.setGp(updatedWeaponPublic.getGp());
            existingWeapon.setSp(updatedWeaponPublic.getSp());
            existingWeapon.setCp(updatedWeaponPublic.getCp());
            existingWeapon.setRarity(updatedWeaponPublic.getRarity());
            existingWeapon.setTrait(updatedWeaponPublic.getTrait());
            existingWeapon.setSourceRaw(updatedWeaponPublic.getSourceRaw());
            existingWeapon.setText(updatedWeaponPublic.getText());
            existingWeapon.setWeaponCategory(updatedWeaponPublic.getWeaponCategory());
            existingWeapon.setWeaponGroup(updatedWeaponPublic.getWeaponGroup());
            existingWeapon.setWeaponType(updatedWeaponPublic.getWeaponType());
            existingWeapon.setAccess(updatedWeaponPublic.getAccess());
            existingWeapon.setBulk(updatedWeaponPublic.getBulk());
            return weaponsPublicRepository.save(existingWeapon);
        }
        return null;
    }

    public void deleteWeaponsPublic(Long id) {
        weaponsPublicRepository.deleteById(id);
    }


    // BestiaryPublic methods
    public List<BestiaryPublic> getAllBestiaryPublic() {
        return bestiaryPublicRepository.findAll();
    }

    public BestiaryPublic addBestiaryPublic(BestiaryPublic bestiaryPublic) {
        return bestiaryPublicRepository.save(bestiaryPublic);
    }

    public BestiaryPublic updateBestiaryPublic(Long id, BestiaryPublic updatedBestiaryPublic) {
        Optional<BestiaryPublic> existingBestiaryPublic = bestiaryPublicRepository.findById(id);
        if (existingBestiaryPublic.isPresent()) {
            BestiaryPublic existing = existingBestiaryPublic.get();
            existing.setAc(updatedBestiaryPublic.getAc());
            existing.setAlignment(updatedBestiaryPublic.getAlignment());
            existing.setCategory(updatedBestiaryPublic.getCategory());
            existing.setCharisma(updatedBestiaryPublic.getCharisma());
            existing.setConstitution(updatedBestiaryPublic.getConstitution());
            existing.setCreatureAbility(updatedBestiaryPublic.getCreatureAbility());
            existing.setDexterity(updatedBestiaryPublic.getDexterity());
            existing.setFortitudeSave(updatedBestiaryPublic.getFortitudeSave());
            existing.setHp(updatedBestiaryPublic.getHp());
            existing.setImmunity(updatedBestiaryPublic.getImmunity());
            existing.setLanguage(updatedBestiaryPublic.getLanguage());
            existing.setLevel(updatedBestiaryPublic.getLevel());
            existing.setName(updatedBestiaryPublic.getName());
            existing.setNpc(updatedBestiaryPublic.getNpc());
            existing.setPerception(updatedBestiaryPublic.getPerception());
            existing.setRarity(updatedBestiaryPublic.getRarity());
            existing.setReflexSave(updatedBestiaryPublic.getReflexSave());
            existing.setResistance(updatedBestiaryPublic.getResistance());
            existing.setSense(updatedBestiaryPublic.getSense());
            existing.setSize(updatedBestiaryPublic.getSize());
            existing.setSkill(updatedBestiaryPublic.getSkill());
            existing.setSourceRaw(updatedBestiaryPublic.getSourceRaw());
            existing.setSpeed(updatedBestiaryPublic.getSpeed());
            existing.setSpeedRaw(updatedBestiaryPublic.getSpeedRaw());
            existing.setStrength(updatedBestiaryPublic.getStrength());
            existing.setStrongestSave(updatedBestiaryPublic.getStrongestSave());
            existing.setText(updatedBestiaryPublic.getText());
            existing.setTrait(updatedBestiaryPublic.getTrait());
            existing.setType(updatedBestiaryPublic.getType());
            existing.setVision(updatedBestiaryPublic.getVision());
            existing.setWeakestSave(updatedBestiaryPublic.getWeakestSave());
            existing.setWeakness(updatedBestiaryPublic.getWeakness());
            existing.setWillSave(updatedBestiaryPublic.getWillSave());
            existing.setWisdom(updatedBestiaryPublic.getWisdom());
            existing.setSpell(updatedBestiaryPublic.getSpell());
            existing.setIntelligence(updatedBestiaryPublic.getIntelligence());
            existing.setMelee(updatedBestiaryPublic.getMelee());
            existing.setRanged(updatedBestiaryPublic.getRanged());
            existing.setAbilityDescription(updatedBestiaryPublic.getAbilityDescription());
            existing.setWeaponsName(updatedBestiaryPublic.getWeaponsName());
            existing.setArmorName(updatedBestiaryPublic.getArmorName());
            existing.setEquipmentName(updatedBestiaryPublic.getEquipmentName());
            existing.setArcane(updatedBestiaryPublic.getArcane());
            existing.setPrimal(updatedBestiaryPublic.getPrimal());
            existing.setDivine(updatedBestiaryPublic.getDivine());
            existing.setElemental(updatedBestiaryPublic.getElemental());
            existing.setOccult(updatedBestiaryPublic.getOccult());
            existing.setSpells(updatedBestiaryPublic.getSpells());
            return bestiaryPublicRepository.save(existing);
        }
        return null;
    }
    public void deleteBestiaryPublic(Long id) {
        bestiaryPublicRepository.deleteById(id);
    }
}
