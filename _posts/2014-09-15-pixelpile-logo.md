---
title: How the Pixel{pile} logo works
---

<div class="pixelpile-color-1 pixelpile-dark" style="text-align:center;padding:5px;">
    <div class="pixelpile-lockup">
        <div class="pixelpile-logo">![Pixelpile logo](/assets/2014/pixelpile/pixelpile-logo.webp)</div>
        <div class="pixelpile-logotype">
            <div class="pixelpile-logotype-primary">Pixel{<span class="pixelpile-logotype-pile">pile</span>}</div>
            <div class="pixelpile-logotype-secondary">design &amp; development</div>
        </div>
    </div>
</div>

For some time now I've had aspirations of striking out on my own to found a digital design agency. It's a niche that is sorely lacking in Albuquerque, and I think I could fill it. To that end I've been working on an identity for such an agency, and have settled on something fairly slick.

I started off by building just a [simple set of Javascripts for simulating and displaying sandpile simulations]({% post_url 2022-07-29-old-sandpile-model %}) (as of this writing it's not done, but hey, that's why I put my experimental projects on a different server!). They're pretty simple, in terms of the rules that govern them. Traditionally they're a grid, where as you drop grains onto that grid, they stack. If any stack gets to four grains or more, it topples -- distributing its top four grains to its cardinal neighbors.

There are a great many interesting things to be said about sandpiles, but this is not the place for that. If you're interested, I suggest you start with the [Abelian sandpile model page of Wikipedia](http://en.wikipedia.org/wiki/Abelian_sandpile_model).

Then I realized that this thing was a fantastic source of interesting visualization. Unlike a lot of cellular automata (like say, the game of life I used to have on my home page) it's interesting not just spatially, but temporally. The changes to the landscape come in intermittent waves, as critical states build up, then suddenly collapse when just one grain falls in the right place.

So I took that model, and had it build a 12x12 pile, populate it with random stacks, then set the 4x4 area in the middle to match the starting state of the logo. Then it replaces the image logo with a grid of DIV tags, which are given CSS classes according to their height every 50ms.

It also allows the use of the sandpile data to build interesting horizontal spacers, as seen below the logo above. These are built using the same data as the logo, so they shift along with it, which creates a very pleasant and synchronized effect.

Generally it's cool, and I'm very proud of it, even if I'm not quite sold on my color scheme yet. If you'd like to see more versions of it, and experience the way multiple logos on a single page animate in sync, check out the Pixel{pile} logo page on my experimental projects site.

<script src="/assets/2022/sandpile/sandpile-model.js"></script>
<script src="/assets/2014/pixelpile/jquery.js"></script>
<script src="/assets/2014/pixelpile/pixelpile-logo.js"></script>
<link rel="stylesheet" href="/assets/2014/pixelpile/pixelpile-logo.css" />
