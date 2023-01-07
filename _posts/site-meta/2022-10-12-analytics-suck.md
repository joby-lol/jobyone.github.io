---
title: Apparently client-side analytics do have to suck though
---

Not too long ago I was [so proud that I'd put together an open-source analytics server]({% post_url site-meta/2022-09-01-client-side-analytics %}) and was gonna start getting nice analytics using only my own servers and software I control. Lol. Just kidding.

Matomo took a shit and borked itself on the very first automated update. This was a totally vanilla install. Nothing unusual. Extremely light system load. Not a single plugin. Should be basically the first line of acceptance testing, if they do that over there. But no. It's broken. I can't be arsed to fix it, either, so no more client side analytics.

PS: I think there's a fresh not-invented-here-itis web app incoming. Apparently if I want single-site-scale analytics that aren't weighed down by mountains of cruft I may need to build it myself. I've got maybe a kinda clever idea though...
