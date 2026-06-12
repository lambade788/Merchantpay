package com.merchantpay.app.repository;

import com.merchantpay.app.entity.PaymentLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentLinkRepository extends JpaRepository<PaymentLink, Long> {

    PaymentLink findByLinkId(String linkId);

}