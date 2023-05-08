package phonebook.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MyController {

    public String pageTest = "";

    @GetMapping("home")
    public ModelAndView ger(ModelAndView mav) {
        mav.setViewName("home.html");
        this.pageTest = "HOOME";
        mav.addObject("page123456", pageTest);
        mav.addObject("bestStudent", "ТЭМҮГЭ");
        return  mav;
    }

    @GetMapping("ger")
    public ModelAndView ger1(ModelAndView mav) {
        mav.setViewName("home.html");
        this.pageTest = "GER";
        mav.addObject("page123456", pageTest);
        mav.addObject("bestStudent", "TESET");
        return  mav;
    }
}
