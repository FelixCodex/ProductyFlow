package com.example.Main.Controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.util.HtmlUtils;

import com.example.Main.Models.Message;
import com.example.Main.Models.Notify;



@Controller
public class WebSocketController {

	@MessageMapping("/notify/{id}")
	@SendTo("/group/{id}")
	public Notify notify(@DestinationVariable String id,Message message) throws Exception {
		System.out.println("/topic/"+id);
		// Thread.sleep(1000); // simulated delay
		return new Notify(id,HtmlUtils.htmlEscape(message.message()));
	}
	
}

