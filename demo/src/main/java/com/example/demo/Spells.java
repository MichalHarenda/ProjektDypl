package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "spells")
public class Spells {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String actions;
    private String bloodline;
    private String category;
    private String component;
    private String heighten;
    private Integer level;
    private String pfs;
    private Integer spellRange;
    private String rangeRaw;
    private String rarity;
    private String savingThrow;
    private String school;
    private String sourceRaw;
    private String summary;
    private String target;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    private String tradition;
    private String trait;
    private String type;
}
