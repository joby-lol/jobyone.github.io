---
title: Mystery counting grid pattern
---

So I was watching [this Vihart video](https://youtu.be/Twik7wqdwZU) (which I highly recommend, by the way), and there's a bit at the end where she's just filling up space on a page by writing out the natural numbers, one per line, looping back to the top when she gets to the bottom and appending the continued ones onto each line. Then she highlighted the different digits in different colors, and a somewhat interesting pattern started to form.

![Screenshot of a vihart video](/assets/2022/vihart-grid.webp)

If you're not clear on what's going on here, here's a small example, of what you get on a 6x5 grid, with alternating bold/italic to show the different numbers that are being counted (read top to bottom, left to right).

<table>
<tr><td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">6</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">0</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">5</td></tr><tr><td style="background-color:rgba(127,127,255,0.5);">2</td>
<td style="background-color:rgba(255,255,255,0.75);">6</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">6</td></tr><tr><td style="background-color:rgba(127,127,255,0.5);">3</td>
<td style="background-color:rgba(255,255,255,0.75);">7</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">2</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">7</td></tr><tr><td style="background-color:rgba(127,127,255,0.5);">4</td>
<td style="background-color:rgba(255,255,255,0.75);">8</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">3</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">8</td></tr><tr><td style="background-color:rgba(127,127,255,0.5);">5</td>
<td style="background-color:rgba(255,255,255,0.75);">9</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">4</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">9</td></tr>
</table>

It gets more interesting when the number of rows isn't a factor of 10, like this 6x4 grid:

<table>
<tr><td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">5</td>
<td style="background-color:rgba(255,255,255,0.75);">9</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">3</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td></tr><tr><td style="background-color:rgba(255,255,255,0.75);">2</td>
<td style="background-color:rgba(127,127,255,0.5);">6</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">0</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">4</td></tr><tr><td style="background-color:rgba(255,255,255,0.75);">3</td>
<td style="background-color:rgba(127,127,255,0.5);">7</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">5</td></tr><tr><td style="background-color:rgba(255,255,255,0.75);">4</td>
<td style="background-color:rgba(127,127,255,0.5);">8</td>
<td style="background-color:rgba(255,255,255,0.75);">1</td>
<td style="background-color:rgba(255,255,255,0.75);">2</td>
<td style="background-color:rgba(127,127,255,0.5);">1</td>
<td style="background-color:rgba(127,127,255,0.5);">6</td></tr>
</table>

So that got me interested in what might happen if I were to make that pattern much bigger, over an arbitrary variety of grid sizes. So I built a little toy that does exactly that (thank you wacky arbitrary code embedding tools!). This displays a gradient from dark to light for digits from 1-9, and zeros are in red.

It's not really as interesting as I'd hoped, but it's not ... *not interesting*.

{% hack 2022/mystery-grid %}
