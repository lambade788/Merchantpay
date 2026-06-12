package com.merchantpay.app.controller;

import com.merchantpay.app.entity.Transaction;
import com.merchantpay.app.service.PaymentLinkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final PaymentLinkService paymentLinkService;

    public TransactionController(PaymentLinkService paymentLinkService) {
        this.paymentLinkService = paymentLinkService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return paymentLinkService.getAllTransactions();
    }

}