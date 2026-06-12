package com.merchantpay.app.service;

import com.merchantpay.app.dto.CartItem;
import com.merchantpay.app.dto.CheckoutRequest;
import com.merchantpay.app.entity.Order;
import com.merchantpay.app.entity.OrderItem;
import com.merchantpay.app.entity.Product;
import com.merchantpay.app.entity.PaymentLink;
import com.merchantpay.app.repository.OrderRepository;
import com.merchantpay.app.repository.OrderItemRepository;
import com.merchantpay.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private PaymentLinkService paymentService;


    @Transactional
public String checkout(CheckoutRequest request) {

    double total = 0;

    // 1. Validate Stock
    for (CartItem item : request.getItems()) {
        Product product = productRepo.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < item.getQuantity()) {
            throw new RuntimeException("Insufficient stock for " + product.getName());
        }

        product.setStock(product.getStock() - item.getQuantity());
        productRepo.save(product);

        total += product.getPrice() * item.getQuantity();
    }

    // 2. Create Order
    Order order = new Order();
    order.setUserId(request.getUserId());
    order.setTotalAmount(total);
    order.setStatus("PENDING");
    order = orderRepo.save(order);

    // 3. Create Order Items
    for (CartItem item : request.getItems()) {
        OrderItem oi = new OrderItem();
        oi.setOrderId(order.getId());
        oi.setProductId(item.getProductId());
        oi.setQuantity(item.getQuantity());
        orderItemRepo.save(oi);
    }

    // 🔥 4. CREATE PAYMENT LINK (WITH ORDER ID)
    PaymentLink link = new PaymentLink();
    link.setLinkId(java.util.UUID.randomUUID().toString());
    link.setAmount(total);
    link.setDescription("Order #" + order.getId());
    link.setStatus("ACTIVE");
    link.setCreatedAt(java.time.LocalDateTime.now());

    // ✅ IMPORTANT
    link.setOrderId(order.getId());

    // SAVE ONLY ONCE
    link = paymentService.saveLink(link);

    // 5. Attach to Order
    order.setPaymentLinkId(link.getLinkId());
    orderRepo.save(order);

    return link.getLinkId();
}
}