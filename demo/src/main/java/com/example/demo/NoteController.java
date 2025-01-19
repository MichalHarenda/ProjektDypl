package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CampaignService campaignService;

    @GetMapping("/notes/{campaignId}")
    public ResponseEntity<List<Note>> getNotesForCampaign(@PathVariable Long campaignId, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(campaignId));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Note> notes = noteRepository.findByCampaignId(campaignId);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/notes")
    public ResponseEntity<Note> createNote(@RequestBody Note note, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(note.getCampaignId()));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Note createdNote = noteRepository.save(note);
        return ResponseEntity.ok(createdNote);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note updatedNote, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        Optional<Note> noteOptional = noteRepository.findById(id);
        if (noteOptional.isEmpty() ) {
            return ResponseEntity.notFound().build();
        }
        Note note = noteOptional.get();
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(note.getCampaignId()));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        note.setTitle(updatedNote.getTitle());
        note.setNote(updatedNote.getNote());
        Note updated = noteRepository.save(note);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Note> noteOptional = noteRepository.findById(id);
        if (noteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Note note = noteOptional.get();
        User user = userRepository.findByUsername(userDetails.getUsername());
        boolean authorized = campaignService.getCampaignsByUserId(user.getId()).stream().anyMatch(c -> c.getId().equals(note.getCampaignId()));
        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
