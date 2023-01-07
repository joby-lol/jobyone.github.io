---
title: Update to my Apache VirtualHost settings for automatic subdomains
---

I've updated my Apache config since [the post I made yesterday]({% post_url site-meta/2020-10-01-apache-automatic-subdomains %}) about creating subdomains based on directory names. The revisions are fairly small, but important. Since yesterday I moved my DNS nameservers to a new provider who doesn't offer redirects the way Namecheap did, so I had to get my own configuration to gracefully handle redirecting byjoby.com to www.byjoby.com, both with and without SSL.

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
    # Redirect to www if there's no subdomain
    RewriteEngine on
    RewriteCond %{SERVER_NAME} ^byjoby.com$
    RewriteRule ^ https://www.byjoby.com%{REQUEST_URI} [END,NE,R=permanent]
    # The next 3 lines pull the necessary certificates and config from Lets Encrypt
    SSLCertificateFile /etc/letsencrypt/live/byjoby.com-0001/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/byjoby.com-0001/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

I also hit some snags with the way Let's Encrypt issues wildcard certificates in a way that prevents them from working on the root domain (i.e. my certificate was working for all my subdomains, but not just `byjoby.com`), but that's a story for another day.
