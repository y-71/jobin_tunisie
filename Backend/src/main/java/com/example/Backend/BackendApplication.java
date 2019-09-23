package com.example.Backend;

import java.util.Collections;
import com.example.Backend.Model.User;
import com.example.Backend.Model.Role;
import com.example.Backend.Model.RoleName;
import com.example.Backend.Repository.RoleRepository;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  PasswordEncoder passwordEncoder;
    
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    @Bean
    public CommandLineRunner seeDatabase() {
	return args -> {
	        List<Role> roles = roleRepository.findAll();
        	if (roles.size() == 0) {
            		roleRepository.save(new Role(RoleName.ROLE_ADMIN));
            		roleRepository.save(new Role(RoleName.ROLE_ENTERPRISE));
            		roleRepository.save(new Role(RoleName.ROLE_USER));
	                User user = new User("admin", "admin",
        	        "admin@jobin.tn", "admin");
	       		 user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setRoles(Collections.singleton(roleRepository.findByName(RoleName.ROLE_ADMIN).get()));
			userRepository.save(user);
		}
	};
    }
}

