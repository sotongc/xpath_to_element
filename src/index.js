//*[@id="5"]/div[1]
//*[@id="s_tab"]
//*[@id="container"]/div[2]
//*[@id="article_content"]/p[20]
//*[@id="article_details"]/div[6]
//html/body
//*[@id="1"]/div[2]/em[6]
//*[@id="sixapart-standard"]/head
//*[@id="sixapart-standard"]/head/title


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
	let unique=/(html|body|head|title|\*\[\@id\=\"[\w\d]+\"\])/;
	let indexof_first_unique=0;

	for(let i=0;i<chain.length;i++){
		unique.test(chain[i])&&(indexof_first_unique=i);
	}

	return chain.slice(indexof_first_unique);
};