---
title:  How to use an iCloud custom domain email address in Windows Mail
permalink: /blog/icloud_custom_domain_windows_mail/
---
I use a custom domain name for my email, because it means I can port my whole address around. I do not want to try and run my own email server though, because that's a whole can of worms that I simply do not want to deal with (thanks, spam). So at the moment I use iCloud to host my email, because it's "free" (since I'm already paying for Apple One and would be either way), and integrates seamlessly on my iPhone that way.

I don't use a Mac as my main computer though, and syncing my email, contacts, and calendar to a desktop app has been a pain point. Email is easy -- it's just IMAP and SMTP. iCloud's CalDAV and CardDAV servers are wacky, and don't work right in some clients, and there's a whole rigamarole for even figuring out what they are for *you* because they're different for different people -- because *of course they are.*

Windows Mail and Calendar, the built-in mail/calendar app on Windows 10/11 are actually very polished, and pretty pleasant to work with, and they integrate well with the rest of the OS. I used to use those when I was hosting through Gmail, and I wanted to keep doing that. So imagine my joy when I spotted "iCloud" on the list of account types in there!

Sadly Windows Mail's default iCloud account won't let you "send as," and iCloud's servers won't let you sign in using your custom domain email. So while I could sync everything, I couldn't send as my preferred email address, and that was kinda killing me.

So I found a workaround. It's kind of a lot of steps, but the gist of it is that you set up iCloud *twice* in Windows Mail. Once using the default settings, but with mail sync turned off. That one syncs your contacts and calendar. Then you use the advanced account adding option to manually add the iCloud IMAP/SMTP account, so that you can sync your email *and* send as your preferred address.

It's not perfect ... but it works really well.

## Step 1: Add an iCloud account

Open up Windows Mail. If this is your first time launching it you should get the add accounts box first. If you already have an account added, click "Accounts" on the left bar, then "Add account" on the right bar that appears. Then select "iCloud"

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 143615.webp)

Fill out the form that appears using your `@icloud.com` email address, or it won't accept it. You'll also need to use an app-specific password instead of your actual password, generated on [https://appleid.apple.com/](appleid.apple.com). **Keep this password up after this step.** You will need to enter it again later.

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 143936.webp)

You now have iCloud synced. If you didn't want to send as your preferred custom domain address, you'd be done. It appears to name iCloud accounts some machine gibberish by default, but you could change that and call it a day right now.

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 144113.webp)

## Step 2: Turn off mail sync for this account

Now we need to turn off email syncing for this account, because we'll be adding a second account for that and only using this one to sync. Click "Accounts" on the left, then your freshly-added account on the right.

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 144212.webp)

Then change the name to something like "iCloud (contacts/calendar)" to indicate that this account isn't used for email. Click on "Change mailbox sync settings" and uncheck the option to sync email. Click "Done" followed by "Save" to save all changes and finish setting up this account.

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 144254.webp)
![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 144353.webp)

## Step 3: Add a custom IMAP/SMTP account for email

Next you'll add a custom account to allow you to sync email, while also sending as your preferred account.

Click "Add account" in the right bar. If the right bar has hidden because you clicked somewhere else, click accounts on the left bar again to bring it back up. In the box that comes up choose "Advanced setup" and then "Internet email" on the next screen.

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 145003.webp)
![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 145120.webp)

Fill out the settings as shown. Make sure that the *first* email address is your preferred email at your custom domain, and that the *second* one is your actual `@icloud.com` address. All the other default settings lower down should be fine. The servers you'll need to fill in are:

Incoming:  `imap.mail.me.com:993:1`  
Outgoing:  `smtp.mail.me.com:587:0`

Click "Sign in" and you should now be good to go!

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 145234.webp)

You should now have a fully-functional iCloud setup using Windows Mail, Calendar, and contacts. It's more steps than it should be (hey Microsoft! Add a "send as" field to the iCloud wizard, please), but the end result works great. It's fully integrated with Windows, and doesn't do anything goofy as far as IMAP folder naming goes (*cough cough*Thunderbird*cough cough*).

![screenshot](/assets/2022/icloud-blog/Screenshot 2022-11-16 145455.webp)
