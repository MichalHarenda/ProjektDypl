package com.example.demo;

import lombok.Getter;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/dice")
public class DiceRollController {

    @GetMapping("/roll")
    public RollResult rollDice(@RequestParam String rollInput) {
        String[] diceSpecs = rollInput.split("\\+");
        List<Integer> results = new ArrayList<>();
        int total = 0;
        Random random = new Random();

        for (String spec : diceSpecs) {
            spec = spec.trim(); // Trim whitespace
            String[] parts = spec.split("d");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid dice specification: " + spec);
            }

            int count = Integer.parseInt(parts[0]);
            int sides = Integer.parseInt(parts[1]);

            for (int i = 0; i < count; i++) {
                int roll = random.nextInt(sides) + 1;
                results.add(roll);
                total += roll;
            }
        }

        return new RollResult(results, total);
    }

    @Getter
    static class RollResult {
        private final List<Integer> results;
        private final int total;

        public RollResult(List<Integer> results, int total) {
            this.results = results;
            this.total = total;
        }

    }
}
