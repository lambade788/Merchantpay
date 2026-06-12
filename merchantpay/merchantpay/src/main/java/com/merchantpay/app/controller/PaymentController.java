package com.merchantpay.app.controller;

import com.merchantpay.app.entity.Transaction;
import com.merchantpay.app.entity.PaymentLink;
import com.merchantpay.app.service.PaymentLinkService;
import com.merchantpay.app.service.QrCodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentLinkService paymentLinkService;

    @Autowired
    private QrCodeService qrCodeService;

    
    // ==============================
    // ✅ GENERATE QR
    // ==============================
    @GetMapping("/pay/{linkId}/qr")
    public ResponseEntity<byte[]> generateQr(@PathVariable String linkId) throws Exception {

        String paymentUrl = "http://localhost:5173/pay/" + linkId;

        byte[] qr = qrCodeService.generateQR(paymentUrl);

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qr);
    }

    // ==============================
    // ✅ GET ALL PAYMENT LINKS (NEW)
    // ==============================
    @GetMapping("/payment-links")
    public ResponseEntity<List<PaymentLink>> getAllLinks() {
        List<PaymentLink> links = paymentLinkService.getAllLinks();
        return ResponseEntity.ok(links);
    }


    @PostMapping("/pay/{linkId}")
    public ResponseEntity<Transaction> pay(
    @PathVariable String linkId,
    @RequestParam String method
) {
    Transaction txn = paymentLinkService.pay(linkId, method);
    return ResponseEntity.ok(txn);
}
}