/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const qr = require('qr-image');
// const sendEmailConfirmationFunction = require('./sendEmailConfirmation');
// const sendGuestEmailFunction = require('./sendGuestEmail');

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

   exports.sendEmailConfirmation = functions.database.ref('/tickets/{userid}').onWrite((change) => {
    const snapshot = change.after;
    const val = snapshot.val();
  
    const mailOptions = {
      from: '"JaylaTickets" <noreply@firebase.com>',
      to: val.email,
      cc: val.ccemail
    };
   
    var imageData = qr.imageSync(val.qrcode, { type: 'png' });
    
      const reference = 'Reference number: ' + val.reference;
    
      var title = 'Hi ' + val.holdername;
     
      var message1 = 'This is your electronic ticket for ' + val.eventname + ', priced at R' + String(val.price) + '.00';
        
      const message2 = 'Please present the attached code at the venue door';
      const message3 = val.venueaddress;
      const message4 = val.venuelatlong;
      const message5 = 'From: ' + val.from + ' to: ' + val.to;
      const from = 'With love from JaylaTickets xx'
    
      // Building Email message.
    
      const referenceNumber = val.reference;
      mailOptions.subject = 'JaylaTickets Order confirmation, reference number: ' + val.reference;
          mailOptions.html = '<strong>' + title +'</strong><br><strong>' + reference +'</strong><br><p>' + message1 +'</p><p>' + message2 +'</p><small>' + message3 +'</small><br><small>' + message4 +'</small><br><small>' + message5 +'</small><br><p>' + from +'</p>';
          mailOptions.attachments = [  
             {
              filename: 'ticket.png',
              content: imageData,
              encoding: 'base64'
            }
          ]
    
      return mailTransport.sendMail(mailOptions);
     
  });

  //exports.handler = function(mailTransport,change) {
    exports.sendGuestEmail = functions.database.ref('/invoices/{reference}').onWrite((change) => {
    const snapshot = change.after;
    const val = snapshot.val();
  
    const mailOptions = {
      from: '"Paati Passports" <noreply@firebase.com>',
      to: val.email,
    };
   
     var reference = "";

      if(val.zapperRef)
      {
        reference = 'Zapper reference number: ' + val.zapperRef;
      }
      else
      {
        reference = 'PayFast reference number: ' + val.payFastRef;
      }
      
     var message1 = Number(val.totalTickets) < 2? '1 ticket ' + val.total: val.totalTickets + ' tickets ';
     message1 += ' to the value of R ' + val.total + '.00';
     var message2 = "";
     if(val.promocode)
     {
      message2 = 'The promotional code ' + val.promocode + ' was used to the value of R ' + val.promotionvalue + '.00';
     }
     else
     {
      message2 = 'No promotional code was used';
     }
      var message3 = 'The total deducted from your account is R ' + val.totalPaid;
      const from = 'With love from Paati Passports xx'
    
      // Building Email message.
    
      mailOptions.subject = 'Paati Passports Ticket invoice';
          mailOptions.html = '<strong>' + reference +'</strong><br><strong>' + val.eventname +'</strong></br><p>' + message1 +'</p><p>' + message2 +'</p><p>' + message3 +'</p><p>' + from +'</p>';
       
      return mailTransport.sendMail(mailOptions);
     
  });
  
   
  
  