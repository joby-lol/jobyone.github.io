---
title: Client side analytics don't have to be creepy
---

**Edit: [apparently they do suck though]({% post_url site-meta/2022-10-12-analytics-suck %})**

I did it. I broke down and added some Javascript analytics code here. I just want to have fancier stats than I get from Apache logs, okay? I promise it's not actually spooky though, and I hope to hold this forth as a demonstration that you can actually have decent real-time analytics without going full panopticon. As usual you just have to care about privacy ... like even a *little* bit.

Anyway, it's at least all still self-hosted, and I've gone out of my way to keep it all privacy-respecting. I'm using open-source software called [Matomo](https://github.com/matomo-org/matomo)
 to collect these analytics. I put the following config options in place to ensure that I'm being as privacy-conscious as I can about this:

* Anonymizing the last two bytes of your IP address, so even I can't see anyone's full IP.
* Stripping query parameters from referrer URLs to avoid capturing any information about you if you are referred here from another site that keeps identifying info in its URLs.
* Raw data is deleted after 30 days and only aggregate data is kept long-term.
* Do not track headers are respected.

As always, you can also read all about your privacy on my site from the [privacy page](https://byjoby.com/~privacy/) that is linked in the footer.
