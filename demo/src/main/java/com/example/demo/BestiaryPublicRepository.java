package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BestiaryPublicRepository extends JpaRepository<BestiaryPublic, Long> {
    //No campaignId, so no findByCampaignId needed here.
}