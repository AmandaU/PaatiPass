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

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/tickets/{userid}').onWrite((change) => {
  const snapshot = change.after;
  const val = snapshot.val();

  const mailOptions = {
    from: '"JaylaTickets" <noreply@firebase.com>',
    to: val.email,
  };
  
  const reference = 'Reference number: ' + val.reference;
  const total = String(Number(val.tickets) * Number(val.price));
  const numberOfTickets = Number(val.tickets) > 1? ' tickets at R': ' ticket for R';
  const each = Number(val.tickets) > 1? ' each': '';
  const message1 = 'You have successfully purchased ' + val.tickets + numberOfTickets + val.price + each;
  const message2 = 'The total deducted from your account is R' + total;
  const from = 'With love from JaylaTickets xx'

  // Building Email message.

  const referenceNumber = val.reference;
  mailOptions.subject = 'JaylaTickets Order confirmation, reference number: ' + val.reference;
  //mailOptions.text = message ;
  mailOptions.html = '<strong>' + val.eventname +'</strong><br><strong>' + reference +'</strong></br><p>' + message1 +'</p><p>' + message2 +'</p><p>' + from +'</p>';


  return mailTransport.sendMail(mailOptions);
    // .then(() => console.log(`New ticket purchase,with reference number: ${referenceNumber}, email confirmation has been sent`)
    // .catch((error) => console.error('There was an error while sending the email:', error)));
});
