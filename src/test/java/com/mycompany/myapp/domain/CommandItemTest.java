package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommandItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CommandItem.class);
        CommandItem commandItem1 = new CommandItem();
        commandItem1.setId(1L);
        CommandItem commandItem2 = new CommandItem();
        commandItem2.setId(commandItem1.getId());
        assertThat(commandItem1).isEqualTo(commandItem2);
        commandItem2.setId(2L);
        assertThat(commandItem1).isNotEqualTo(commandItem2);
        commandItem1.setId(null);
        assertThat(commandItem1).isNotEqualTo(commandItem2);
    }
}
