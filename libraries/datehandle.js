(function(w){
	var add0=function(obj){
		if(obj<10){
			obj="0"+obj;
		}
		return obj;
	};
	w.datestr=function(obj,type,ttp){
		if(obj==null||obj==''){
			obj=new Date();
		}
	    obj=new Date(obj);
		var year=obj.getFullYear();
		var month=add0(obj.getMonth()+1);
		var day=add0(obj.getDate());
		var hour=add0(obj.getHours());
		var minute=add0(obj.getMinutes());
		var second=add0(obj.getSeconds());
		var result=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
		if(type==null){
			return result;
		};
		switch(type){
		    case 'yyyy-MM-dd': result = year + "-" + month + "-" + day; break;
		    case 'yyyyMMdd': result = year + month + day; break;
			case 'yyyy-MM':result=year+"-"+month;break;
			case 'MM-dd  hh:mm:ss':result=month+"-"+day+" "+hour+":"+minute+":"+second;break;
			case 'hh:mm:ss':result=hour+":"+minute+":"+second;break;
			case 'hh:mm':result=hour+":"+minute;break;
			default :break;						
		}
		return result;
	}
 Date.prototype.dateInfo=function(type,ttp){
     return datestr(this, type, ttp);
 };
})(window);
