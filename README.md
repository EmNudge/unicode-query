<div align=center>

# Unicode Query

A Unicode querying engine. Built for [Unicode Lookup](https://github.com/EmNudge/unicode-lookup).

> [!WARNING]
> This project is still in active development. 
> It is currently in testing stages and not ready for publishing.

</div>

## Goals

This project is built for Unicode Lookup and as such has a few requirements in its development: fast to run, quick to update, and easy to search.

### Fast
Interaction with the querying engine should be fast and non-blocking. Our code should execute quickly and off the main thread.

Speed is benchmarked on V8 against alternative methods. There isn't much competition and it would take years to build every possible implementation to truly know the fastest, but, at the least, the development of this library involves a bunch of quick tests when exploring routes for optimizations.
 
### Quick To Update
We're working on a dataset that has an [official repository](https://unicode.org/Public/UNIDATA/). As new versions are released, it's important that we can update our local data quickly without much effort.

If we decide to reformat our unicode data into a format that better suites our application, a script should be included to automate the process.

### Simple And Flexible
The original application was targeted towards research, but has reached audiences who need a much more casual use. We should allow for an API with simple defaults, but include mechanisms to customize behavior for more advanced needs.

This was initially exposed as a "simple search" and "advanced search" API. The former took in a string which was parsed and returned matches most approximating the search query. Advanced search takes in an array of filters to get at more specific data.
