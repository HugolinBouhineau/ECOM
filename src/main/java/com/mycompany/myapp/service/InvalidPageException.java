package com.mycompany.myapp.service;

public class InvalidPageException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidPageException(int page) {
        super(String.format("Page {} is not found!", page));
    }
}
