package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "bestiary_public")
public class BestiaryPublic {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;
    @Basic
    @Column(name = "ac")
    private Integer ac;
    @Basic
    @Column(name = "alignment")
    private String alignment;
    @Basic
    @Column(name = "category")
    private String category;
    @Basic
    @Column(name = "charisma")
    private Integer charisma;
    @Basic
    @Column(name = "constitution")
    private Integer constitution;
    @Basic
    @Column(name = "creature_ability")
    private String creatureAbility;
    @Basic
    @Column(name = "dexterity")
    private Integer dexterity;
    @Basic
    @Column(name = "fortitude_save")
    private Integer fortitudeSave;
    @Basic
    @Column(name = "hp")
    private Integer hp;
    @Basic
    @Column(name = "immunity", columnDefinition = "MEDIUMTEXT")
    private String immunity;
    @Basic
    @Column(name = "language")
    private String language;
    @Basic
    @Column(name = "level")
    private Integer level;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "npc")
    private Boolean npc;
    @Basic
    @Column(name = "perception")
    private Integer perception;
    @Basic
    @Column(name = "rarity")
    private String rarity;
    @Basic
    @Column(name = "reflex_save")
    private Integer reflexSave;
    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String resistance;
    @Basic
    @Column(name = "sense")
    private String sense;
    @Basic
    @Column(name = "size")
    private String size;
    @Basic
    @Column(name = "skill")
    private String skill;
    @Basic
    @Column(name = "source_raw")
    private String sourceRaw;
    @Basic
    @Column(name = "speed")
    private String speed;
    @Basic
    @Column(name = "speed_raw")
    private String speedRaw;
    @Basic
    @Column(name = "strength")
    private Integer strength;
    @Basic
    @Column(name = "strongest_save")
    private String strongestSave;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    @Basic
    @Column(name = "trait")
    private String trait;
    @Basic
    @Column(name = "type")
    private String type;
    @Basic
    @Column(name = "vision")
    private String vision;
    @Basic
    @Column(name = "weakest_save")
    private String weakestSave;
    @Basic
    @Column(name = "weakness")
    private String weakness;
    @Basic
    @Column(name = "will_save")
    private Integer willSave;
    @Basic
    @Column(name = "wisdom")
    private Integer wisdom;
    @Basic
    @Column(name = "spell")
    private String spell;
    @Basic
    @Column(name = "intelligence")
    private Integer intelligence;
    @Basic
    @Column(name = "melee")
    private String melee;
    @Basic
    @Column(name = "ranged")
    private String ranged;
    @Basic
    @Column(name = "ability_description", columnDefinition = "MEDIUMTEXT")
    private String abilityDescription;
    @Basic
    @Column(name = "weapons_name")
    private String weaponsName;
    @Basic
    @Column(name = "armor_name")
    private String armorName;
    @Basic
    @Column(name = "equipment_name")
    private String equipmentName;
    @Basic
    @Column(name = "arcane")
    private String arcane;
    @Basic
    @Column(name = "primal")
    private String primal;
    @Basic
    @Column(name = "divine")
    private String divine;
    @Basic
    @Column(name = "elemental")
    private String elemental;
    @Basic
    @Column(name = "occult")
    private String occult;
    @Basic
    @Column(name = "spells")
    private String spells;




/*    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BestiaryPublic that = (BestiaryPublic) o;
        return id == that.id && Objects.equals(ac, that.ac) && Objects.equals(alignment, that.alignment) && Objects.equals(category, that.category) && Objects.equals(charisma, that.charisma) && Objects.equals(constitution, that.constitution) && Objects.equals(creatureAbility, that.creatureAbility) && Objects.equals(dexterity, that.dexterity) && Objects.equals(fortitudeSave, that.fortitudeSave) && Objects.equals(hp, that.hp) && Objects.equals(immunity, that.immunity) && Objects.equals(language, that.language) && Objects.equals(level, that.level) && Objects.equals(name, that.name) && Objects.equals(npc, that.npc) && Objects.equals(perception, that.perception) && Objects.equals(rarity, that.rarity) && Objects.equals(reflexSave, that.reflexSave) && Objects.equals(resistance, that.resistance) && Objects.equals(sense, that.sense) && Objects.equals(size, that.size) && Objects.equals(skill, that.skill) && Objects.equals(sourceRaw, that.sourceRaw) && Objects.equals(speed, that.speed) && Objects.equals(speedRaw, that.speedRaw) && Objects.equals(strength, that.strength) && Objects.equals(strongestSave, that.strongestSave) && Objects.equals(text, that.text) && Objects.equals(trait, that.trait) && Objects.equals(type, that.type) && Objects.equals(vision, that.vision) && Objects.equals(weakestSave, that.weakestSave) && Objects.equals(weakness, that.weakness) && Objects.equals(willSave, that.willSave) && Objects.equals(wisdom, that.wisdom) && Objects.equals(spell, that.spell) && Objects.equals(intelligence, that.intelligence);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, ac, alignment, category, charisma, constitution, creatureAbility, dexterity, fortitudeSave, hp, immunity, language, level, name, npc, perception, rarity, reflexSave, resistance, sense, size, skill, sourceRaw, speed, speedRaw, strength, strongestSave, text, trait, type, vision, weakestSave, weakness, willSave, wisdom, spell, intelligence);
    }*/
}
