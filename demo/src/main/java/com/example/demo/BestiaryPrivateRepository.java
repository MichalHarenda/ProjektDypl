package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BestiaryPrivateRepository extends JpaRepository<BestiaryPrivate, Long> {
    List<BestiaryPrivate> findByCampaignId(Long campaignId);
}