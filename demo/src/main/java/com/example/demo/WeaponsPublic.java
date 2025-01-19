package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "weapons_public")
public class WeaponsPublic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String damage;
    private Integer damageDie;
    private Integer hands;
    private String itemCategory;
    private String itemSubcategory;
    private Integer level;
    private String name;
    private Integer price;
    private Integer pp;
    private Integer gp;
    private Integer sp;
    private Integer cp;
    private String rarity;
    private String sourceRaw;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    private String trait;
    private String weaponCategory;
    private String weaponGroup;
    private String weaponType;
    private String access;
    private BigDecimal bulk;
}
