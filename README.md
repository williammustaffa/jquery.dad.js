# jquery.dad.js
DAD: A simple and awesome Drag And Drop plugin!

## 1.Installation
Insert the basic css file:
```
<link rel="stylesheet" href="jquery.dad.css">
```` 
And the dad plugin file after jquery.
```
<script src='jquery.min.js'></script>
<script src='jquery.dad.js'></script>
```
## 2.Usage
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
## 3.Options
You can call options width a JSON object.
* target: '.selector';
* draggable: '.selector' from the target child div. 
* callback: function(e){} where e is the jquery object for the dropped element
* placeholder: string with the placeholder text on draggable area

## 4.Functions
* n.addDropzone(selector,function(e){});
Sample:
```
var n=$('.demo').dad();
n.addDropzone('.dropzone',function(e){
  console.log(e); //e is the jquery object for the dropped element
})
```
* n.activate()
```
var n=$('.demo').dad();
n.activate();
```
* n.deactivate()
```
var n=$('.demo').dad();
n.deactivate();
```


For more info visit the [plugin website](http://konsole.studio/dad)


[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=MRH3WC7BR5WEE&lc=US&item_name=jquery%2edad%2ejs&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

