package com.example.Main.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/").setViewName("home");
        registry.addViewController("/auth").setViewName("auth");
        registry.addViewController("/workspace").setViewName("workspace");
        registry.addViewController("/network").setViewName("network");
        registry.addViewController("/taskmanager").setViewName("taskmanager");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**") 
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600) 
                .resourceChain(true);
    }
}