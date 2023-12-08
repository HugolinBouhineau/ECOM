package com.mycompany.myapp.service;


import com.mycompany.myapp.domain.Command;
import com.mycompany.myapp.repository.CommandItemRepository;
import com.mycompany.myapp.repository.CommandRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for managing customers.
 */
@Service
@Transactional
public class CommandService {

    private final Logger log = LoggerFactory.getLogger(CommandService.class);

    private final CommandRepository commandRepository;

    public CommandService(CommandRepository commandRepository, CommandItemRepository commandItemRepository) {
        this.commandRepository = commandRepository;
    }

    public List<Command> getCommandsByCustomerId(long customerId){
        return commandRepository.getCommandsByCustomerId(customerId);
    }

}
