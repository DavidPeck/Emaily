const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
    constructor({ subject, recipients} , content ) {
        super();

        this.from_email = new helper.Email('no-reply@datamer.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses(recipients) {
        return recipients.map(( { email } ) => {
            return new helper.Email(email);
        });
    }

    addClickTracking() {
        const trackingSetting = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSetting.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSetting);
    }
}

module.exports = Mailer;