package com.example.demo.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://16.171.161.151:3000", "http://16.171.161.151:8080", "http://16.171.161.151:8000",
                                "http://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:3000","http://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:8080",
                                "http://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:8000", "http://fantastycznasesja.pl", "http://www.fantastycznasesja.pl",
                        "https://localhost:3000", "https://16.171.161.151:3000", "https://16.171.161.151:8080", "https://16.171.161.151:8000",
                                "https://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:3000","https://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:8080",
                                "https://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:8000", "https://fantastycznasesja.pl", "https://www.fantastycznasesja.pl")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
