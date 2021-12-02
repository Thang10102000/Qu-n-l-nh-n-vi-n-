package com.vti.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.vti.service.IEmailService;

@Component
public class SendRegistrationUserConfirmViaEmailListener implements ApplicationListener<OnSendRegistrationUserConfirmViaEmailEvent> {
	@Autowired
	private IEmailService emailService;

	@Override
	public void onApplicationEvent(OnSendRegistrationUserConfirmViaEmailEvent event) {
		emailService.sendRegistrationUserConfirm(event.getEmail());

	}

}
