package com.example.demo.jwt;

import com.example.demo.MyUserDetailsService;
import io.micrometer.common.lang.NonNullApi;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@NonNullApi
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MyUserDetailsService myUserDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        logger.info("Authorization Header: {}");

        String jwt = null;
        String username = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid JWT Token format: {}");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid JWT Token format");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
                logger.info("UserDetails loaded: {}"); // Log username only for security

                // Extract roles from the JWT claims
                List<String> rolesList = (List<String>) jwtUtil.extractClaim(jwt, claims -> claims.get("roles"));
                Collection<GrantedAuthority> roles = rolesList.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());


                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.info("JWT validated successfully!");
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, roles);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    logger.error("JWT validation failed! Token: {}, Username: {}");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("JWT Validation Failed");
                    return;
                }
            } catch (UsernameNotFoundException ex) {
                logger.error("Username not found: {}");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Username not found");
                return;
            } catch (Exception ex) {
                logger.error("Authentication error: ", ex);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Internal server error");
                return;
            }
        }
        chain.doFilter(request, response);
    }

    // Method to parse roles from a comma-separated string into GrantedAuthority collection
    private Collection<GrantedAuthority> parseRoles(String rolesString) {
        return Arrays.stream(rolesString.split(",")) // Assuming roles are comma-separated in the token
                .map(SimpleGrantedAuthority::new)  // Convert each role to GrantedAuthority
                .collect(Collectors.toList()); // Collect them into a List
    }
}