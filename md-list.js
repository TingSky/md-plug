//获取h2、h3数据
function createNav() {
	var h2 = document.getElementsByTagName('h2'),
		titles = [],
		subTitles = [];
	for (var i = 0; i < h2.length; i++) {
		titles[i] = h2[i].innerText;
		subTitles[i] = getSubTitle(h2[i])
		//h2[i].id = 'title_' + i;
	}
	//console.log(subTitles);
	buildUiNav(titles, subTitles);
}
//构建列表
function buildUiNav(data, dataSub) {
	var div = document.createElement('div');
	div.className = 'navigation';
	div.id = 'nav';
	var dl = '<dl><dt>目录</dt>';
	for (var i = 0; i < data.length; i++) {
		dl += '<dd><a href="javascript:" title="'+ data[i] +'"><b></b>'+ data[i] +'</a>';
		if (dataSub[i].length > 0) {
			dl += '<ul>';
			dl += buildUiNavSub(dataSub[i]);
			dl += '</ul>';
		}
		dl += '</dd>';
	}
	dl += '</dl>';
	div.innerHTML = dl;
	document.body.appendChild(div);
}
//构建二级列表
function buildUiNavSub(data) {
	var html = '';
	for (var i = 0; i < data.length; i++) {
		html += '<li><a href="#sub_title_'+ i +'" title="'+ data[i] +'"><b></b>'+ data[i] +'</a></li>';
	};
	return html;
}
//获得二级标题
function getSubTitle(h2) {
	var subTitles = [];
	var h3 = getH3(h2, []);
	console.log(h3);
	for (var i = 0; i < h3.length; i++) {
		subTitles[i] = h3[i].innerText;
		h3[i].id = 'sub_title_' + i;
	}
	return subTitles;
}
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
//重置class
function resetClass(obj, tag) {
	for (var i = 0; i < obj.parentNode.getElementsByTagName(tag).length; i++) {
		obj.parentNode.getElementsByTagName(tag)[i].className = '';
	};
}
window.onload = function() {
	createNav();
	addEvent();
}
