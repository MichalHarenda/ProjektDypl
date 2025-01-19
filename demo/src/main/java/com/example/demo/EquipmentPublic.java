package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
@Table(name = "equipment_public")
public class EquipmentPublic {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private long id;
    @Basic
    @Column(name = "actions")
    private String actions;
    @Basic
    @Column(name = "bulk")
    private BigDecimal bulk;
    @Basic
    @Column(name = "category")
    private String category;
    @Basic
    @Column(name = "item_category")
    private String itemCategory;
    @Basic
    @Column(name = "item_subcategory")
    private String itemSubcategory;
    @Basic
    @Column(name = "level")
    private Integer level;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "pfs")
    private String pfs;
    @Basic
    @Column(name = "price")
    private Integer price;
    @Basic
    @Column(name = "pp")
    private Integer pp;
    @Basic
    @Column(name = "gp")
    private Integer gp;
    @Basic
    @Column(name = "sp")
    private Integer sp;
    @Basic
    @Column(name = "cp")
    private Integer cp;
    @Basic
    @Column(name = "rarity")
    private String rarity;
    @Basic
    @Column(name = "school")
    private String school;
    @Basic
    @Column(name = "source_raw")
    private String sourceRaw;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    @Basic
    @Column(name = "type")
    private String type;
    @Basic
    @Column(name = "hands")
    private Integer hands;
    @Basic
    @Column(name = "skill")
    private String skill;
    @Basic
    @Column(name = "trait")
    private String trait;

}
