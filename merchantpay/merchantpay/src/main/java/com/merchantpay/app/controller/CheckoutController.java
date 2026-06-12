package com.merchantpay.app.controller;

import com.merchantpay.app.dto.CheckoutRequest;
import com.merchantpay.app.service.CheckoutService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public String checkout(@RequestBody CheckoutRequest request) {
        return checkoutService.checkout(request);
    }
}