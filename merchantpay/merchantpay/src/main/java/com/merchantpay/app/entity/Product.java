package com.merchantpay.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product") // Explicitly link to your MySQL table
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private int stock;
    
    @Column(columnDefinition = "TEXT") // Allows for long URLs
    private String description;
    
    // ✅ This maps the Java "imageUrl" to the MySQL "image_url" column
    @Column(name = "image_url")
    private String imageUrl; 

    private Long merchantId;

    // Default Constructor (Required by JPA)
    public Product() {}

    // Getters and Setters
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() { 
        return name; 
    }

    public void setName(String name) { 
        this.name = name; 
    }

    public double getPrice() { 
        return price; 
    }

    public void setPrice(double price) { 
        this.price = price; 
    }

    public int getStock() { 
        return stock; 
    }

    public void setStock(int stock) { 
        this.stock = stock; 
    }

    public String getDescription() { 
        return description; 
    }

    public void setDescription(String description) { 
        this.description = description; 
    }
    
    public String getImageUrl() { 
        return imageUrl; 
    }

    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }

    public Long getMerchantId() { 
        return merchantId; 
    }

    public void setMerchantId(Long merchantId) { 
        this.merchantId = merchantId; 
    }
}