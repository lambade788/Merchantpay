package com.merchantpay.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String linkId;

    private Double amount;

    private String status;

    private LocalDateTime paidAt;

    private String method; // UPI / CARD

    private Long orderId;

    public Transaction() {}

    public Long getId() {
        return id;
    }

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }


    public String getMethod() {
    return method;
    }

    public void setMethod(String method) {
    this.method = method;
    }

    public Long getOrderId() {
    return orderId;
    }

    public void setOrderId(Long orderId) {
    this.orderId = orderId;
    }
}