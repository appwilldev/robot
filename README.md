Robot
======
If you want to fetch resource from tens of thousands of web pages for your every job, then this project can help you to simplify you jobs.

How To Use
----------
There are two steps for you job.
* Find out one resource from the web site.
* Give the route how you find the resource in the predefined format. There is a template name template.xml under scripts dir.

Examples see signal.xml and multi.xml

Use: 
    ./main.js scripts/signal.xml

TODO
----
* improve multi target problem. currently, only support one target named url. originally designed for four targets, but this design made the process had, so, a brand new design is need.
* add filter system.
* add Json support.
* add download system.
* add client web pages which is used to filter the pages manually.

Problems
---------
* async http request with Recursive Request [Used httysync to solved thie problem]

Apache License
