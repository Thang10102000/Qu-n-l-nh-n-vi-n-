package com.vti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@SpringBootApplication(scanBasePackages = "com.vti")
@ComponentScan( "com.vti.controller")  
@ComponentScan( "com.vti.service")
@EntityScan("com.vti.entity")
@EnableJpaRepositories("com.vti.repository")

@ConfigurationPropertiesScan("com.vti.config.security")
@ComponentScan("com.vti.config.security")


public class Lab3Application {

	public static void main(String[] args) {
		SpringApplication.run(Lab3Application.class, args);
	}

}
