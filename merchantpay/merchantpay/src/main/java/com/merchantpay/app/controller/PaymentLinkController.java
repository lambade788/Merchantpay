package com.merchantpay.app.controller;

import com.merchantpay.app.entity.PaymentLink;
import com.merchantpay.app.service.PaymentLinkService;
import com.merchantpay.app.service.QrCodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/payment-links")
public class PaymentLinkController {

    @Autowired
    private PaymentLinkService paymentLinkService;

    @Autowired
    private QrCodeService qrCodeService;

    @PostMapping
    public PaymentLink createLink(@RequestBody PaymentLink request) {

        return paymentLinkService.createPaymentLink(
                request.getAmount(),
                request.getDescription()
        );
    }

    @GetMapping("/{linkId}")
    public PaymentLink getLink(@PathVariable String linkId) {

        return paymentLinkService.getPaymentLink(linkId);
    }

    @GetMapping("/{linkId}/qr")
    public ResponseEntity<byte[]> generateQr(@PathVariable String linkId) throws Exception {

       String paymentUrl = "http://localhost:3000/pay/" + linkId;

        byte[] qr = qrCodeService.generateQR(paymentUrl);

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qr);
    }
}