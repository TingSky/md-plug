function createNav() {
	var h2 = document.getElementsByTagName('h2'),
		titles = [],
		subTitles = [];
	for (var i = 0; i < h2.length; i++) {
		titles[i] = h2[i].innerText;
		//subTitles[i] = getSubTitle(h2[i]);
		h2[i].id = 'title_' + i;
		var sub = [];
		var h3 = getH3(h2[i], []);
		//console.log(h3);
		for (var j = 0; j < h3.length; j++) {
			sub[j] = h3[j].innerText;
			h3[j].id = 'sub_title_' + i + '_' + j;
		}
		subTitles[i]  = sub;

	}

	//console.log(subTitles);
	buildUiNav(titles, subTitles);
}
//构建列表
function buildUiNav(data, dataSub) {
	var div = document.createElement('div');
	div.className = 'navigation transition';
	div.id = 'nav';
	div.draggable = true;

	var dl = '<dl><dt>目录</dt>';
	dl += '<span class="close" title="隐藏目录">X</span>';
	for (var i = 0; i < data.length; i++) {
		dl += '<dd><a href="#title_' + i + '" title="'+ data[i] +'"><b></b>'+ data[i] +'</a>';
		if (dataSub[i].length > 0) {
			dl += '<ul>';
			for (var j = 0; j < dataSub[i].length; j++) {
				dl += '<li><a href="#sub_title_' + i + '_' + j + '" title="' + dataSub[i][j] + '"><b></b>' + dataSub[i][j] + '</a></li>';
			};
			dl += '</ul>';
			//dl += buildUiNavSub(dataSub[i]);
			
		}
		
		dl += '</dd>';
	}
	dl += '<div style="margin:10px 0"><input type="checkbox" id="hideImg" />截图太丑就活该被折叠</div>';
	dl += '</dl>';
	div.innerHTML += dl;
	div.onmouseover = function(){
		div.className = "navigation";
	}
	div.onmouseout = function(){
		div.className = "navigation transition";
	}
	document.body.appendChild(div);
}
// //构建二级列表
// function buildUiNavSub(data) {
// 	var html = '';
// 	for (var i = 0; i < data.length; i++) {
// 		html += '<li><a href="#sub_title_'+ i +'" title="'+ data[i] +'"><b></b>'+ data[i] +'</a></li>';
// 	};
// 	return html;
// }

//递归获取h3标签，直到遇到下一个h2
function getH3(obj, arr) {
	var nextElement = getNextElement(obj);
	var h3 = nextElement.tagName == 'H3' ? nextElement : nextElement.getElementsByTagName('H3');
	arr = arr.concat(h3);
	if (getNextElement(nextElement)) {
		if (getNextElement(nextElement).tagName != 'H2' && getNextElement(nextElement).nodeType == 1) {
			return getH3(nextElement, arr);
		}
	}
	return arrayDownLevel(arr);
}
//获取下一个dom节点
function getNextElement(obj) {
	var ret = null;
	if (obj.nextSibling) {
		ret = obj.nextSibling.nodeType == 1 ? ret = obj.nextSibling : getNextElement(obj.nextSibling);
	}
	return ret;
}
//数组降维2变1
function arrayDownLevel(arr) {
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			ret.push(arr[i][j]);
		};
	};
	return ret;
}
//绑定事件
function addEvent() {
	var obj = document.getElementById('nav');
	//console.log(obj);
	var dd = obj.getElementsByTagName('dd');
	var li = obj.getElementsByTagName('li');
	var close = obj.getElementsByTagName('span');
	var hideImg = document.getElementById('hideImg');
	for (var i = 0; i < dd.length; i++) {
		dd[i].addEventListener('click',function() {
			clickDd(this);
		}, false);
	};
	for (var i = 0; i < li.length; i++) {
		li[i].addEventListener('click',function() {
			clickLi(this);
		}, false);
	};
	close[0].addEventListener('click',function(){
		clickCl(this , obj);
	},false);
	hideImg.addEventListener('click',function(){
		clickHi(this);
	}, false);


}
//点击一级标题
function clickDd(obj) {
	var cls = obj.className;
	resetClass(obj, 'dd');
	if (cls == 'on') {
		obj.className = '';
	}
	else {
		obj.className = 'on';
	}
}
//点击二级标题
function clickLi(obj) {
	resetClass(obj, 'li');
	var cls = obj.className;
	if (cls != 'on') {
		obj.className = 'on';
	}
	event.stopPropagation();
}

//点击目录开关
function clickCl(obj , nav){
	var isOpen = nav.style.marginLeft != '-999px' ? 1 : 0;
	if(isOpen){
		nav.style.marginLeft = '-999px';
		obj.innerText = '...'
		obj.title = '显示目录';
		obj.style.left = '15px';
	}else{
		nav.style.marginLeft = '0px';
		obj.innerText = 'X'
		obj.title = '隐藏目录';
		obj.style.left = '195px';
	}
}

//点击无图开关
function clickHi(obj) {
	var imgs = document.getElementsByTagName('img');
	var tus = document.getElementsByClassName('tu');
	if(obj.checked){//无图
		for(var i = 0 ; i<imgs.length ; i++){
			hidePic(imgs[i]);
		}
	}else{
		for(var i = 0; i<tus.length ; i++){
			showPic(tus[i]);
		}
	}
}

//点击图片隐藏
function hidePic(obj){
	obj = obj instanceof MouseEvent ? obj.target : obj;
	obj.style.display = 'none';
	obj.previousSibling.style.display = 'block';
}

//点击（图）显示图片
function showPic(obj){
	console.log(obj instanceof MouseEvent);
	obj = obj instanceof MouseEvent ? obj.target : obj;
	obj.style.display = 'none';
	obj.nextSibling.style.display = 'block';
}

//创建（图），绑定点击事件
function createTu(){
	var imgs = document.getElementsByTagName('img');
	for(var i = 0 ; i<imgs.length ; i++){
		imgs[i].onclick = hidePic;

		var show = document.createElement('a');
		show.href = 'javascript:';
		show.title = '（图）';
		show.onclick = showPic;
		show.innerText = '（图）';
		show.className = 'tu';
		imgs[i].parentNode.insertBefore(show , imgs[i]);
		show.style.display = 'none';
	}		
}

//重置class
function resetClass(obj, tag) {
	for (var i = 0; i < obj.parentNode.getElementsByTagName(tag).length; i++) {
		obj.parentNode.getElementsByTagName(tag)[i].className = '';
	};
}
window.onload = function() {
	document.body.innerHTML = '<div id="center">' + document.body.innerHTML + '</div>';
	createNav();
	addEvent();
	createTu();
}
