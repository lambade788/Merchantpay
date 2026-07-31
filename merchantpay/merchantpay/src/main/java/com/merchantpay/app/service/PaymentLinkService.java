package com.merchantpay.app.service;

import com.merchantpay.app.entity.PaymentLink;
import com.merchantpay.app.entity.Transaction;
import com.merchantpay.app.entity.Order;
import com.merchantpay.app.repository.OrderRepository;
import com.merchantpay.app.repository.PaymentLinkRepository;
import com.merchantpay.app.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentLinkService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentLinkRepository paymentLinkRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SseService sseService;

    // ==============================
    // ✅ CREATE PAYMENT LINK
    // ==============================
    public PaymentLink createPaymentLink(Double amount, String description) {

        PaymentLink link = new PaymentLink();

        link.setLinkId(UUID.randomUUID().toString());
        link.setAmount(amount);
        link.setDescription(description);
        link.setStatus("ACTIVE");
        link.setCreatedAt(LocalDateTime.now());

        return paymentLinkRepository.save(link);
    }

    // ==============================
    // ✅ PAY (DEMO PAYMENT)
    // ==============================
    public Transaction pay(String linkId, String method) {

        // 🔍 Find payment link
        PaymentLink link = paymentLinkRepository.findByLinkId(linkId);

        if (link == null) {
            throw new RuntimeException("Payment link not found");
        }

        // ❌ Prevent double payment
        if ("PAID".equals(link.getStatus())) {
            throw new RuntimeException("Payment already completed");
        }

        // ✅ Update payment link status
        link.setStatus("PAID");
        paymentLinkRepository.save(link);

        // ✅ Create transaction
        Transaction tx = new Transaction();
        tx.setLinkId(linkId);
        tx.setAmount(link.getAmount());
        tx.setStatus("SUCCESS");
        tx.setMethod(method);
        tx.setPaidAt(LocalDateTime.now());

        // 🔥 LINK ORDER
        tx.setOrderId(link.getOrderId());

        Transaction savedTx = transactionRepository.save(tx);

        // 🔥 UPDATE ORDER STATUS
        if (link.getOrderId() != null) {
            Order order = orderRepository.findById(link.getOrderId()).orElseThrow();
            order.setStatus("SUCCESS");
            orderRepository.save(order);
        }

        // 🚀 Broadcast SSE real-time Soundbox notification
        try {
            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("amount", savedTx.getAmount());
            payload.put("method", savedTx.getMethod());
            payload.put("linkId", savedTx.getLinkId());
            payload.put("paidAt", savedTx.getPaidAt().toString());
            sseService.broadcast("payment_success", payload);
        } catch (Exception e) {
            System.err.println("Failed to broadcast SSE notification: " + e.getMessage());
        }

        return savedTx;
    }

    // ==============================
    // ✅ GET PAYMENT LINK
    // ==============================
    public PaymentLink getPaymentLink(String linkId) {

    PaymentLink link = paymentLinkRepository.findByLinkId(linkId);

    // 🔥 AUTO FIX IF MISSING
    if (link == null) {

        System.out.println("⚠️ Link missing. Auto-creating...");

        // find order using linkId
        Order order = orderRepository.findByPaymentLinkId(linkId);

        if (order == null) {
            throw new RuntimeException("Invalid payment link");
        }

        // create new link
        PaymentLink newLink = new PaymentLink();
        newLink.setLinkId(linkId);
        newLink.setAmount(order.getTotalAmount());
        newLink.setStatus("ACTIVE");
        newLink.setOrderId(order.getId());
        newLink.setCreatedAt(LocalDateTime.now());

        return paymentLinkRepository.save(newLink);
    }

    return link;
}

    // ==============================
    // ✅ SAVE LINK (for checkout)
    // ==============================
    public PaymentLink saveLink(PaymentLink link) {
        return paymentLinkRepository.save(link);
    }

    // ==============================
    // ✅ GET ALL TRANSACTIONS
    // ==============================
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByPaidAtDesc();
    }

    public List<PaymentLink> getAllLinks() {
        return paymentLinkRepository.findAll();
    }
}