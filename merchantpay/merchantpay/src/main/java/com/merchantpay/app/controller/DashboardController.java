package com.merchantpay.app.controller;

import com.merchantpay.app.entity.Transaction;
import com.merchantpay.app.service.PaymentLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private PaymentLinkService paymentLinkService;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {

        List<Transaction> transactions = paymentLinkService.getAllTransactions();

        int totalPayments = transactions.size();

        double totalRevenue = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        long successfulPayments = transactions.stream()
                .filter(t -> "SUCCESS".equals(t.getStatus()))
                .count();

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalPayments", totalPayments);
        summary.put("totalRevenue", totalRevenue);
        summary.put("successfulPayments", successfulPayments);

        return summary;
    }

    @GetMapping("/recent-transactions")
    public List<Transaction> getRecentTransactions() {
        return paymentLinkService.getAllTransactions();
    }
}