package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeaponsPrivateRepository extends JpaRepository<WeaponsPrivate, Long> {
    List<WeaponsPrivate> findByCampaignId(Long campaignId);
}
