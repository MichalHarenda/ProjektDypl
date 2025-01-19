package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "armors_private")
public class ArmorsPrivate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer ac;
    private String armorCategory;
    private String armorGroup;
    private BigDecimal bulk;
    private Integer checkPenalty;
    private Integer dexCap;
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
    private Integer strength;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;
    private String trait;
    private String access;
    private String speedPenalty;
    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;
}
