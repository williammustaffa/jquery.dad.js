# jquery.dad.js
DAD: A simple and awesome Drag And Drop plugin!

##1.Installation
Insert the basic css file:
```
<link rel="stylesheet" href="jquery.dad.css">
```` 
And the dad plugin file after jquery.
```
<script src='jquery.min.js'></script>
<script src='jquery.dad.js'></script>
```
##2.Usage
Create a group of DOM elements that can be resorted via drag and drop inside the parent container 'demo'.
```
<div class="demo">
  <div>...</div>
  <div>...</div>
  <div>...</div>
  <div>...</div>
</div>
```
and just call it:
```
$(function(){ 
  $('.demo').dad(options);
}) 
```
##3.Options
You can call options width a JSON object.
* target: '.selector'

For more info visit the [plugin website](http://www.konsolestudio.com/dad)







