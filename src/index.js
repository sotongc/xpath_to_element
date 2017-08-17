//*[@id="5"]/div[1]
//*[@id="s_tab"]
//*[@id="container"]/div[2]
//*[@id="article_content"]/p[20]
//*[@id="article_details"]/div[6]
//html/body
//*[@id="1"]/div[2]/em[6]
//*[@id="sixapart-standard"]/head
//*[@id="sixapart-standard"]/head/title
//*[@id="cnblogs_post_body"]/p[3]
//*[@id="cnblogs_post_body"]/p[1]
//*[@id="cnblogs_post_body"]/div[1]/a

var isUnique=(pattern)=>{
	return /(html|body|head|title|\*\[\@id\=\"[\w\d]+\"\])/.test(pattern);
};

var decopose_xpath=(xpath)=>{
	let chain=[];
	let pattern=/(\/|\/\/)(\*|[a-z]+)(\[(\@[A-Za-z0-9-]+\=\"[\d\w]*\"|\d+)\])?/g;

	xpath.replace(pattern,($1)=>{
		chain.push($1);
		return $1;
	});
	return chain;
};

var xpath_chain_reduce=(chain)=>{
	let indexof_first_unique=0;

	for(let i=0;i<chain.length;i++){
		isUnique(chain[i]) &&(indexof_first_unique=i);
	}

	return chain.slice(indexof_first_unique);
};

var judge_type=(regexp,pattern)=>{
	let type=-1;
	Object.keys(regexp).slice(1).some((key,i)=>{
		type=regexp[key].test(pattern)?i:-1;
		return !type==-1;
	});
	return type;
};

var selector={
	id:(xpath)=>{
		return xpath.replace(/(\/|\/\/)?(\*\[\@id\=\"([\w\d-]+)\"\])/,($1,$2,$3,$4)=>{
			return typeof $4==="number"?`*[@id='${$4}']`:`#${$4}`;
		});
	},
	class:(xpath)=>{
		return xpath.replace(/(\/|\/\/)?(\*\[\@class\=\"([\w\d-]+)\"\])/,($1,$2,$3,$4)=>{
			return ($2==="\u005c"?"\u003e":($2==="\u005c\u005c"?"\u0020":""))+"\u002e"+$4;
		});
	},
	tag:(xpath)=>{
		return xpath.replace(/(\/|\/\/)?([a-z]+)(\[\d+\])?/,($1,$2,$3,$4)=>{
			return ($2==="\u005c"?"\u003e":($2==="\u005c\u005c"?"\u0020":""))+$3+($4-1)+",";
		});
	},
	attr:(xpath)=>{
		return xpath.replace(/(\/|\/\/)?(\*\[\@(?!id|class)([\w-]+)\=\"([\w\d-]+)\"\])/,($1,$2,$3,$4,$5)=>{
			return ($2==="\u005c"?"\u003e":($2==="\u005c\u005c"?"\u0020":""))+"["+$4+"='"+$5+"']";
		});
	}
};

var handler=[selector.id,selector.class,selector.tag,selector.attr];

var select_target_child=(element,tagname,index)=>{
	let nodelist=element.children;
	let childlist=[];

	for(let i=0;i<nodelist.length;i++;){
		if(nodelist[i].tagName.toLowerCase()===tagname){
			childlist.push(nodelist[i]);
		}
	}

	return childlist[index];
};



var compiler=(chain)=>{
	let regexp={
		is_first:/^\/{1,2}/,
		is_id:/\/+\*\[\@id\=\"[\w\d-]+\"\]/,
		is_class:/\/+\*\[\@class\=\"[\w\d_-]+\"\]/,
		is_tag:/\/+[a-z]+(\[\d+\])?/,
		is_attr:/\/+(\*|[a-z]+)\[\@(?!id|class)[\w-]+\=\"[\w\d_-]+\"\]/
	};

	let raw_selector="";

	return chain.map((xpath,i)=>{
		//remove the directory for the root node
		if(!i)
			xpath=xpath.replace(regexp.is_first,"");

		//compile the xpath to the selector
		raw_selector+=handler(judge_type(regexp,xpath));

		//#ab>.tip[1],>a[4]
		//#ab>.tip[1], a[4]
		let selectors=raw_selector.replace(/\,\>/,">")
	});
};