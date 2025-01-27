
package com.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.demo.model.Product;
import com.demo.model.ProductList;
import com.demo.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController //http://localhost:8080/ 
public class ProductController {


    @GetMapping("/api/products") //http://localhost:8080/api/products
    public List<Product> getProducts() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductList productList = objectMapper.readValue(new ClassPathResource("product.json").getInputStream(), ProductList.class);
        return productList.getProducts(); 
    }
    
   
}