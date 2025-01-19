package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "campaign")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userid", nullable = false)
    private Long userId;

    @Column(name = "campaign_name", nullable = false)
    private String campaignName;

    @Column(name = "description", nullable = false)
    private String description;

    public Campaign() {}

    public Campaign(Long userId, String campaignName, String description) {
        this.userId = userId;
        this.campaignName = campaignName;
        this.description = description;
    }
}
