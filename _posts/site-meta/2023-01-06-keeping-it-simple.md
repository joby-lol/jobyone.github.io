---
title: Keeping it simple
---

I'm building a new bit of infrastructure for my site, following kind of a lot of experimentation. I'm using GitHub pages and Jekyll to maintain the bulk of the content of this site now. It's **easy** to do it this way, and is also now gonna be extremely secure and fast, because it's just a static site.

It gets complicated when I want to have interesting dynamic stuff though. Rather than maintain a whole CMS for the whole site for just a few things though, I'm building a separate home server (proxied through Cloudflare). That site will integrate with this one through a Turbolinks-esque (PS: DHH sucks, but Turbolinks is a good concept) tool I'm building that will let me embed dynamic content here using short Jekyll template tags. Then the embedded snippets get loaded dynamically and can even intercept links and forms, and do everything they need to do using some fairly straightforward event listeners on links and forms.

I think it's gonna strike a nice balance. Core content is stable and easy to work on, but I can still easily go absolutely nuts with the dynamic/experimental stuff. Also the dynamic/experimental stuff can't ever take the whole site down, and those little experimental widgets should be able to fail gracefully.

So look forward to maybe actually more updates? It could happen!
