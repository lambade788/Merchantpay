package com.merchantpay.app.controller;

import com.merchantpay.app.dto.LoginRequest;
import com.merchantpay.app.dto.RegisterRequest;
import com.merchantpay.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
    
        return authService.login(request);
    }

}