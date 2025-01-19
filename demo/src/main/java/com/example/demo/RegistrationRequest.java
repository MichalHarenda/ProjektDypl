package com.example.demo;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
}
