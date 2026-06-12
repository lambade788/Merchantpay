package com.merchantpay.app.repository;
import java.util.List;
import com.merchantpay.app.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
     List<Transaction> findAllByOrderByPaidAtDesc();
}