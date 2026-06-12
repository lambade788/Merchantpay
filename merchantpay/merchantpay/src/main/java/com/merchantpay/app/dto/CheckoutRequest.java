package com.merchantpay.app.dto;

import java.util.List;

public class CheckoutRequest {

    private Long userId;
    private List<CartItem> items;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }
}