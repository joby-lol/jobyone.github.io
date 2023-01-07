---
title: "Apache: Automatic subdomains with SSL from directory names"
---

So I've solved part of this particular problem about a gazillion times, and I just now had reason to solve it again so I decided to write it down. I run this main site of mine, and several other subdomains that do ... other things ... off one Apache server, and I've gotten sick of configuring subdomains whenever I want to add a new one.

Until now I've been manually adding an Apache site config for every single subdomain, then using certbot to generate an SSL certificate for that subdomain, then manually editing that config to enable SSL. It's not a huge amount of work, but it **is** kind of a pain in the ass.

So this afternoon I finally got set up with a wildcard certificate from [Let's Encrypt](https://letsencrypt.org/). Now all my subdomains can use one certificate, and it was time to configure Apache so that creating a subdomain is as easy as creating a directory.

## DNS config

Step one was to remove the records for each individual subdomain, and create just one wildcard CNAME record pointing all of them at the server.

## Apache config

First I disabled all my existing site configs, using `a2dissite`.

Then I created a new config in `sites-available` named `wildcard.byjoby.com.conf`, with the following settings (almost, I took out some commented out bits that I'm still working on):

```apache
# Set up the basic settings for the whole site
<Directory "/home/www/byjoby.com/">
    Options None
    AllowOverride All
    Order allow,deny
    Allow from all
</Directory>

# This section redirects all requests on port 80 to HTTPS
<VirtualHost *:80>
    ServerName %1.byjoby.com
    RewriteEngine on
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

# This section catches all requests on port 443 and sets
# their VirtualDocumentRoot to be a subdirectory of byjoby.com
# named for the requested subdomain
<VirtualHost *:443>
    ServerName %1.byjoby.com
    VirtualDocumentRoot /var/www/byjoby.com/%1/web/
    # The next 3 lines pull the necessary certificates and config from Lets Encrypt
    SSLCertificateFile /etc/letsencrypt/live/byjoby.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/byjoby.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

And it works! I can now create new subdomains at the drop of a hat. The only downside is that Let's Encrypt's wildcard certificates are only valid for 2 months, so I need to figure out how to enable automatic re-generation of them.

I can't do that while my domain is managed by Namecheap though, so it's gonna be a whole damn thing. I need to either switch domain registrars, or transfer control of my domain to Digital Ocean because that's where I keep my server, and they offer some cool integrations and have a Let's Encrypt module that would let me automate renewals.

They don't do email forwarding though, so if I go that route I'll need to set up my own email forwarding server.