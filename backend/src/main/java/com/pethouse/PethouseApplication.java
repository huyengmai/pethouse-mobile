package com.pethouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.pethouse")
@EnableScheduling
public class PethouseApplication {

	public static void main(String[] args) {
		SpringApplication.run(PethouseApplication.class, args);
	}

}
