package com.merchantpay.app.service;

import com.merchantpay.app.security.JwtUtil;
import com.merchantpay.app.dto.LoginRequest;
import com.merchantpay.app.dto.RegisterRequest;
import com.merchantpay.app.entity.User;
import com.merchantpay.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(RegisterRequest request) {

    if(userRepository.findByEmail(request.getEmail()).isPresent()){
        return "Email already registered";
    }

    User user = new User();
    user.setBusinessName(request.getBusinessName());
    user.setEmail(request.getEmail());

    String encryptedPassword = passwordEncoder.encode(request.getPassword());
    user.setPassword(encryptedPassword);

    userRepository.save(user);

    return "Merchant registered successfully";
    }

    public String login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);

    if (user == null) {
        return "User not found";
    }

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return "Invalid password";
    }

    String token = jwtUtil.generateToken(user.getEmail());

    return token;
   }
}