package com.example.demo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GetAllData {
    // Getters and Setters
    private List<Spells> spells;
    private List<EquipmentPublic> equipment;
    private List<WeaponsPublic> weapons;
    private List<ArmorsPublic> armors;

}
