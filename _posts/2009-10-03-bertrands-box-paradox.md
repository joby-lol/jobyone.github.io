---
title:  Modeling the Bertrand's Box paradox
permalink: /blog/modeling_the_bertrands_box_paradox/
---

I was recently introduced to a rather interesting paradox, by a rather interesting book.  I've been reading *Sixty Days and Counting* by Kim Stanley Robinson, and it introduced what it called the "three-box game."  I was intrigued by it, and after a little research I found it was officially known as [Bertrand's box paradox](http://en.wikipedia.org/wiki/Bertrand%27s_box_paradox).

I'm not as eloquent as Robinson, so I'll just quote the book for his wonderful explanation.

> One test that had caught even Frank, despite his vigilance, was the three-box game. Three boxes, all closed, one ten-dollar bill hidden in one of them; the experimenter knows which. Subject chooses one box, at that point left closed. Experimenter opens one of the other two boxes, always an empty one. Subject then offered a chance to either stick with his first choice, or switch to the other closed box. Which should he do?
> 
> Frank had decided it didn't matter; fifty-fifty either way. He thought it through.
> 
> But each box at the start had a one-third chance of being the one. When subject chooses one, the other two have two-thirds chance of being right. After experimenter opens one of those boxes, always empty, those two boxes still have two-thirds of a chance, now concentrated in the remaining unchosen box, while the subject's original choice still had its original one-third chance. So one should always change one's choice!

It boggles the mind, right? After having it explained I do have some grasp of why it happens that way, but I still felt the need to empirically test it.  So I wrote a little PHP script that plays the three-box game with itself, and set it to run a hundred thousand times each way.
And what do you know? This is one thought-puzzle that holds up to empirical testing!

```text
Played 100000 games each:  
bet kept: 33268 wins  
bet changed: 66738 wins
```

If you're so inclined, here's the PHP I used:

```php
function boxgame ($change_bet) {
  $boxes = array();
  $bet = rand(1,3);
  $coin = rand(1,3);
  $boxes[1] = 'empty';
  $boxes[2] = 'empty';
  $boxes[3] = 'empty';
  $boxes[$coin] = 'coin';

  //this is where the actual game is played
  if ($change_bet == true) {
    foreach ($boxes as $box => $content) {
      if ($box == $bet) {
      }elseif ($content == 'coin') {
      }else {
        unset($boxes[$box]);
        break;
      }
    }

    foreach ($boxes as $box => $content) {
      if ($box != $bet) {
        $bet = $box;
        break;
      }
    }
  }

  if ($boxes[$bet] == 'coin') {
    $result = 'win';
  }else {
    $result = 'lose';
  }
  return($result);
}

$iterations = 100000;
$results = array();
$results['keep bet'] = array();
$results['change bet'] = array();

for ($i = 1; $i <= $iterations; $i++) {
  $results['keep bet'][boxgame(false)]++;
  $results['change bet'][boxgame(true)]++;
}

echo "Played $iterations games each:<br>bet kept: ".$results['keep bet']['win']." wins<br>bet changed: ".$results['change bet']['win']." wins";
```
