---
title: Flatrr
---

Flatrr is a utility library for accessing arrays via flattened key names. So, for example, rather than using `$arr['foo']['bar']` you could use `$arr['foo.bar']`. Mostly this is useful if you want to use string building to make the keys you're going to use to access an array.

It should be noted that because of the way arrays and references work, this is not going to work exactly the same way as a native array in all cases. There are actually countless tiny caveats, and with that in mind you should generally stick to using this library as it is documented. Using undocumented features is exceptionally unpredictable due to the nature of this tool, and things may work radically different under the hood in the future.

It can also do some fancier things with allowing array values to reference other values in the same array, and for reading various common config file formats. That's outside the scope of this page though. See the documentation in the repository for more about all that fun stuff.

[Source code on GitHub](https://github.com/jobyone/flatrr)