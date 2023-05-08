package phonebook.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;
import phonebook.entity.Contact;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ContactController {

    public List<Contact> list = new ArrayList<>();

    @PostMapping("/new-contact")
    public ModelAndView create(@ModelAttribute Contact contact) {
        System.err.println(contact.getName());
        System.err.println(contact.getNumber());
        list.add(contact);
        return new ModelAndView("index.html")
                .addObject("contacts", list);
    }

//    @GetMapping("/remove-contacts/{id}")
//    public String deleteStudent(@ModelAttribute Contact id) {
//        list.remove(id);
//        return "redirect:/";
//
//    }

}
